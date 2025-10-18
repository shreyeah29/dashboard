import { Request } from 'express';

export interface ICompany {
  _id: string;
  name: string;
  slug: string;
  overview: string;
  heroImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  _id: string;
  companyId: string;
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
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IDocument {
  _id: string;
  projectId: string;
  name: string;
  type: 'pdf' | 'image' | 'ppt' | 'doc' | 'other';
  s3Key: string;
  size: number;
  uploadedBy: string;
  createdAt: Date;
}

export interface IComment {
  _id: string;
  projectId: string;
  author: 'admin' | 'system' | 'public';
  text: string;
  createdAt: Date;
}

export interface IAnalyticsSummary {
  companyCount: number;
  projectCount: number;
  docCountThisMonth: number;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: Date;
  }>;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
  };
}