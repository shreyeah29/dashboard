import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  FileText, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  TrendingUp,
  Building2,
  X,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { projectsApi, companiesApi } from '@/lib/api';
import FileUploadModal from '@/components/admin/FileUploadModal';

const AdminProjects = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    companyId: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'Medium'
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsData, companiesData] = await Promise.all([
        projectsApi.getAll(),
        companiesApi.getAll()
      ]);
      setProjects(projectsData);
      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load projects and companies data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const handleCreateProject = async () => {
    if (!formData.name || !formData.companyId || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Creating project with data:', formData);
      const newProject = await projectsApi.create(formData);
      console.log('Project created successfully:', newProject);
      
      // Reload projects data
      await loadData();
      
      toast({
        title: "Project Created",
        description: `Project "${formData.name}" has been created successfully.`,
      });
      
      // Reset form
      setFormData({
        name: '',
        companyId: '',
        description: '',
        startDate: '',
        endDate: '',
        priority: 'Medium'
      });
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Creation Failed",
        description: "There was an error creating the project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageFiles = (project: any) => {
    setSelectedProject(project);
    setIsUploadModalOpen(true);
  };

  const handleFileUpload = async (file: File, tags: string) => {
    if (!selectedProject) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('name', file.name);
    formData.append('tags', tags);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects/${selectedProject._id}/documents`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('File uploaded successfully:', result);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });

      // Reload projects data
      await loadData();
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    toast({
      title: "Project Deleted",
      description: "Project has been successfully deleted.",
    });
  };

  const handleEditProject = (project: any) => {
    toast({
      title: "Edit Project",
      description: `Editing project: ${project.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-edicius-navy/50 to-edicius-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Projects Management</h1>
              <p className="text-white/70">Manage all projects across Edicius companies</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-edicius-gold to-edicius-gold/80 text-edicius-navy px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-edicius-gold/20 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Project</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edicius-gold"></div>
          </div>
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
              <Card className="bg-white/10 backdrop-blur-xl border border-edicius-gold/20 hover:bg-white/15 transition-all duration-300 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg mb-2">{project.name}</CardTitle>
                      <div className="flex items-center space-x-2 mb-3">
                        <Building2 className="w-4 h-4 text-edicius-gold" />
                        <span className="text-white/70 text-sm">{project.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(project.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(project.status)}
                          <span>{project.status}</span>
                        </div>
                      </Badge>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-edicius-gold to-edicius-gold/80 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <Users className="w-4 h-4 text-edicius-gold" />
                      <span>{project.teamSize} members</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <FileText className="w-4 h-4 text-edicius-gold" />
                      <span>{project.documents} docs</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <TrendingUp className="w-4 h-4 text-edicius-gold" />
                      <span>{project.completedMilestones}/{project.milestones} milestones</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-white/70">
                      <Calendar className="w-4 h-4 text-edicius-gold" />
                      <span>{project.endDate}</span>
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
                      <Upload className="w-4 h-4 mr-2" />
                      Manage Files
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProject(project)}
                      className="border-edicius-gold/30 text-edicius-gold hover:bg-edicius-gold/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProject(project._id)}
                      className="border-red-500/30 text-red-500 hover:bg-red-500/10"
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

        {/* Create Project Modal */}
        {isCreateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-edicius-navy/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-edicius-gold/20"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Create New Project</h2>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="text-edicius-gold/70 hover:text-edicius-gold transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Project Name */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Project Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-white focus:outline-none focus:border-edicius-gold"
                      placeholder="Enter project name"
                    />
                  </div>

                  {/* Company Selection */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Company *</label>
                    <select
                      value={formData.companyId}
                      onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-white focus:outline-none focus:border-edicius-gold"
                    >
                      <option value="">Choose a company...</option>
                      {companies.map(company => (
                        <option key={company.id} value={company.id}>{company.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-white focus:outline-none focus:border-edicius-gold"
                      placeholder="Describe the project goals and objectives"
                    />
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-white focus:outline-none focus:border-edicius-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-white focus:outline-none focus:border-edicius-gold"
                      />
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-edicius-gold/20 rounded-lg text-white focus:outline-none focus:border-edicius-gold"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
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
                        'Create Project'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Upload Files Modal */}
        {isUploadModalOpen && selectedProject && (
          <FileUploadModal
            project={selectedProject}
            onClose={() => setIsUploadModalOpen(false)}
            onUpload={handleFileUpload}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProjects;