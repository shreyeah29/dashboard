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
      case 'Planned':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-edicius-navy via-blue-900 to-edicius-navy text-white overflow-hidden">
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
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {project.title}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl">
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
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Section */}
            {project.team && project.team.length > 0 && (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.team.map((member, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-edicius-gold rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                        </div>
                      ))}
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
                            <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                            <p className="text-sm text-gray-600">{formatDate(milestone.date)}</p>
                            {milestone.note && (
                              <p className="text-sm text-gray-500 mt-1">{milestone.note}</p>
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
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Project Documents</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.documents.map((doc: any) => (
                        <div 
                          key={doc._id}
                          className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                          onClick={() => handleDocumentClick(doc)}
                        >
                          <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{doc.name}</p>
                            <p className="text-sm text-gray-500">
                              {doc.type.toUpperCase()} • {formatFileSize(doc.size)}
                            </p>
                          </div>
                          <Eye className="w-4 h-4 text-gray-400" />
                        </div>
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

                  {project.team && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Team Size</label>
                      <p className="text-sm text-gray-900">{project.team.length} members</p>
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
          projectName={project.title}
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
