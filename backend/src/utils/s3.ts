import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

export const uploadToS3 = async (
  file: Express.Multer.File,
  companySlug: string,
  projectSlug: string
): Promise<string> => {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const key = `documents/${companySlug}/${projectSlug}/${fileName}`;

  const uploadParams = {
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'private' // Private by default, access via pre-signed URLs
  };

  try {
    const result = await s3.upload(uploadParams).promise();
    return result.Key;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

export const generatePresignedUrl = async (
  s3Key: string,
  expiresIn: number = 300 // 5 minutes default
): Promise<string> => {
  const params = {
    Bucket: process.env.S3_BUCKET!,
    Key: s3Key,
    Expires: expiresIn,
    ResponseContentDisposition: 'inline' // View inline, not download
  };

  try {
    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (error) {
    console.error('S3 presigned URL error:', error);
    throw new Error('Failed to generate presigned URL');
  }
};

export const deleteFromS3 = async (s3Key: string): Promise<void> => {
  const params = {
    Bucket: process.env.S3_BUCKET!,
    Key: s3Key
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
};

export const getFileType = (mimetype: string): 'pdf' | 'image' | 'ppt' | 'doc' | 'other' => {
  if (mimetype.includes('pdf')) return 'pdf';
  if (mimetype.includes('image')) return 'image';
  if (mimetype.includes('presentation') || mimetype.includes('powerpoint')) return 'ppt';
  if (mimetype.includes('document') || mimetype.includes('word')) return 'doc';
  return 'other';
};
