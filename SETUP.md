# Edicius Group Portal - Setup Instructions

## 🚀 **Complete Document Upload System Setup**

### **Backend Setup (MongoDB + AWS S3)**

#### 1. **Environment Variables**
Create a `.env` file in the `backend` directory with:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/edicius-dashboard

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
ADMIN_SECRET=admin123

# CORS Configuration
CLIENT_URL=http://localhost:3000

# AWS S3 Configuration (for file uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name
```

#### 2. **AWS S3 Setup**
1. Create an AWS S3 bucket
2. Configure bucket permissions for public read access
3. Create IAM user with S3 permissions
4. Add the credentials to your `.env` file

#### 3. **MongoDB Setup**
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in your `.env` file
3. The app will automatically seed initial data on first run

### **Frontend Setup**

#### 1. **Environment Variables**
Create a `.env` file in the `frontend` directory with:

```env
VITE_API_URL=http://localhost:5000
```

### **Deployment Setup**

#### **Render (Backend)**
1. Connect your GitHub repository
2. Set build command: `cd backend && npm install && npm run build`
3. Set start command: `cd backend && npm start`
4. Add environment variables in Render dashboard

#### **Vercel (Frontend)**
1. Connect your GitHub repository
2. Set build command: `cd frontend && npm install && npm run build`
3. Add environment variables in Vercel dashboard

### **Features Implemented**

✅ **Real Database Integration**
- MongoDB models for Project, Document, Company
- Automatic data seeding
- Real-time data synchronization

✅ **File Upload System**
- AWS S3 integration
- Support for PDF, PPT, DOC, images, videos
- File size validation (50MB limit)
- Secure pre-signed URLs

✅ **Admin Dashboard**
- Create projects with real database
- Upload documents/PPT files
- View projects by company
- Manage file uploads

✅ **Public Website**
- View projects with uploaded documents
- Display PPT files and other documents
- Beautiful project presentation

### **How to Test**

1. **Start the backend**: `cd backend && npm start`
2. **Start the frontend**: `cd frontend && npm run dev`
3. **Login to admin**: Use password `admin123`
4. **Create a project** in any company
5. **Upload a PPT file** using "Manage Files"
6. **Visit public site** and see your uploaded document

### **Complete Flow**
1. Admin creates project → Database
2. Admin uploads PPT → AWS S3 + Database
3. Public views project → Shows uploaded PPT
4. Real-time updates across admin and public sites

🎉 **Your document upload system is ready!**
