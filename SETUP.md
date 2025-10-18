# Edicius Group Portal - Setup Instructions

## 🚀 **Complete Document Upload System Setup**

### **Backend Setup (MongoDB + Local File Storage)**

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
```

#### 2. **Local File Storage**
✅ **No AWS S3 setup needed!** Files are stored locally in the `backend/uploads` directory.

#### 3. **MongoDB Setup**
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in your `.env` file
3. The app will automatically seed initial data on first run

**Note**: If you don't have MongoDB, the app will still work with mock data for testing!

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
- Local file storage (no AWS S3 needed!)
- Support for PDF, PPT, DOC, images, videos
- File size validation (50MB limit)
- Direct file access via URLs

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
2. Admin uploads PPT → Local storage + Database
3. Public views project → Shows uploaded PPT
4. Real-time updates across admin and public sites

🎉 **Your document upload system is ready!**
