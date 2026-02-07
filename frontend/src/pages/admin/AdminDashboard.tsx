import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, FileText, Plus, Upload, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const stats = [
    { title: 'Companies', value: '9', icon: Building2, color: 'text-black', bgColor: 'bg-gray-100' },
    { title: 'Active Projects', value: '4', icon: FileText, color: 'text-black', bgColor: 'bg-gray-100' },
    { title: 'Team Members', value: '10', icon: Users, color: 'text-black', bgColor: 'bg-gray-100' },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Dashboard...</p>
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
          <h1 className="text-4xl font-bold text-black mb-2 font-serif tracking-wide">Edicius Dashboard</h1>
          <p className="text-gray-600 text-lg font-medium">business and statistic information</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-white border border-gray-200 hover:shadow-xl transition-all duration-300 hover:shadow-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-black">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor} border border-gray-200`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-md"
        >
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="text-black">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <Plus className="w-5 h-5 text-black" />
                    <span className="text-sm font-medium text-black">Add New Company</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <FileText className="w-5 h-5 text-black" />
                    <span className="text-sm font-medium text-black">Create Project</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <Upload className="w-5 h-5 text-black" />
                    <span className="text-sm font-medium text-black">Upload Document</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  >
                    <Eye className="w-5 h-5 text-black" />
                    <span className="text-sm font-medium text-black">View Analytics</span>
                  </motion.button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;