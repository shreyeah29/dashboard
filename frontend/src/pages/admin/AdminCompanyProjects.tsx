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
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { companiesApi, projectsApi, documentsApi } from '@/lib/api';
import FileUploadModal from '@/components/admin/FileUploadModal';
import { X } from 'lucide-react';

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
                <p className="text-gray-600">Add and manage business units for this company.</p>
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

        {/* Units Section — primary content (no placeholder revenue analytics) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-edicius-navy mb-1 font-serif tracking-wide">Unit Database</h2>
          <p className="text-gray-600 text-sm">Units you add for this company appear below.</p>
        </motion.div>
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
