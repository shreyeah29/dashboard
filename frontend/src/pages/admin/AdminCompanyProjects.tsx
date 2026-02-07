import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Plus, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  TrendingUp,
  Building2,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { companiesApi, projectsApi, documentsApi } from '@/lib/api';
import FileUploadModal from '@/components/admin/FileUploadModal';
import { X } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Generate company-specific mock analytics (consistent per company slug)
const getCompanyAnalytics = (companySlug: string, units: any[]) => {
  const hash = (s: string) => s.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
  const seed = Math.abs(hash(companySlug || 'default'));
  
  const yearlyRevenueData = [
    { year: '2020', revenue: 2.4 + (seed % 3) * 0.5, growth: 12 + (seed % 5) },
    { year: '2021', revenue: 3.1 + (seed % 3) * 0.5, growth: 29 + (seed % 8) },
    { year: '2022', revenue: 4.2 + (seed % 4) * 0.5, growth: 35 + (seed % 6) },
    { year: '2023', revenue: 5.8 + (seed % 4) * 0.5, growth: 38 + (seed % 5) },
    { year: '2024', revenue: 7.2 + (seed % 3) * 0.5, growth: 24 + (seed % 7) },
    { year: '2025', revenue: 8.9 + (seed % 4) * 0.5, growth: 24 + (seed % 6) },
  ];

  const revenueBySourceData = [
    { name: 'Walk-in', value: 28 + (seed % 5), color: '#C9A227' },
    { name: 'Sales', value: 24 + (seed % 4), color: '#0B1F3A' },
    { name: 'Marketing', value: 18 + (seed % 3), color: '#DC2626' },
    { name: 'Calling', value: 14 + (seed % 3), color: '#16a34a' },
    { name: 'Social Media', value: 10 + (seed % 2), color: '#60a5fa' },
    { name: 'Referrals', value: 6 + (seed % 2), color: '#a78bfa' },
  ].map(d => ({ ...d, value: Math.min(100, d.value) }));

  const totalRevenue = yearlyRevenueData.reduce((acc, d) => acc + d.revenue, 0).toFixed(1);
  const topChannel = revenueBySourceData[0];
  const yoyGrowth = yearlyRevenueData[yearlyRevenueData.length - 1]?.growth ?? 24;

  const revenueByUnit = units.map((u, i) => ({
    name: u.name || `Unit ${i + 1}`,
    revenue: parseFloat((1.5 + (hash(u.name || u._id) % 10) * 0.3 + i * 0.5).toFixed(2)),
  }));

  return { yearlyRevenueData, revenueBySourceData, totalRevenue, topChannel, yoyGrowth, revenueByUnit };
};

const AdminCompanyProjects = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [company, setCompany] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    teamSize: 0,
    priority: 'Medium',
    milestones: [] as { name: string; description: string; completed: boolean; dueDate: string }[]
  });
  const [viewingUnit, setViewingUnit] = useState<any>(null);
  const [viewUnitDocuments, setViewUnitDocuments] = useState<any[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoadingViewDocs, setIsLoadingViewDocs] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    priority: 'Medium'
  });

  useEffect(() => {
    if (slug) {
      loadData();
    }
  }, [slug]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [companiesData, unitsData] = await Promise.all([
        companiesApi.getAll(),
        slug ? projectsApi.getByCompanySlug(slug) : []
      ]);
      
      // Find the company by slug
      const foundCompany = companiesData.find(c => c.slug === slug);
      if (!foundCompany) {
        toast({
          title: "Company Not Found",
          description: "The requested company could not be found.",
          variant: "destructive",
        });
        navigate('/admin/companies');
        return;
      }
      
      setCompany(foundCompany);
      // unitsData is already filtered by backend (type: 'unit' only)
      setProjects(unitsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load company and units data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Company object:', company);
      console.log('Company._id:', company._id);
      
      const projectData = {
        name: formData.name,
        description: formData.description,
        startDate: formData.startDate || undefined,
        priority: formData.priority,
        companyId: company._id,
        type: 'unit'
      };
      
      console.log('Creating project with data:', projectData);
      const newProject = await projectsApi.create(projectData);
      console.log('Project created successfully:', newProject);
      
      // Reload projects data
      await loadData();
      
      toast({
        title: "Unit Created",
        description: `Unit "${formData.name}" has been created successfully.`,
      });
      
      // Reset form and close modal
      setFormData({
        name: '',
        description: '',
        startDate: '',
        priority: 'Medium'
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Creation Failed",
        description: "There was an error creating the unit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageFiles = (project: any) => {
    setSelectedUnit(project);
    setIsUploadModalOpen(true);
  };

  const handleFileUpload = async (file: File, tags: string) => {
    if (!selectedUnit) return;
    try {
      await documentsApi.upload(selectedUnit._id, file, tags);
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
      await loadData();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleEditUnit = (project: any) => {
    setEditingUnit(project);
    const milestones = (project.milestones || []).map((m: any) => ({
      name: m.name || '',
      description: m.description || '',
      completed: m.completed ?? false,
      dueDate: m.dueDate ? new Date(m.dueDate).toISOString().split('T')[0] : ''
    }));
    setEditFormData({
      name: project.name || '',
      description: project.description || '',
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      teamSize: project.teamSize ?? 0,
      priority: project.priority || 'Medium',
      milestones
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUnit = async () => {
    if (!editingUnit) return;
    setIsLoading(true);
    try {
      const milestones = editFormData.milestones
        .filter(m => m.name.trim())
        .map(m => ({
          name: m.name,
          description: m.description || undefined,
          completed: m.completed,
          dueDate: m.dueDate ? new Date(m.dueDate) : undefined
        }));
      await projectsApi.update(editingUnit._id, {
        name: editFormData.name,
        description: editFormData.description,
        startDate: editFormData.startDate || undefined,
        endDate: editFormData.endDate || undefined,
        teamSize: editFormData.teamSize || 0,
        priority: editFormData.priority,
        milestones,
        type: 'unit'
      });
      toast({
        title: "Unit Updated",
        description: "Unit has been updated successfully.",
      });
      setIsEditModalOpen(false);
      setEditingUnit(null);
      await loadData();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update unit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUnit = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this unit? This action cannot be undone.')) {
      return;
    }
    try {
      await projectsApi.delete(projectId);
      toast({
        title: "Unit Deleted",
        description: "Unit has been deleted successfully.",
      });
      await loadData();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete unit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewUnit = async (project: any) => {
    setViewingUnit(project);
    setIsViewModalOpen(true);
    setIsLoadingViewDocs(true);
    try {
      const docs = await documentsApi.getByProject(project._id);
      setViewUnitDocuments(docs);
    } catch (error) {
      setViewUnitDocuments([]);
    } finally {
      setIsLoadingViewDocs(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'Planning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Planning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edicius-gold"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h2>
          <Button onClick={() => navigate('/admin/companies')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/admin/companies')}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Companies
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {company.name}
                </h1>
                <p className="text-gray-600">Unit Database</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-edicius-gold text-edicius-navy px-6 py-3 rounded-lg font-semibold hover:bg-edicius-gold/90 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Unit</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Company Analytics Section */}
        {(() => {
          const analytics = getCompanyAnalytics(company.slug, projects);
          const CustomTooltip = ({ active, payload, label }: any) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white px-4 py-3 rounded-lg shadow-xl border border-gray-200">
                  <p className="font-semibold text-edicius-navy">{label}</p>
                  <p className="text-edicius-gold font-medium">Revenue: ₹{payload[0].value} Cr</p>
                  <p className="text-sm text-gray-600">Growth: {payload[0].payload.growth}%</p>
                </div>
              );
            }
            return null;
          };
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold text-edicius-navy mb-6 font-serif tracking-wide">
                {company.name} — Analytics
              </h2>
              <p className="text-gray-600 mb-6">Revenue insights and performance metrics for this company</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold text-edicius-navy flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-edicius-gold" />
                        Yearly Revenue Model
                      </CardTitle>
                      <span className="text-sm text-gray-500 font-medium">Annual Report</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Revenue in Crores (₹ Cr) — Fiscal year performance</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.yearlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                          <XAxis dataKey="year" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} />
                          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="revenue" fill="#C9A227" radius={[6, 6, 0, 0]} name="Revenue (Cr)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-edicius-navy flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-edicius-gold" />
                      Revenue by Source
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Distribution across channels (% of total revenue)</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={analytics.revenueBySourceData} cx="50%" cy="50%" innerRadius={75} outerRadius={115} paddingAngle={3} dataKey="value">
                            {analytics.revenueBySourceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v: number, n: string) => [`${v}%`, n]} contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                          <Legend layout="vertical" align="right" verticalAlign="middle" formatter={(v) => <span className="text-sm font-medium text-gray-700">{v}</span>} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {projects.length > 0 && (
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-8">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-edicius-navy flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-edicius-gold" />
                      Revenue by Unit
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Revenue generated by each unit</p>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.revenueByUnit} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                          <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={{ stroke: '#E5E7EB' }} interval={0} />
                          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                          <Tooltip formatter={(v: number) => [`₹${v} Cr`, 'Revenue']} contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                          <Bar dataKey="revenue" fill="#C9A227" radius={[6, 6, 0, 0]} name="Revenue (Cr)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-white border border-gray-200">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium text-gray-600">Total Revenue (2020-2025)</p>
                    <p className="text-2xl font-bold text-edicius-navy mt-1">₹ {analytics.totalRevenue} Cr</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium text-gray-600">Top Revenue Channel</p>
                    <p className="text-2xl font-bold text-edicius-navy mt-1">{analytics.topChannel.name} ({analytics.topChannel.value}%)</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium text-gray-600">YoY Growth (2025)</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">+{analytics.yoyGrowth}%</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          );
        })()}

        {/* Units Section */}
        <h2 className="text-xl font-bold text-edicius-navy mb-4">Unit Database</h2>
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-12"
          >
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Units Yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first unit for {company.name}</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-edicius-gold text-edicius-navy hover:bg-edicius-gold/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Unit
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-edicius-gold transition-colors mb-2">
                          {project.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <Badge className={`${getStatusColor(project.status)} border`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(project.status)}
                            <span>{project.status}</span>
                          </div>
                        </Badge>
                        <Badge className={`${getPriorityColor(project.priority)} border`}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{project.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-edicius-gold h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Unit Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{project.teamSize || 0} members</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{Array.isArray(project.documents) ? project.documents.length : (project.documents || 0)} docs</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{(project.milestones || []).filter((m: any) => m.completed).length}/{project.milestones?.length || 0} milestones</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600" title="Start / End">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : '—'} / {project.endDate ? new Date(project.endDate).toLocaleDateString() : '—'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleManageFiles(project)}
                        className="flex-1 border-edicius-gold/30 text-edicius-gold hover:bg-edicius-gold/10"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Manage Files
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUnit(project)}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUnit(project)}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUnit(project._id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Create Unit Modal */}
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsCreateModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Create New Unit</h2>
                <p className="text-gray-600 mt-1">Add a new unit to {company.name}</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Unit Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-gray-900 focus:outline-none focus:border-edicius-gold"
                    placeholder="Enter unit name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-gray-900 focus:outline-none focus:border-edicius-gold"
                    placeholder="Enter unit description"
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-gray-900 focus:outline-none focus:border-edicius-gold"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-gray-900 focus:outline-none focus:border-edicius-gold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <Button
                  onClick={() => setIsCreateModalOpen(false)}
                  variant="outline"
                  className="border-edicius-gold/30 text-edicius-gold hover:bg-edicius-gold/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={isLoading}
                  className="bg-edicius-gold text-edicius-navy hover:bg-edicius-gold/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-edicius-navy/30 border-t-edicius-navy rounded-full animate-spin" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Unit'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Unit Details View Modal */}
        {isViewModalOpen && viewingUnit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setIsViewModalOpen(false);
                setViewingUnit(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-900">Unit Details</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setViewingUnit(null);
                      setSelectedUnit(viewingUnit);
                      setIsUploadModalOpen(true);
                    }}
                    className="border-edicius-gold/30 text-edicius-gold hover:bg-edicius-gold/10"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Manage Files
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setViewingUnit(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{viewingUnit.name}</h3>
                  <p className="text-gray-600">{viewingUnit.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(viewingUnit.status)}>{viewingUnit.status}</Badge>
                    <Badge className={getPriorityColor(viewingUnit.priority)}>{viewingUnit.priority}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{viewingUnit.teamSize || 0} team members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Start: {viewingUnit.startDate ? new Date(viewingUnit.startDate).toLocaleDateString() : '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>End: {viewingUnit.endDate ? new Date(viewingUnit.endDate).toLocaleDateString() : '—'}</span>
                  </div>
                </div>
                {(viewingUnit.milestones || []).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Milestones</h4>
                    <ul className="space-y-2">
                      {viewingUnit.milestones.map((m: any, i: number) => (
                        <li key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                          {m.completed ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> : <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                          <span className={m.completed ? 'line-through text-gray-600' : ''}>{m.name}</span>
                          {m.dueDate && <span className="text-xs text-gray-500">Due: {new Date(m.dueDate).toLocaleDateString()}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Documents</h4>
                  {isLoadingViewDocs ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-edicius-gold/30 border-t-edicius-gold rounded-full animate-spin" />
                    </div>
                  ) : viewUnitDocuments.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {viewUnitDocuments.map((doc) => (
                        <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-900">{doc.name || doc.originalName}</p>
                              <p className="text-sm text-gray-500">
                                {doc.fileType} • {formatFileSize(doc.fileSize || 0)} • {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ''}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => doc.s3Url && window.open(doc.s3Url, '_blank')}
                            className="border-gray-300 text-gray-600 hover:bg-gray-50"
                            title="View Document"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                      <FileText className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                      <p>No documents uploaded yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 border-edicius-gold/30 text-edicius-gold hover:bg-edicius-gold/10"
                        onClick={() => {
                          setIsViewModalOpen(false);
                          setViewingUnit(null);
                          setSelectedUnit(viewingUnit);
                          setIsUploadModalOpen(true);
                        }}
                      >
                        Upload Documents
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* File Upload Modal */}
        {isUploadModalOpen && selectedUnit && (
          <FileUploadModal
            project={selectedUnit}
            onClose={() => {
              setIsUploadModalOpen(false);
              setSelectedUnit(null);
            }}
            onUpload={handleFileUpload}
          />
        )}

        {/* Edit Unit Modal */}
        {isEditModalOpen && editingUnit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsEditModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Unit</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Name *</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-gray-900 focus:outline-none focus:border-edicius-gold"
                    placeholder="Enter unit name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-gray-900 focus:outline-none focus:border-edicius-gold"
                    placeholder="Enter unit description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={editFormData.startDate}
                      onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-gray-900 focus:outline-none focus:border-edicius-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={editFormData.endDate}
                      onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-gray-900 focus:outline-none focus:border-edicius-gold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                  <input
                    type="number"
                    min={0}
                    value={editFormData.teamSize}
                    onChange={(e) => setEditFormData({ ...editFormData, teamSize: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-gray-900 focus:outline-none focus:border-edicius-gold"
                    placeholder="Number of team members"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-gray-900 focus:outline-none focus:border-edicius-gold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Milestones</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditFormData({
                        ...editFormData,
                        milestones: [...editFormData.milestones, { name: '', description: '', completed: false, dueDate: '' }]
                      })}
                      className="border-edicius-gold/30 text-edicius-gold hover:bg-edicius-gold/10"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Milestone
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {editFormData.milestones.map((m, i) => (
                      <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) => {
                              const next = [...editFormData.milestones];
                              next[i] = { ...next[i], name: e.target.value };
                              setEditFormData({ ...editFormData, milestones: next });
                            }}
                            placeholder="Milestone name"
                            className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded mr-2"
                          />
                          <label className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={m.completed}
                              onChange={(e) => {
                                const next = [...editFormData.milestones];
                                next[i] = { ...next[i], completed: e.target.checked };
                                setEditFormData({ ...editFormData, milestones: next });
                              }}
                            />
                            Done
                          </label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setEditFormData({
                              ...editFormData,
                              milestones: editFormData.milestones.filter((_, j) => j !== i)
                            })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Description</p>
                        <input
                          type="text"
                          value={m.description}
                          onChange={(e) => {
                            const next = [...editFormData.milestones];
                            next[i] = { ...next[i], description: e.target.value };
                            setEditFormData({ ...editFormData, milestones: next });
                          }}
                          placeholder="Optional description"
                          className="w-full px-2 py-1 text-sm border border-gray-200 rounded mr-2"
                        />
                        <p className="text-xs text-gray-500 mt-1 mb-1">Due Date</p>
                        <input
                          type="date"
                          value={m.dueDate}
                          onChange={(e) => {
                            const next = [...editFormData.milestones];
                            next[i] = { ...next[i], dueDate: e.target.value };
                            setEditFormData({ ...editFormData, milestones: next });
                          }}
                          className="px-2 py-1 text-sm border border-gray-200 rounded"
                        />
                      </div>
                    ))}
                    {editFormData.milestones.length === 0 && (
                      <p className="text-sm text-gray-500 py-2">No milestones. Click &quot;Add Milestone&quot; to add one.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                <Button
                  onClick={() => setIsEditModalOpen(false)}
                  variant="outline"
                  className="border-edicius-gold/30 text-edicius-gold hover:bg-edicius-gold/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateUnit}
                  disabled={isLoading}
                  className="bg-edicius-gold text-edicius-navy hover:bg-edicius-gold/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-edicius-navy/30 border-t-edicius-navy rounded-full animate-spin" />
                      <span>Updating...</span>
                    </div>
                  ) : (
                    'Update Unit'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminCompanyProjects;
