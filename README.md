# Edicius Group Portal

A production-ready web application that centralizes all companies under The Edicius Group and showcases their projects, with a private admin area for uploads and management.

## 🚀 Features

### Public Features
- **Modern Dashboard UI**: Elegant, corporate design with sophisticated animations using Framer Motion and AOS
- **Company Showcase**: Browse all 8 Edicius Group companies with detailed overviews
- **Project Details**: View project information, team members, milestones, and status
- **Document Viewer**: View-only document previews (PDFs, images, presentations) with watermark protection
- **Comments System**: View project comments and internal notes

### Admin Features
- **Secure Authentication**: Admin-only access using environment-based password and JWT cookies
- **Company Management**: Create, edit, and delete companies
- **Project Management**: Full CRUD operations for projects with team and milestone management
- **Document Upload**: Drag-and-drop file uploads to AWS S3 with automatic categorization
- **Analytics Dashboard**: Comprehensive statistics and charts using Recharts
- **Comment Management**: Add and moderate project comments

### Security Features
- **View-Only Documents**: Pre-signed S3 URLs with inline viewing and disabled downloads
- **JWT Authentication**: Secure httpOnly cookies for admin sessions
- **Rate Limiting**: Protection against abuse on admin routes
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Helmet Security**: Security headers and protection

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Storage**: AWS S3 for document storage
- **Styling**: TailwindCSS + shadcn/ui components
- **Animations**: Framer Motion + AOS
- **Charts**: Recharts for analytics
- **Forms**: React Hook Form + Zod validation
- **State Management**: TanStack Query (React Query)

### Project Structure
```
edicius-group-portal/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and API client
│   │   └── types/           # TypeScript type definitions
│   └── package.json
├── backend/                  # Express.js backend API
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   └── scripts/         # Database seeding scripts
│   └── package.json
└── package.json             # Root package.json for workspace
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- MongoDB instance (local or cloud)
- AWS S3 bucket for document storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edicius-group-portal
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/edicius-portal
   
   # Server
   PORT=5000
   CLIENT_URL=http://localhost:3000
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here
   ADMIN_SECRET=admin123
   
   # AWS S3
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=us-east-1
   S3_BUCKET=edicius-portal-documents
   
   # Optional: Seed sample data
   SAMPLE_SEED=true
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:3000`

## 📊 The Edicius Group Companies

The portal showcases 8 companies under The Edicius Group:

1. **Edicius Consumer Products** - Smart consumer goods and lifestyle solutions
2. **Edicius Infrastructure and Developers** - Sustainable infrastructure and smart cities
3. **Edicius Mining and Minerals** - Ethical resource extraction and sustainability
4. **Edicius Hotels and Hospitality** - Luxury hospitality and sustainable tourism
5. **Edicius Enterprises** - Multi-sector B2B ventures and industrial innovation
6. **Edicius Imports and Exports** - Global commerce and logistics solutions
7. **Edicius Innovations and Consulting** - Digital transformation and AI solutions
8. **Edicius Productions and Entertainment** - Creative storytelling and digital media

## 🔐 Admin Access

- **URL**: `http://localhost:3000/admin/login`
- **Default Password**: `admin123` (configured in `ADMIN_SECRET` env var)
- **Features**: Full CRUD operations, document uploads, analytics dashboard

## 📁 Document Management

### Supported File Types
- **PDFs**: Inline viewing with disabled download controls
- **Images**: Lightbox preview with watermark overlay
- **Presentations**: PowerPoint files with metadata display
- **Documents**: Word documents with preview information
- **Other**: Generic file type support

### Security Features
- **Pre-signed URLs**: 5-minute expiration for secure access
- **Inline Viewing**: `Content-Disposition: inline` prevents downloads
- **Watermark Protection**: Project name overlay on images
- **Context Menu Disabled**: Right-click prevention on document viewers

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Building
npm run build            # Build both applications
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Production
npm run start            # Start production servers
npm run start:frontend   # Start frontend production server
npm run start:backend    # Start backend production server

# Database
npm run seed             # Seed database with sample data

# Code Quality
npm run lint             # Lint both frontend and backend
npm run format           # Format code with Prettier
```

### API Endpoints

#### Public Endpoints
- `GET /api/v1/companies` - Get all companies
- `GET /api/v1/companies/:slug` - Get company by slug
- `GET /api/v1/projects/companies/:slug/projects` - Get projects by company
- `GET /api/v1/projects/:slug` - Get project by slug
- `GET /api/v1/documents/:id/view` - Get document view URL
- `GET /api/v1/comments/projects/:id/comments` - Get project comments

#### Admin Endpoints (Protected)
- `POST /api/v1/auth/admin/login` - Admin login
- `POST /api/v1/auth/admin/logout` - Admin logout
- `GET /api/v1/auth/admin/verify` - Verify admin token
- `POST /api/v1/companies` - Create company
- `PATCH /api/v1/companies/:id` - Update company
- `DELETE /api/v1/companies/:id` - Delete company
- `POST /api/v1/projects` - Create project
- `PATCH /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project
- `POST /api/v1/documents/projects/:id/documents` - Upload document
- `DELETE /api/v1/documents/:id` - Delete document
- `POST /api/v1/comments/projects/:id/comments` - Add comment
- `DELETE /api/v1/comments/:id` - Delete comment
- `GET /api/v1/analytics/summary` - Get analytics data

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-jwt-secret
ADMIN_SECRET=your-secure-admin-password
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=your-aws-region
S3_BUCKET=your-production-bucket
CLIENT_URL=https://your-domain.com
```

### Build for Production
```bash
npm run build
npm run start
```

## 🔒 Security Considerations

### Document View-Only Limitations
- **Client-side restrictions**: Download/print controls are disabled where possible
- **Best-effort approach**: 100% prevention cannot be guaranteed on client-side
- **Server-side security**: Pre-signed URLs with short expiration times
- **Watermark protection**: Visual deterrents on sensitive documents

### Authentication Security
- **JWT tokens**: Short-lived tokens (24 hours) stored in httpOnly cookies
- **Rate limiting**: Protection against brute force attacks
- **CORS configuration**: Restricted to frontend domain
- **Helmet security**: Security headers and protection

## 📝 License

This project is proprietary software developed for The Edicius Group.

## 🤝 Contributing

This is an internal project for The Edicius Group. For questions or support, please contact the development team.

---

**Edicius Group Portal** - Innovating Across Industries
# Vercel Deployment Trigger
# Latest update Mon Oct 20 15:16:10 IST 2025
