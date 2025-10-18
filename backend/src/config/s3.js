const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

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

// Multer configuration for S3 upload
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const folder = 'project-documents';
      cb(null, `${folder}/${fileName}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, {
        fieldName: file.fieldname,
        originalName: file.originalname,
        uploadedBy: 'admin',
        projectId: req.params.projectId || 'unknown'
      });
    }
  }),
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

// Helper function to generate pre-signed URL for secure access
const generatePresignedUrl = (s3Key, expiresIn = 3600) => {
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3Key,
    Expires: expiresIn
  });
};

// Helper function to delete file from S3
const deleteFileFromS3 = async (s3Key) => {
  try {
    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3Key
    }).promise();
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return false;
  }
};

module.exports = {
  s3,
  upload,
  getFileType,
  generatePresignedUrl,
  deleteFileFromS3
};
