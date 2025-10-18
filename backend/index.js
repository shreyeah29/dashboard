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
      'https://dashboard-frontend-fe95ng0cq-legal-links-projects-bc18cb27.vercel.app'
    ];
    
    console.log('CORS request from origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    // Allow requests with no origin (like mobile apps, curl requests, or local file access)
    if (!origin) return callback(null, true);
    
    // Check exact match first
    if (allowedOrigins.indexOf(origin) !== -1) {
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
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
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

// Documents endpoints
app.get('/api/v1/documents', (req, res) => {
  // Mock documents data
  const documents = [
    {
      _id: '1',
      name: 'Q4 Financial Report.pdf',
      type: 'pdf',
      size: '2.4 MB',
      company: 'Edicius Innovations and Consulting Private Limited',
      project: 'Digital Transformation Platform',
      tags: ['Financial', 'Planning'],
      uploadedBy: 'Admin User',
      uploadedAt: '2024-01-15',
      url: 'https://example.com/documents/q4-report.pdf'
    },
    {
      _id: '2',
      name: 'Project Proposal.pptx',
      type: 'pptx',
      size: '5.1 MB',
      company: 'Edicius Infrastructure and Developers Private Limited',
      project: 'Smart City Infrastructure',
      tags: ['Planning', 'Technical'],
      uploadedBy: 'Admin User',
      uploadedAt: '2024-01-14',
      url: 'https://example.com/documents/project-proposal.pptx'
    }
  ];
  
  res.json(documents);
});

app.post('/api/v1/documents/upload', (req, res) => {
  // Mock upload response
  const { company, project, tags, files } = req.body;
  
  // Simulate processing
  setTimeout(() => {
    res.json({
      success: true,
      message: 'Documents uploaded successfully',
      documents: files.map((file, index) => ({
        _id: `new_${Date.now()}_${index}`,
        name: file.name,
        type: file.name.split('.').pop(),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        company,
        project,
        tags,
        uploadedBy: 'Admin User',
        uploadedAt: new Date().toISOString().split('T')[0],
        url: `https://example.com/documents/${file.name}`
      }))
    });
  }, 1000);
});

app.delete('/api/v1/documents/:id', (req, res) => {
  const { id } = req.params;
  
  // Mock delete response
  res.json({
    success: true,
    message: 'Document deleted successfully',
    documentId: id
  });
});

// Projects endpoints
app.get('/api/v1/projects', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('companyId', 'name slug')
      .populate('documents')
      .sort({ createdAt: -1 });

    // Transform the data to include company name for frontend compatibility
    const transformedProjects = projects.map(project => ({
      ...project.toObject(),
      company: project.companyId ? project.companyId.name : 'Unknown Company'
    }));

    res.json(transformedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/v1/projects', async (req, res) => {
  try {
    const { name, companyId, description, startDate, endDate, priority } = req.body;
    
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
    
    // Create new project
    const newProject = new Project({
      name,
      companyId,
      description,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      priority: priority || 'Medium',
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
    
    // Find projects for this company
    const projects = await Project.find({ companyId: company._id })
      .populate('documents')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    console.error('Error fetching company projects:', error);
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

// Document upload endpoints
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

// Seed data function
const seedData = async () => {
  try {
    // Check if companies already exist
    const existingCompanies = await Company.countDocuments();
    if (existingCompanies > 0) {
      console.log('Companies already exist, skipping seed data');
      return;
    }

    console.log('Seeding database with initial data...');

    // Create companies
    const companies = [
      {
        name: 'Edicius Enterprises Private Limited',
        slug: 'edicius-enterprises-private-limited',
        overview: 'Multi-sector B2B venture arm focusing on industrial innovation and strategic business partnerships.',
        heroImage: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
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
        heroImage: 'https://images.unsplash.com/photo-1574267432644-f02b5ab7e2a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
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
        heroImage: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
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

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected successfully');
      
      // Seed database with initial data
      await seedData();
    } else {
      console.log('MongoDB URI not provided, running without database');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit process, continue without database
  }
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
