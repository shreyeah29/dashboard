import mongoose, { Document, Schema } from 'mongoose';

export interface IDocumentDocument extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  type: 'pdf' | 'image' | 'ppt' | 'doc' | 'other';
  s3Key: string;
  size: number;
  uploadedBy: string;
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocumentDocument>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['pdf', 'image', 'ppt', 'doc', 'other'],
    required: true
  },
  s3Key: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: String,
    required: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export const Document = mongoose.model<IDocumentDocument>('Document', DocumentSchema);
