import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Edit, Trash2, Eye, Calendar, User } from 'lucide-react';

const AdminProjects = () => {
  const [projects] = useState([
    {
      id: '1',
      name: 'Smart City Infrastructure',
      company: 'Edicius Infrastructure and Developers',
      description: 'Developing sustainable smart city solutions with IoT integration and renewable energy systems.',
      status: 'In Progress',
      progress: 65,
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      teamSize: 12,
      priority: 'High'
    },
    {
      id: '2',
      name: 'Digital Transformation Platform',
      company: 'Edicius Innovations and Consulting',
      description: 'Creating a comprehensive digital transformation platform for enterprise clients.',
      status: 'Planning',
      progress: 25,
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      teamSize: 8,
      priority: 'High'
    },
    {
      id: '3',
      name: 'Consumer IoT Products',
      company: 'Edicius Consumer Products',
      description: 'Developing next-generation smart home devices and personal care products.',
      status: 'In Progress',
      progress: 45,
      startDate: '2024-02-10',
      endDate: '2024-11-30',
      teamSize: 15,
      priority: 'Medium'
    },
    {
      id: '4',
      name: 'Global Supply Chain Optimization',
      company: 'Edicius Imports and Exports',
      description: 'Implementing AI-driven supply chain optimization for international trade operations.',
      status: 'Completed',
      progress: 100,
      startDate: '2023-09-01',
      endDate: '2024-01-31',
      teamSize: 6,
      priority: 'High'
    },
    {
      id: '5',
      name: 'Entertainment Content Production',
      company: 'Edicius Productions and Entertainment',
      description: 'Producing high-quality digital content and immersive brand experiences.',
      status: 'In Progress',
      progress: 80,
      startDate: '2024-01-01',
      endDate: '2024-10-31',
      teamSize: 10,
      priority: 'Medium'
    },
    {
      id: '6',
      name: 'Sustainable Mining Operations',
      company: 'Edicius Mining and Minerals',
      description: 'Implementing eco-friendly mining technologies and ethical resource extraction methods.',
      status: 'Planning',
      progress: 15,
      startDate: '2024-04-01',
      endDate: '2025-03-31',
      teamSize: 20,
      priority: 'High'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects Management</h1>
              <p className="text-gray-600">Manage all projects across Edicius Group companies</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
                      <p className="text-sm text-gray-600 mb-3">{project.company}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-500">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Project Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Start: {project.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">End: {project.endDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{project.teamSize} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Project #{project.id}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProjects;