import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Eye
} from 'lucide-react';
import { companiesApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';

const AdminCompanies = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: companiesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting company:', error);
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
          <h1 className="text-3xl font-bold text-edicius-navy">Companies</h1>
          <p className="text-gray-600 mt-2">
            Manage all companies under the Edicius Group
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </motion.div>

      {/* Companies Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {companies?.map((company) => (
          <motion.div key={company._id} variants={itemVariants}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <div className="relative overflow-hidden rounded-t-lg">
                {company.heroImage ? (
                  <img
                    src={company.heroImage}
                    alt={company.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-edicius-navy to-edicius-gold flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-edicius-navy mb-3">
                  {company.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {company.overview}
                </p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Created {formatDate(company.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Link to={`/company/${company.slug}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingCompany(company)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(company._id)}
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
        ))}
      </motion.div>

      {companies?.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12"
        >
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No companies yet
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by adding your first company to the Edicius Group.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AdminCompanies;
