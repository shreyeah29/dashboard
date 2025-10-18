import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Eye,
  Users,
  Building2
} from 'lucide-react';
import { projectsApi, companiesApi } from '@/lib/api';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Link } from 'react-router-dom';

const AdminProjects = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesApi.getAll,
  });

  // Get all projects by fetching from each company
  const { data: allProjects, isLoading } = useQuery({
    queryKey: ['all-projects'],
    queryFn: async () => {
      if (!companies) return [];
      const projectPromises = companies.map(company => 
        projectsApi.getByCompanySlug(company.slug)
      );
      const projectArrays = await Promise.all(projectPromises);
      return projectArrays.flat();
    },
    enabled: !!companies,
  });

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edicius-gold"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-edicius-navy">Projects</h1>
          <p className="text-gray-600 mt-2">
            Manage all projects across Edicius Group companies
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {allProjects?.map((project) => {
          const company = companies?.find(c => c._id === project.companyId);
          return (
            <motion.div key={project._id} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <div className="relative overflow-hidden rounded-t-lg">
                  {project.bannerImage ? (
                    <img
                      src={project.bannerImage}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-edicius-navy to-edicius-gold flex items-center justify-center">
                      <FolderOpen className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-edicius-navy mb-2">
                    {project.title}
                  </h3>
                  
                  {company && (
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Building2 className="w-4 h-4 mr-1" />
                      <span>{company.name}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{project.team?.length || 0} members</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link to={`/project/${project.slug}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link to={`/admin/projects/${project._id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(project._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {allProjects?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12"
        >
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by adding your first project to a company.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AdminProjects;
