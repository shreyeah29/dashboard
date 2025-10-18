import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Configure multer for S3 upload
export const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET!,
    acl: 'private',
    key: function (req, file, cb) {
      const companySlug = req.params.companySlug || 'default';
      const projectSlug = req.params.projectSlug || 'default';
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${fileExtension}`;
      cb(null, `documents/${companySlug}/${projectSlug}/${fileName}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, PowerPoint, Word, and text files are allowed.'));
    }
  }
});
