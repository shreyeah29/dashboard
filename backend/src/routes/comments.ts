import express from 'express';
import { body, validationResult } from 'express-validator';
import { Comment } from '../models/Comment';
import { Project } from '../models/Project';
import { adminOnly } from '../middleware/auth';

const router = express.Router();

// Get comments for project (public)
router.get('/projects/:id/comments', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const comments = await Comment.find({ projectId: req.params.id })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create comment (admin only)
router.post('/projects/:id/comments',
  adminOnly,
  [
    body('text').notEmpty().withMessage('Comment text is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const project = await Project.findById(req.params.id);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const { text } = req.body;

      const comment = new Comment({
        projectId: req.params.id,
        author: 'admin',
        text
      });

      await comment.save();
      res.status(201).json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Delete comment (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
