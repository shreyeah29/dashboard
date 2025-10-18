import express from 'express';
import { body, validationResult } from 'express-validator';
import { Project } from '../models/Project';
import { Company } from '../models/Company';
import { adminOnly } from '../middleware/auth';

const router = express.Router();

// Get projects by company slug (public)
router.get('/companies/:slug/projects', async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const projects = await Project.find({ companyId: company._id })
      .populate('documents')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get project by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })
      .populate('companyId', 'name slug')
      .populate('documents');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create project (admin only)
router.post('/',
  adminOnly,
  [
    body('companyId').isMongoId().withMessage('Valid company ID is required'),
    body('title').notEmpty().withMessage('Project title is required'),
    body('description').notEmpty().withMessage('Project description is required'),
    body('status').isIn(['Planned', 'In Progress', 'Completed']).withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { companyId, title, description, status, bannerImage, team, milestones } = req.body;

      // Verify company exists
      const company = await Company.findById(companyId);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      const project = new Project({
        companyId,
        title,
        description,
        status: status || 'Planned',
        bannerImage: bannerImage || '',
        team: team || [],
        milestones: milestones || []
      });

      await project.save();
      await project.populate('companyId', 'name slug');
      
      res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      if (error.code === 11000) {
        res.status(400).json({ message: 'Project with this title already exists' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
);

// Update project (admin only)
router.patch('/:id',
  adminOnly,
  [
    body('title').optional().notEmpty().withMessage('Project title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Project description cannot be empty'),
    body('status').optional().isIn(['Planned', 'In Progress', 'Completed']).withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, status, bannerImage, team, milestones } = req.body;
      const updateData: any = {};

      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (status) updateData.status = status;
      if (bannerImage !== undefined) updateData.bannerImage = bannerImage;
      if (team) updateData.team = team;
      if (milestones) updateData.milestones = milestones;

      const project = await Project.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('companyId', 'name slug').populate('documents');

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      console.error('Error updating project:', error);
      if (error.code === 11000) {
        res.status(400).json({ message: 'Project with this title already exists' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
);

// Delete project (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
