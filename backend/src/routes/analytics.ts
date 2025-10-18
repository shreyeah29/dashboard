import express from 'express';
import { Company } from '../models/Company';
import { Project } from '../models/Project';
import { Document } from '../models/Document';
import { Comment } from '../models/Comment';
import { adminOnly } from '../middleware/auth';

const router = express.Router();

// Get analytics summary (admin only)
router.get('/summary', adminOnly, async (req, res) => {
  try {
    // Get basic counts
    const companyCount = await Company.countDocuments();
    const projectCount = await Project.countDocuments();
    
    // Get documents uploaded this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const docCountThisMonth = await Document.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Get recent activity (last 10 activities)
    const recentDocuments = await Document.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('projectId', 'title')
      .lean();

    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('projectId', 'title')
      .lean();

    const recentActivity = [
      ...recentDocuments.map(doc => ({
        type: 'document_upload',
        description: `Document "${doc.name}" uploaded to project "${doc.projectId?.title || 'Unknown'}"`,
        timestamp: doc.createdAt
      })),
      ...recentComments.map(comment => ({
        type: 'comment_added',
        description: `Comment added to project "${comment.projectId?.title || 'Unknown'}"`,
        timestamp: comment.createdAt
      }))
    ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

    // Get project status distribution
    const projectStatusStats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get documents by type
    const documentTypeStats = await Document.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      companyCount,
      projectCount,
      docCountThisMonth,
      recentActivity,
      projectStatusStats,
      documentTypeStats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
