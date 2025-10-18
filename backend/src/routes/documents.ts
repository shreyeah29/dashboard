import express from 'express';
import { body, validationResult } from 'express-validator';
import { Document } from '../models/Document';
import { Project } from '../models/Project';
import { Company } from '../models/Company';
import { adminOnly } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { generatePresignedUrl, deleteFromS3, getFileType } from '../utils/s3';

const router = express.Router();

// Upload document to project (admin only)
router.post('/projects/:id/documents', 
  adminOnly,
  upload.single('document'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const company = await Company.findById(project.companyId);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      const document = new Document({
        projectId: project._id,
        name: req.file.originalname,
        type: getFileType(req.file.mimetype),
        s3Key: req.file.key,
        size: req.file.size,
        uploadedBy: 'admin'
      });

      await document.save();

      // Add document to project
      project.documents.push(document._id);
      await project.save();

      // Generate view URL for immediate use
      const viewUrl = await generatePresignedUrl(req.file.key);

      res.status(201).json({
        document,
        viewUrl
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Get document view URL (public)
router.get('/:id/view', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const viewUrl = await generatePresignedUrl(document.s3Key);
    
    res.json({ 
      viewUrl,
      document: {
        name: document.name,
        type: document.type,
        size: document.size
      }
    });
  } catch (error) {
    console.error('Error generating view URL:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete document (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Remove from S3
    await deleteFromS3(document.s3Key);

    // Remove from project
    await Project.findByIdAndUpdate(
      document.projectId,
      { $pull: { documents: document._id } }
    );

    // Delete document record
    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
