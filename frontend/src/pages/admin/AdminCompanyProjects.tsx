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
    priority: 'Medium'
  });

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
    setEditFormData({
      name: project.name || '',
      description: project.description || '',
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      priority: project.priority || 'Medium'
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUnit = async () => {
    if (!editingUnit) return;
    setIsLoading(true);
    try {
      await projectsApi.update(editingUnit._id, {
        name: editFormData.name,
        description: editFormData.description,
        startDate: editFormData.startDate || undefined,
        priority: editFormData.priority,
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

  const handleViewUnit = (project: any) => {
    if (project.slug) {
      navigate(`/project/${project.slug}`);
    } else {
      toast({
        title: "View Unavailable",
        description: "This unit does not have a viewable page yet.",
        variant: "destructive",
      });
    }
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
                        <span className="text-sm text-gray-600">{project.documents || 0} docs</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{project.completedMilestones || 0}/{project.milestones || 0} milestones</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'No date'}</span>
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
