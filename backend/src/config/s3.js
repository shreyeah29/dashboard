const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'text/plain'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, PPT, PPTX, DOC, DOCX, images, and videos are allowed.'), false);
  }
};

// Multer configuration for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const projectDir = path.join(uploadsDir, 'project-documents');
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    cb(null, projectDir);
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Helper function to get file type from mime type
const getFileType = (mimeType) => {
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
    return 'presentation';
  } else if (mimeType.includes('document') || mimeType.includes('word')) {
    return 'document';
  } else if (mimeType.includes('image')) {
    return 'image';
  } else if (mimeType.includes('video')) {
    return 'video';
  } else {
    return 'other';
  }
};

// Helper function to generate local file URL
const generateFileUrl = (filename) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/project-documents/${filename}`;
};

// Helper function to delete local file
const deleteLocalFile = async (filename) => {
  try {
    const filePath = path.join(uploadsDir, 'project-documents', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting local file:', error);
    return false;
  }
};

module.exports = {
  upload,
  getFileType,
  generateFileUrl,
  deleteLocalFile
};
