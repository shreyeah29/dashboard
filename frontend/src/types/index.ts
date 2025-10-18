export interface Company {
  _id: string;
  name: string;
  slug: string;
  overview: string;
  heroImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  companyId: string | Company;
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
    date: string;
    note?: string;
  }>;
  documents: string[] | Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  _id: string;
  projectId: string;
  name: string;
  type: 'pdf' | 'image' | 'ppt' | 'doc' | 'other';
  s3Key: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  projectId: string;
  author: 'admin' | 'system' | 'public';
  text: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  companyCount: number;
  projectCount: number;
  docCountThisMonth: number;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
  projectStatusStats: Array<{
    _id: string;
    count: number;
  }>;
  documentTypeStats: Array<{
    _id: string;
    count: number;
  }>;
}

export interface AuthUser {
  id: string;
  isAdmin: boolean;
}

export interface LoginCredentials {
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Array<{
    msg: string;
    param: string;
  }>;
}
