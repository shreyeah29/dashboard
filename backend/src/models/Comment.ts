import mongoose, { Document, Schema } from 'mongoose';

export interface ICommentDocument extends Document {
  projectId: mongoose.Types.ObjectId;
  author: 'admin' | 'system' | 'public';
  text: string;
  createdAt: Date;
}

const CommentSchema = new Schema<ICommentDocument>({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  author: {
    type: String,
    enum: ['admin', 'system', 'public'],
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

export const Comment = mongoose.model<ICommentDocument>('Comment', CommentSchema);
