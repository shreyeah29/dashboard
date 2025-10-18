import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { projectsApi, commentsApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DocumentViewer from '@/components/DocumentViewer';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  CheckCircle,
  Clock,
  PlayCircle,
  Eye,
  Building2
} from 'lucide-react';
import { formatDate, getStatusColor, getDocumentIcon, formatFileSize } from '@/lib/utils';
import { useState } from 'react';

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => projectsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: comments } = useQuery({
    queryKey: ['comments', project?._id],
    queryFn: () => commentsApi.getByProject(project!._id),
    enabled: !!project?._id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edicius-gold"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const company = typeof project.companyId === 'object' ? project.companyId : null;

  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document);
    setIsDocumentViewerOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'In Progress':
        return <PlayCircle className="w-4 h-4" />;
      case 'Planning':
        return <Clock className="w-4 h-4" />;
      case 'On Hold':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        {project.bannerImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${project.bannerImage})` }}
          ></div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              to={company ? `/company/${company.slug}` : '/'} 
              className="inline-flex items-center text-edicius-gold hover:text-yellow-300 transition-colors duration-200 mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {company ? company.name : 'Companies'}
            </Link>
            
            <div className="flex items-center space-x-3 mb-4">
              <Badge className={`${getStatusColor(project.status)} flex items-center space-x-1`}>
                {getStatusIcon(project.status)}
                <span>{project.status}</span>
              </Badge>
              {company && (
                <Badge variant="outline" className="text-white border-white">
                  {company.name}
                </Badge>
              )}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              {project.name}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-edicius-navy to-edicius-gold text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold flex items-center">
                    <FileText className="w-6 h-6 mr-3" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border-l-4 border-edicius-gold mb-6">
                      <h3 className="text-xl font-bold text-black mb-3">About This Project</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Section */}
            {project.teamSize && project.teamSize > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Team Members</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Team size: {project.teamSize} members
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Team member details will be displayed here when available.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Milestones */}
            {project.milestones && project.milestones.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Project Timeline</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-edicius-gold rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{milestone.name}</h4>
                            <p className="text-sm text-gray-600">{milestone.dueDate ? formatDate(milestone.dueDate) : 'No due date'}</p>
                            {milestone.description && (
                              <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Documents */}
            {project.documents && project.documents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-edicius-red to-edicius-gold text-white rounded-t-lg">
                    <CardTitle className="text-2xl font-bold flex items-center">
                      <FileText className="w-6 h-6 mr-3" />
                      Project Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 gap-6">
                      {project.documents.map((doc: any) => (
                        <motion.div 
                          key={doc._id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center space-x-4 p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-lg cursor-pointer transition-all duration-300 group"
                          onClick={() => handleDocumentClick(doc)}
                        >
                          <div className="w-16 h-16 bg-gradient-to-br from-edicius-gold to-edicius-red rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="text-2xl text-white">{getDocumentIcon(doc.fileType || 'other')}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg text-black mb-1 group-hover:text-edicius-gold transition-colors duration-200">
                              {doc.name}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="bg-edicius-gold/10 text-edicius-gold px-3 py-1 rounded-full font-semibold">
                                {doc.fileType?.toUpperCase() || 'FILE'}
                              </span>
                              <span className="font-medium">
                                {formatFileSize(doc.fileSize || 0)}
                              </span>
                              <span className="text-gray-500">
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-edicius-gold/10 rounded-full flex items-center justify-center group-hover:bg-edicius-gold group-hover:text-white transition-all duration-300">
                              <Eye className="w-5 h-5 text-edicius-gold group-hover:text-white" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Comments */}
            {comments && comments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5" />
                      <span>Comments & Notes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment._id} className="border-l-4 border-edicius-gold pl-4 py-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {comment.author === 'admin' ? 'Admin' : 'System'}
                              {comment.author === 'admin' && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  (internal note)
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <Badge className={`${getStatusColor(project.status)} flex items-center space-x-1 w-fit`}>
                        {getStatusIcon(project.status)}
                        <span>{project.status}</span>
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-sm text-gray-900">{formatDate(project.createdAt)}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <p className="text-sm text-gray-900">{formatDate(project.updatedAt)}</p>
                  </div>

                  {project.teamSize && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Team Size</label>
                      <p className="text-sm text-gray-900">{project.teamSize} members</p>
                    </div>
                  )}

                  {project.documents && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Documents</label>
                      <p className="text-sm text-gray-900">{project.documents.length} files</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          projectName={project.name}
          isOpen={isDocumentViewerOpen}
          onClose={() => {
            setIsDocumentViewerOpen(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectPage;
