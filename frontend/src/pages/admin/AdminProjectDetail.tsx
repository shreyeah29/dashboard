import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, Plus, Upload, MessageSquare, Calendar, User, FileText } from 'lucide-react';

const AdminProjectDetail = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const project = {
    id: '1',
    name: 'Smart City Infrastructure',
    company: 'Edicius Infrastructure and Developers',
    description: 'Developing sustainable smart city solutions with IoT integration and renewable energy systems. This project aims to create a comprehensive infrastructure platform that will serve as a model for future smart cities worldwide.',
    status: 'In Progress',
    progress: 65,
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    teamSize: 12,
    priority: 'High',
    budget: '$2.5M',
    documents: 15,
    comments: 8
  };

  const milestones = [
    { id: 1, title: 'Project Planning & Design', status: 'Completed', date: '2024-02-15' },
    { id: 2, title: 'Infrastructure Setup', status: 'Completed', date: '2024-03-30' },
    { id: 3, title: 'IoT Integration', status: 'In Progress', date: '2024-06-15' },
    { id: 4, title: 'Testing & Validation', status: 'Planned', date: '2024-09-30' },
    { id: 5, title: 'Deployment & Launch', status: 'Planned', date: '2024-12-31' }
  ];

  const teamMembers = [
    { name: 'John Smith', role: 'Project Manager', avatar: 'JS' },
    { name: 'Sarah Johnson', role: 'Lead Developer', avatar: 'SJ' },
    { name: 'Mike Chen', role: 'IoT Specialist', avatar: 'MC' },
    { name: 'Emily Davis', role: 'UI/UX Designer', avatar: 'ED' }
  ];

  const recentComments = [
    { author: 'John Smith', message: 'Great progress on the IoT integration. Keep up the excellent work!', time: '2 hours ago' },
    { author: 'Sarah Johnson', message: 'The testing phase is ready to begin. All systems are green.', time: '4 hours ago' },
    { author: 'Mike Chen', message: 'Need to review the sensor calibration data before proceeding.', time: '6 hours ago' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'milestones', label: 'Milestones', icon: Calendar },
    { id: 'team', label: 'Team', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'comments', label: 'Comments', icon: MessageSquare }
  ];

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
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600 mb-4">{project.company}</p>
              <div className="flex items-center space-x-4">
                <Badge className="bg-blue-100 text-blue-800">{project.status}</Badge>
                <Badge className="bg-red-100 text-red-800">{project.priority}</Badge>
                <span className="text-sm text-gray-500">Budget: {project.budget}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Project Progress</span>
                <span className="text-sm text-gray-500">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{project.description}</p>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Start Date</span>
                      <span className="text-sm font-medium">{project.startDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">End Date</span>
                      <span className="text-sm font-medium">{project.endDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Team Size</span>
                      <span className="text-sm font-medium">{project.teamSize} members</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Documents</span>
                      <span className="text-sm font-medium">{project.documents} files</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Comments</span>
                      <span className="text-sm font-medium">{project.comments} comments</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'milestones' && (
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        milestone.status === 'Completed' ? 'bg-green-500' :
                        milestone.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        <p className="text-sm text-gray-600">Due: {milestone.date}</p>
                      </div>
                      <Badge className={
                        milestone.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        milestone.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }>
                        {milestone.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-red-600">{member.avatar}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'documents' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Project Documents</CardTitle>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Document management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'comments' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Project Comments</CardTitle>
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Comment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentComments.map((comment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-red-600">
                            {comment.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">{comment.author}</h4>
                            <span className="text-xs text-gray-500">{comment.time}</span>
                          </div>
                          <p className="text-gray-700">{comment.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProjectDetail;