import mongoose, { Document, Schema } from 'mongoose';
import slugify from 'slugify';

export interface ICompanyDocument extends Document {
  name: string;
  slug: string;
  overview: string;
  heroImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompanyDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  overview: {
    type: String,
    required: true
  },
  heroImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Generate slug from name before saving
CompanySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Company = mongoose.model<ICompanyDocument>('Company', CompanySchema);
