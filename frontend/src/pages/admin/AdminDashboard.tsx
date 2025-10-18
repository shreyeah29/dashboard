import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, FileText, TrendingUp, Plus, Edit, Trash2, Clock, Activity, Upload, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const stats = [
    { title: 'Total Companies', value: '8', icon: Building2, color: 'text-black', bgColor: 'bg-gray-100' },
    { title: 'Active Projects', value: '24', icon: FileText, color: 'text-black', bgColor: 'bg-gray-100' },
    { title: 'Team Members', value: '156', icon: Users, color: 'text-black', bgColor: 'bg-gray-100' },
    { title: 'Documents', value: '89', icon: FileText, color: 'text-black', bgColor: 'bg-gray-100' },
  ];

  const recentActivities = [
    { action: 'New project created', company: 'Edicius Enterprises', time: '2 hours ago', type: 'project' },
    { action: 'Document uploaded', company: 'Edicius Infrastructure', time: '4 hours ago', type: 'document' },
    { action: 'Team member added', company: 'Edicius Innovations', time: '6 hours ago', type: 'team' },
    { action: 'Project updated', company: 'Edicius Consumer Products', time: '8 hours ago', type: 'project' },
    { action: 'Analytics report generated', company: 'Edicius Mining', time: '10 hours ago', type: 'analytics' },
  ];

  const chartData = [
    { name: 'Enterprises', projects: 8, documents: 12 },
    { name: 'Infrastructure', projects: 6, documents: 15 },
    { name: 'Innovations', projects: 12, documents: 8 },
    { name: 'Consumer Products', projects: 7, documents: 10 },
    { name: 'Mining', projects: 5, documents: 6 },
    { name: 'Hotels', projects: 2, documents: 4 },
  ];

  const pieData = [
    { name: 'Legal', value: 25, color: '#DC2626' },
    { name: 'Financial', value: 30, color: '#000000' },
    { name: 'Planning', value: 20, color: '#374151' },
    { name: 'Technical', value: 25, color: '#6B7280' },
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
          <h1 className="text-4xl font-bold text-black mb-2 font-serif tracking-wide">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg font-medium">Manage your Edicius Group companies and projects</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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

        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Projects by Company Chart */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Projects by Company</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#6B7280" opacity={0.3} />
                  <XAxis dataKey="name" stroke="#374151" />
                  <YAxis stroke="#374151" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      color: '#374151'
                    }} 
                  />
                  <Bar dataKey="projects" fill="#000000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Document Types Chart */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-black">Document Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0B1F3A', 
                      border: '1px solid #C9A227',
                      borderRadius: '8px',
                      color: '#C9A227'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-black">
                  <span>Recent Activities</span>
                  <Badge variant="outline" className="text-black border-black">
                    Live
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'project' ? 'bg-black' :
                        activity.type === 'document' ? 'bg-blue-500' :
                        activity.type === 'team' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-black">{activity.action}</p>
                        <p className="text-xs text-gray-600">{activity.company}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
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
    </div>
  );
};

export default AdminDashboard;