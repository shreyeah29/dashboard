// Simple JavaScript version for deployment
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

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
      'https://dashboard-frontend-six-nu.vercel.app',
      'http://localhost:3000'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Basic API routes
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    message: 'Edicius Group Portal API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Companies endpoint
app.get('/api/v1/companies', (req, res) => {
  res.json([
    {
      _id: '1',
      name: 'Edicius Enterprises Private Limited',
      slug: 'edicius-enterprises-private-limited',
      overview: 'Edicius Enterprises serves as our multi-sector B2B venture arm, focusing on industrial innovation and strategic business partnerships. We develop and manufacture industrial goods, provide enterprise solutions, and create value through cross-industry collaborations.',
      heroImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Edicius Innovations and Consulting Private Limited',
      slug: 'edicius-innovations-and-consulting-private-limited',
      overview: 'Edicius Innovations and Consulting drives digital transformation through cutting-edge technology solutions, AI implementation, and strategic consulting services. We help organizations leverage emerging technologies to optimize operations and achieve sustainable growth.',
      heroImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Edicius Infrastructure and Developers Private Limited',
      slug: 'edicius-infrastructure-and-developers-private-limited',
      overview: 'Edicius Infrastructure and Developers specializes in creating sustainable, smart infrastructure solutions for modern cities. We design and develop eco-friendly construction projects, smart buildings, and integrated urban planning solutions.',
      heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '4',
      name: 'Edicius Imports and Exports Private Limited',
      slug: 'edicius-imports-and-exports-private-limited',
      overview: 'Edicius Imports and Exports facilitates seamless global commerce through advanced logistics, supply chain optimization, and international trade solutions. We connect markets worldwide, ensuring efficient movement of goods while maintaining quality standards.',
      heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '5',
      name: 'Edicius Productions and Entertainment Private Limited',
      slug: 'edicius-productions-and-entertainment-private-limited',
      overview: 'Edicius Productions and Entertainment creates compelling digital content, film productions, and immersive brand experiences that captivate audiences worldwide. We specialize in creative storytelling, digital media production, and innovative entertainment solutions.',
      heroImage: 'https://images.unsplash.com/photo-1489599804151-4b0b2b2b2b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '6',
      name: 'Edicius Consumer Products Private Limited',
      slug: 'edicius-consumer-products-private-limited',
      overview: 'Edicius Consumer Products leads the innovation in smart consumer goods, personal care, and lifestyle solutions. We combine cutting-edge technology with user-centric design to create products that enhance daily life.',
      heroImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '7',
      name: 'Edicius Mining and Minerals Private Limited',
      slug: 'edicius-mining-and-minerals-private-limited',
      overview: 'Edicius Mining and Minerals operates with a commitment to ethical resource extraction and environmental stewardship. We employ advanced mining technologies and sustainable practices to optimize mineral recovery while minimizing environmental impact.',
      heroImage: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '8',
      name: 'Edicius Hotels and Hospitality Private Limited',
      slug: 'edicius-hotels-and-hospitality-private-limited',
      overview: 'Edicius Hotels and Hospitality creates exceptional travel experiences through luxury accommodations, sustainable tourism practices, and authentic cultural immersion. We operate premium hotels and resorts that blend modern comfort with local heritage.',
      heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

// Auth verify endpoint
app.get('/api/v1/auth/admin/verify', (req, res) => {
  res.status(401).json({ message: 'Not authenticated' });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected successfully');
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
