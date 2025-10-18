import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface IProjectDocument extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  bannerImage?: string;
  description: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  team: Array<{
    name: string;
    role: string;
    avatar?: string;
  }>;
  milestones: Array<{
    title: string;
    date: Date;
    note?: string;
  }>;
  documents: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDocument>({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  bannerImage: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed'],
    default: 'Planned'
  },
  team: [{
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      default: ''
    }
  }],
  milestones: [{
    title: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    note: {
      type: String,
      default: ''
    }
  }],
  documents: [{
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }]
}, {
  timestamps: true
});

// Generate slug from title before saving
ProjectSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Project = mongoose.model<IProjectDocument>('Project', ProjectSchema);
