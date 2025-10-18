import axios from 'axios';
import { Company, Project, Document, Comment, AnalyticsSummary, LoginCredentials, AuthUser } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/admin/logout');
    return response.data;
  },
  
  verify: async (): Promise<AuthUser> => {
    const response = await api.get('/auth/admin/verify');
    return response.data.user;
  }
};

// Companies API
export const companiesApi = {
  getAll: async (): Promise<Company[]> => {
    const response = await api.get('/companies');
    return response.data;
  },
  
  getBySlug: async (slug: string): Promise<Company> => {
    const response = await api.get(`/companies/${slug}`);
    return response.data;
  },
  
  create: async (data: Partial<Company>): Promise<Company> => {
    const response = await api.post('/companies', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Company>): Promise<Company> => {
    const response = await api.patch(`/companies/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  }
};

// Projects API
export const projectsApi = {
  getByCompanySlug: async (companySlug: string): Promise<Project[]> => {
    const response = await api.get(`/projects/companies/${companySlug}/projects`);
    return response.data;
  },
  
  getBySlug: async (slug: string): Promise<Project> => {
    const response = await api.get(`/projects/${slug}`);
    return response.data;
  },
  
  create: async (data: Partial<Project>): Promise<Project> => {
    const response = await api.post('/projects', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};

// Documents API
export const documentsApi = {
  upload: async (projectId: string, file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await api.post(`/documents/projects/${projectId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getViewUrl: async (documentId: string) => {
    const response = await api.get(`/documents/${documentId}/view`);
    return response.data;
  },
  
  delete: async (documentId: string) => {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  }
};

// Comments API
export const commentsApi = {
  getByProject: async (projectId: string): Promise<Comment[]> => {
    const response = await api.get(`/comments/projects/${projectId}/comments`);
    return response.data;
  },
  
  create: async (projectId: string, text: string): Promise<Comment> => {
    const response = await api.post(`/comments/projects/${projectId}/comments`, { text });
    return response.data;
  },
  
  delete: async (commentId: string) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  }
};

// Analytics API
export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const response = await api.get('/analytics/summary');
    return response.data;
  }
};

export default api;
