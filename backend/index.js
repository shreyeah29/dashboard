// Simple JavaScript version for deployment
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { upload, getFileType, generateFileUrl, deleteLocalFile } = require('./src/config/s3');
const Project = require('./src/models/Project');
const Document = require('./src/models/Document');
const Company = require('./src/models/Company');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:5173',
      'https://dashboard-frontend-six-nu.vercel.app',
      'https://dashboard-frontend-fe95ng0cq-legal-links-projects-bc18cb27.vercel.app',
      'https://onedicius.com',
      'https://www.onedicius.com'
    ];
    
    console.log('CORS request from origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // Allow requests with no origin (like mobile apps, curl requests, or local file access)
    if (!origin) return callback(null, true);
    
    // Check exact match first
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } 
    // Allow onedicius.com domain (with or without www)
    else if (origin.includes('onedicius.com')) {
      console.log('Allowing onedicius.com domain:', origin);
      callback(null, true);
    } 
    // Allow any Vercel deployment URL for this project
    else if (origin.includes('dashboard-frontend') && origin.includes('vercel.app')) {
      console.log('Allowing Vercel deployment URL:', origin);
      callback(null, true);
    }
    // Allow any subdomain of vercel.app for this project
    else if (origin.includes('legal-links-projects') && origin.includes('vercel.app')) {
      console.log('Allowing Vercel project URL:', origin);
      callback(null, true);
    }
    else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Debug endpoint to check company by ID
app.get('/debug/company/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Looking for company with ID:', id, 'Type:', typeof id);
    
    // Try to find by string ID
    const companyByString = await Company.findOne({ _id: id });
    console.log('Company found by string ID:', companyByString ? 'YES' : 'NO');
    
    // Try to find by ObjectId
    let companyByObjectId = null;
    try {
      companyByObjectId = await Company.findById(id);
      console.log('Company found by ObjectId:', companyByObjectId ? 'YES' : 'NO');
    } catch (error) {
      console.log('ObjectId lookup failed:', error.message);
    }
    
    res.json({
      id,
      type: typeof id,
      foundByString: !!companyByString,
      foundByObjectId: !!companyByObjectId,
      companyByString,
      companyByObjectId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Basic API routes
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    message: 'Edicius Group Portal API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Companies endpoints
app.get('/api/v1/companies', async (req, res) => {
  try {
    // Ensure MongoDB connection before querying
    if (mongoose.connection.readyState !== 1) {
      // 1 = connected, 0 = disconnected, 2 = connecting, 3 = disconnecting
      console.log('MongoDB not connected, readyState:', mongoose.connection.readyState);
      await ensureConnection();
    }
    
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies: ' + error.message });
  }
});

app.get('/api/v1/companies/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const company = await Company.findOne({ slug });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Auth login endpoint
app.post('/api/v1/auth/admin/login', (req, res) => {
  const { password } = req.body;
  const adminSecret = process.env.ADMIN_SECRET || 'admin123';
  
  console.log('Login attempt with password:', password);
  console.log('Expected password:', adminSecret);
  
  if (password === adminSecret) {
    // Create a simple session token (in production, use proper JWT)
    const token = 'admin-session-' + Date.now();
    console.log('Login successful, setting token:', token);
    
    // Set httpOnly cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: false, // Set to false for now to test
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      domain: undefined // Let browser handle domain
    });
    
    console.log('Cookie set, sending response');
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { isAdmin: true, role: 'admin' },
      token: token // Also send token in response for cross-origin issues
    });
  } else {
    console.log('Login failed - invalid password');
    res.status(401).json({ 
      success: false, 
      message: 'Invalid password' 
    });
  }
});

// Auth verify endpoint
app.get('/api/v1/auth/admin/verify', (req, res) => {
  const cookieToken = req.cookies.adminToken;
  const headerToken = req.headers.authorization?.replace('Bearer ', '');
  const token = cookieToken || headerToken;
  
  console.log('Verify endpoint called, cookies:', req.cookies);
  console.log('Authorization header:', req.headers.authorization);
  console.log('Cookie token:', cookieToken);
  console.log('Header token:', headerToken);
  console.log('Using token:', token);
  
  if (token && token.startsWith('admin-session-')) {
    console.log('Token is valid, returning success');
    res.json({ 
      authenticated: true, 
      user: { isAdmin: true, role: 'admin' } 
    });
  } else {
    console.log('Token is invalid or missing');
    res.status(401).json({ 
      authenticated: false, 
      message: 'Not authenticated' 
    });
  }
});

// Auth logout endpoint
app.post('/api/v1/auth/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Documents endpoints - returns only company-level documents (not project/unit docs)
app.get('/api/v1/documents', async (req, res) => {
  try {
    // Get "Company Documents" projects only (type: company_docs)
    const companyDocsProjects = await Project.find({ type: 'company_docs' }).select('_id');
    const projectIds = companyDocsProjects.map(p => p._id);

    const documents = await Document.find({ projectId: { $in: projectIds } })
      .populate('projectId', 'name companyId')
      .populate({
        path: 'projectId',
        populate: {
          path: 'companyId',
          select: 'name'
        }
      })
      .sort({ uploadedAt: -1 });

    // Transform documents to match frontend expectations
    const transformedDocuments = documents.map(doc => ({
      _id: doc._id,
      name: doc.name,
      type: doc.fileType,
      size: `${(doc.fileSize / 1024 / 1024).toFixed(1)} MB`,
      company: doc.projectId?.companyId?.name || 'Unknown Company',
      project: doc.projectId?.name || 'Unknown Project',
      tags: doc.tags || [],
      uploadedBy: doc.uploadedBy || 'Admin User',
      uploadedAt: new Date(doc.uploadedAt).toISOString().split('T')[0],
      url: doc.s3Url
    }));

    res.json(transformedDocuments);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Real upload endpoint is handled by the project-specific upload endpoint below

// Real delete endpoint is handled by the project-specific delete endpoint below

// Projects endpoints - returns type: 'project' by default, or type: 'unit' when ?type=unit
app.get('/api/v1/projects', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type === 'unit'
      ? { type: 'unit' }
      : { $or: [{ type: 'project' }, { type: { $exists: false } }] };
    const projects = await Project.find(filter)
      .populate('companyId', 'name slug')
      .populate('documents')
      .sort({ createdAt: -1 });

    // Transform the data to include company name for frontend compatibility
    const transformedProjects = projects.map(project => {
      const projectObj = project.toObject();
      const companyName = projectObj.companyId && projectObj.companyId.name ? projectObj.companyId.name : 'Unknown Company';
      return {
        ...projectObj,
        company: companyName
      };
    });

    res.json(transformedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/v1/projects', async (req, res) => {
  try {
    const { name, companyId, description, startDate, endDate, priority, type } = req.body;
    
    console.log('Project creation request body:', req.body);
    console.log('CompanyId received:', companyId, 'Type:', typeof companyId);
    
    // Validate required fields
    if (!name || !companyId || !description) {
      return res.status(400).json({ error: 'Name, companyId, and description are required' });
    }
    
    // Check if company exists
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Create new project/unit (type: 'unit' from company page, 'project' from Projects page)
    const newProject = new Project({
      name,
      companyId,
      description,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      priority: priority || 'Medium',
      type: type || 'project',
      status: 'Planning',
      progress: 0,
      teamSize: 0,
      documents: [],
      milestones: []
    });
    
    const savedProject = await newProject.save();
    await savedProject.populate('companyId', 'name slug');
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: savedProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Get projects by company slug
app.get('/api/v1/projects/companies/:slug/projects', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Find company by slug
    const company = await Company.findOne({ slug });
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    // Find units for this company (type: 'unit' only)
    const projects = await Project.find({ companyId: company._id, type: 'unit' })
      .populate('documents')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching company units:', error);
    res.status(500).json({ error: 'Failed to fetch company projects' });
  }
});

// Get project by slug
app.get('/api/v1/projects/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({ slug })
      .populate('companyId', 'name slug')
      .populate('documents');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Update project
app.patch('/api/v1/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate required fields
    if (!updateData.name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Check if company exists if companyId is provided
    if (updateData.companyId) {
      const company = await Company.findById(updateData.companyId);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('companyId').populate('documents');

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
app.delete('/api/v1/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project
    const project = await Project.findById(id).populate('documents');
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete associated documents and their files
    for (const document of project.documents) {
      try {
        // Delete the local file
        await deleteLocalFile(document.s3Key);
        // Delete the document record
        await Document.findByIdAndDelete(document._id);
      } catch (error) {
        console.error('Error deleting document:', document._id, error);
      }
    }

    // Delete the project
    await Project.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Company document upload (Documents page - company presentation docs only)
app.post('/api/v1/companies/:companyId/documents', upload.single('document'), async (req, res) => {
  try {
    const { companyId } = req.params;
    const { tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Find or create "Company Documents" project for this company
    let project = await Project.findOne({ companyId, type: 'company_docs' });
    if (!project) {
      project = new Project({
        name: 'Company Documents',
        slug: `${company.slug}-company-documents`,
        companyId,
        description: 'Company presentation and general documents',
        type: 'company_docs',
        documents: []
      });
      await project.save();
    }

    const document = new Document({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      projectId: project._id,
      fileType: getFileType(req.file.mimetype),
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      s3Key: req.file.filename,
      s3Url: generateFileUrl(req.file.filename),
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      uploadedBy: 'admin'
    });
    const savedDocument = await document.save();

    project.documents.push(savedDocument._id);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: savedDocument
    });
  } catch (error) {
    console.error('Error uploading company document:', error);
    res.status(500).json({ error: 'Failed to upload document', details: error.message });
  }
});

// Document upload endpoints (for projects/units - Manage Files)
app.post('/api/v1/projects/:projectId/documents', upload.single('document'), async (req, res) => {
  try {
    console.log('Document upload request:', req.params, req.body, req.file);
    
    const { projectId } = req.params;
    const { tags } = req.body;
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('File uploaded:', req.file);
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      console.log('Project not found:', projectId);
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log('Project found:', project.name);
    
    // Create document record
    const document = new Document({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      projectId: projectId,
      fileType: getFileType(req.file.mimetype),
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      s3Key: req.file.filename, // Store local filename
      s3Url: generateFileUrl(req.file.filename), // Generate local URL
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      uploadedBy: 'admin'
    });
    
    console.log('Creating document:', document);
    const savedDocument = await document.save();
    console.log('Document saved:', savedDocument._id);
    
    // Add document to project
    project.documents.push(savedDocument._id);
    await project.save();
    console.log('Document added to project');
    
    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document: savedDocument
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document', details: error.message });
  }
});

// Get documents for a project
app.get('/api/v1/projects/:projectId/documents', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const documents = await Document.find({ projectId })
      .sort({ uploadedAt: -1 });
    
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Get document by ID with pre-signed URL
app.get('/api/v1/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Update last accessed time
    document.lastAccessed = new Date();
    await document.save();
    
    // Generate local file URL
    const fileUrl = generateFileUrl(document.s3Key);
    
    res.json({
      ...document.toObject(),
      presignedUrl: fileUrl // Use local URL instead of pre-signed URL
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// Delete document
app.delete('/api/v1/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Delete local file
    const deletedLocally = await deleteLocalFile(document.s3Key);
    if (!deletedLocally) {
      console.warn('Failed to delete local file, but continuing with database deletion');
    }
    
    // Remove document from project
    await Project.findByIdAndUpdate(
      document.projectId,
      { $pull: { documents: document._id } }
    );
    
    // Delete document record
    await Document.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Comments endpoints
app.get('/api/v1/comments/projects/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // For now, return empty array since we don't have a Comment model yet
    // This will prevent the 404 errors in the frontend
    res.json([]);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

app.post('/api/v1/comments', async (req, res) => {
  try {
    // For now, return success since we don't have a Comment model yet
    res.json({ success: true, message: 'Comment posted successfully' });
  } catch (error) {
    console.error('Error posting comment:', error);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

// Seed data function
const seedData = async () => {
  try {
    // Check if companies already exist
    const existingCompanies = await Company.countDocuments();
    if (existingCompanies > 0) {
      console.log('Companies already exist, updating images...');
      
      // Update Enterprises image
      await Company.findOneAndUpdate(
        { name: /enterprises/i },
        { heroImage: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' }
      );
      
      // Update Mining image
      await Company.findOneAndUpdate(
        { name: /mining|minerals/i },
        { heroImage: 'https://static.vecteezy.com/system/resources/previews/046/249/257/large_2x/mining-work-background-free-photo.jpg' }
      );
      
      // Update Enterprises overview
      await Company.findOneAndUpdate(
        { name: /enterprises/i },
        { overview: 'Multi-sector B2B venture arm focusing on customer service and Excellence' }
      );
      
      // Update Productions image
      await Company.findOneAndUpdate(
        { name: /productions|entertainment/i },
        { heroImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80' }
      );
      
      console.log('Company images and overview updated');
      return;
    }

    console.log('Seeding database with initial data...');

    // Create companies
    const companies = [
      {
        name: 'Edicius Enterprises Private Limited',
        slug: 'edicius-enterprises-private-limited',
        overview: 'Multi-sector B2B venture arm focusing on customer service and Excellence',
        heroImage: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        sector: 'Multi-sector'
      },
      {
        name: 'Edicius Innovations and Consulting Private Limited',
        slug: 'edicius-innovations-and-consulting-private-limited',
        overview: 'Digital transformation through cutting-edge technology solutions and strategic consulting services.',
        heroImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        sector: 'Technology & Consulting'
      },
      {
        name: 'Edicius Infrastructure and Developers Private Limited',
        slug: 'edicius-infrastructure-and-developers-private-limited',
        overview: 'Sustainable, smart infrastructure solutions for modern cities and eco-friendly construction projects.',
        heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        sector: 'Infrastructure'
      },
      {
        name: 'Edicius Imports and Exports Private Limited',
        slug: 'edicius-imports-and-exports-private-limited',
        overview: 'Seamless global commerce through advanced logistics and international trade solutions.',
        heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        sector: 'Trade & Logistics'
      },
      {
        name: 'Edicius Productions and Entertainment Private Limited',
        slug: 'edicius-productions-and-entertainment-private-limited',
        overview: 'Compelling digital content, film productions, and immersive brand experiences.',
        heroImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        sector: 'Entertainment & Media'
      },
      {
        name: 'Edicius Consumer Products Private Limited',
        slug: 'edicius-consumer-products-private-limited',
        overview: 'Smart consumer goods, personal care, and lifestyle solutions with cutting-edge technology.',
        heroImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        sector: 'Consumer Goods'
      },
      {
        name: 'Edicius Mining and Minerals Private Limited',
        slug: 'edicius-mining-and-minerals-private-limited',
        overview: 'Ethical resource extraction and environmental stewardship with advanced mining technologies.',
        heroImage: 'https://static.vecteezy.com/system/resources/previews/046/249/257/large_2x/mining-work-background-free-photo.jpg',
        sector: 'Mining & Minerals'
      },
      {
        name: 'Edicius Hotels and Hospitality Private Limited',
        slug: 'edicius-hotels-and-hospitality-private-limited',
        overview: 'Exceptional travel experiences through luxury accommodations and sustainable tourism practices.',
        heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        sector: 'Hospitality'
      }
    ];

    const createdCompanies = await Company.insertMany(companies);
    console.log(`Created ${createdCompanies.length} companies`);

    // Create sample projects
    const projects = [
      {
        name: 'Digital Transformation Platform',
        companyId: createdCompanies[1]._id, // Edicius Innovations
        description: 'Creating a comprehensive digital transformation platform for enterprise clients with AI integration and cloud infrastructure.',
        status: 'In Progress',
        progress: 65,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-31'),
        teamSize: 12,
        priority: 'High',
        milestones: [
          { name: 'Project Planning', completed: true, dueDate: new Date('2024-02-01') },
          { name: 'System Architecture', completed: true, dueDate: new Date('2024-03-15') },
          { name: 'Core Development', completed: true, dueDate: new Date('2024-06-30') },
          { name: 'Testing & QA', completed: false, dueDate: new Date('2024-09-30') },
          { name: 'Deployment', completed: false, dueDate: new Date('2024-12-31') }
        ]
      },
      {
        name: 'Smart City Infrastructure',
        companyId: createdCompanies[2]._id, // Edicius Infrastructure
        description: 'Developing sustainable smart city solutions with IoT integration and renewable energy systems.',
        status: 'In Progress',
        progress: 45,
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-11-30'),
        teamSize: 15,
        priority: 'High',
        milestones: [
          { name: 'Feasibility Study', completed: true, dueDate: new Date('2024-03-01') },
          { name: 'Design Phase', completed: true, dueDate: new Date('2024-05-15') },
          { name: 'Infrastructure Setup', completed: false, dueDate: new Date('2024-08-30') },
          { name: 'IoT Integration', completed: false, dueDate: new Date('2024-10-15') },
          { name: 'Testing & Launch', completed: false, dueDate: new Date('2024-11-30') }
        ]
      }
    ];

    const createdProjects = await Project.insertMany(projects);
    console.log(`Created ${createdProjects.length} projects`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Track if we're already trying to connect
let isConnecting = false;

// Connect to MongoDB with automatic reconnection
const connectDB = async () => {
  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    console.log('Connection attempt already in progress, waiting...');
    return;
  }

  // If already connected, return
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    isConnecting = true;
    
    if (process.env.MONGODB_URI) {
      // Connection options for better reliability
      const connectionOptions = {
        serverSelectionTimeoutMS: 10000, // Timeout after 10s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        maxPoolSize: 10, // Maintain up to 10 socket connections
        minPoolSize: 2, // Maintain at least 2 socket connections
        maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
        retryWrites: true,
      };

      await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
      console.log('MongoDB connected successfully');
      
      // Handle connection events (only set once)
      if (!mongoose.connection.listeners('connected').length) {
        mongoose.connection.on('connected', () => {
          console.log('MongoDB connection established');
        });

        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
          isConnecting = false;
        });

        mongoose.connection.on('disconnected', () => {
          console.log('MongoDB disconnected. Attempting to reconnect...');
          isConnecting = false;
          // Auto-reconnect after 5 seconds
          setTimeout(() => {
            if (mongoose.connection.readyState !== 1) {
              connectDB();
            }
          }, 5000);
        });
      }

      // Seed database with initial data (only if not already seeded)
      await seedData();
    } else {
      console.log('MongoDB URI not provided, running without database');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnecting = false;
    // Retry connection after 5 seconds
    setTimeout(() => {
      if (mongoose.connection.readyState !== 1) {
        console.log('Retrying MongoDB connection...');
        connectDB();
      }
    }, 5000);
  } finally {
    isConnecting = false;
  }
};

// Helper function to check MongoDB connection before operations
const ensureConnection = async () => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    // Disconnected or disconnecting, try to reconnect
    console.log('MongoDB disconnected, attempting to reconnect...');
    await connectDB();
    
    // Wait for connection to be established (max 10 seconds)
    let attempts = 0;
    while (mongoose.connection.readyState !== 1 && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Failed to establish MongoDB connection after retries');
    }
  } else if (mongoose.connection.readyState === 2) {
    // Connecting, just wait
    let attempts = 0;
    while (mongoose.connection.readyState !== 1 && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 500));
      attempts++;
    }
    
    if (mongoose.connection.readyState !== 1) {
      throw new Error('MongoDB connection timeout');
    }
  }
  // If readyState === 1, we're connected, proceed
};

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('Edicius Group Portal Backend is ready!');
  });
};

startServer().catch(console.error);

module.exports = app;
// Force deployment for both Vercel and Render
