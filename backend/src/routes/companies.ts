import express from 'express';
import { body, validationResult } from 'express-validator';
import { Company } from '../models/Company';
import { adminOnly } from '../middleware/auth';

const router = express.Router();

// Get all companies (public)
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get company by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create company (admin only)
router.post('/', 
  adminOnly,
  [
    body('name').notEmpty().withMessage('Company name is required'),
    body('overview').notEmpty().withMessage('Company overview is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, overview, heroImage } = req.body;

      const company = new Company({
        name,
        overview,
        heroImage: heroImage || ''
      });

      await company.save();
      res.status(201).json(company);
    } catch (error) {
      console.error('Error creating company:', error);
      if (error.code === 11000) {
        res.status(400).json({ message: 'Company with this name already exists' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
);

// Update company (admin only)
router.patch('/:id',
  adminOnly,
  [
    body('name').optional().notEmpty().withMessage('Company name cannot be empty'),
    body('overview').optional().notEmpty().withMessage('Company overview cannot be empty')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, overview, heroImage } = req.body;
      const updateData: any = {};

      if (name) updateData.name = name;
      if (overview) updateData.overview = overview;
      if (heroImage !== undefined) updateData.heroImage = heroImage;

      const company = await Company.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      res.json(company);
    } catch (error) {
      console.error('Error updating company:', error);
      if (error.code === 11000) {
        res.status(400).json({ message: 'Company with this name already exists' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
);

// Delete company (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
