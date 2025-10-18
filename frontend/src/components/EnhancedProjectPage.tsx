import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Users, 
  CheckCircle,
  Clock,
  PlayCircle,
  Eye,
  Star,
  Shield,
  Zap,
  Globe,
  Code,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate, getStatusColor } from '@/lib/utils';
import { enhanceProjectContent, EnhancedProjectContent } from '@/utils/contentEnhancer';
import DocumentViewer from './DocumentViewer';

interface EnhancedProjectPageProps {
  project: any;
  company: any;
  comments?: any[];
}

const EnhancedProjectPage: React.FC<EnhancedProjectPageProps> = ({ 
  project, 
  company, 
  comments = [] 
}) => {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  
  // Enhance the project content
  const enhancedContent: EnhancedProjectContent = enhanceProjectContent(
    project.name, 
    project.description
  );

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
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${enhancedContent.hero.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-gray-50/80 to-white/90"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link 
              to={company ? `/company/${company.slug}` : '/'} 
              className="inline-flex items-center text-gray-600 hover:text-black transition-colors duration-200 mb-8 font-medium tracking-wide"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {company ? company.name : 'Companies'}
            </Link>
            
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Badge className={`${getStatusColor(project.status)} flex items-center space-x-1 text-sm px-4 py-2`}>
                {getStatusIcon(project.status)}
                <span>{project.status}</span>
              </Badge>
              {company && (
                <Badge variant="outline" className="text-gray-900 border-gray-900 px-4 py-2">
                  {company.name}
                </Badge>
              )}
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-black font-serif tracking-tight">
              {enhancedContent.hero.title}
            </h1>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
              {enhancedContent.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Project Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-bold text-black mb-6 font-serif tracking-wide">Project Overview</h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12 font-medium">
                {enhancedContent.overview.summary}
              </p>
            </motion.div>

            {/* Key Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {enhancedContent.overview.keyPoints.map((point, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-gray-600 leading-relaxed font-medium">{point}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-6 font-serif tracking-wide">{enhancedContent.features.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                Discover the powerful features that make this project stand out
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enhancedContent.features.items.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border border-gray-200">
                    <CardContent className="p-8">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold text-black mb-3 font-serif tracking-wide">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed font-medium">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-6 font-serif tracking-wide">{enhancedContent.technology.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                Built with modern technologies and best practices
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
              {enhancedContent.technology.stack.map((tech, index) => (
                <Badge 
                  key={index}
                  className="bg-black text-white px-6 py-3 text-lg font-semibold hover:scale-105 transition-transform duration-200 tracking-wide"
                >
                  {tech}
                </Badge>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-6 font-serif tracking-wide">{enhancedContent.benefits.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                Experience the advantages of our innovative solution
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {enhancedContent.benefits.items.map((benefit, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <div className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-lg text-gray-700 font-medium">{benefit}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-6 font-serif tracking-wide">{enhancedContent.gallery.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                Visual insights into our project implementation
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {enhancedContent.gallery.images.map((image, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <p className="text-gray-600 text-center font-medium">{image.caption}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Documents Section */}
      {project.documents && project.documents.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={itemVariants} className="text-center mb-16">
                <h2 className="text-4xl font-bold text-black mb-6 font-serif tracking-wide">Project Documents</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                  Access important project files and documentation
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.documents.map((doc: any) => (
                  <motion.div key={doc._id} variants={itemVariants}>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border border-gray-200">
                      <CardContent className="p-8">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center">
                            <span className="text-2xl text-white">📄</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-black mb-2 font-serif tracking-wide">{doc.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                              <span className="bg-gray-100 text-black px-3 py-1 rounded-full font-semibold tracking-wide">
                                {doc.fileType?.toUpperCase() || 'FILE'}
                              </span>
                              <span className="font-medium">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                            </div>
                            <Button 
                              onClick={() => {
                                setSelectedDocument(doc);
                                setIsDocumentViewerOpen(true);
                              }}
                              className="bg-black hover:bg-gray-800 text-white font-medium"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Document
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Project Information Sidebar */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-xl bg-white border border-gray-200">
                <CardHeader className="bg-black text-white rounded-t-lg">
                  <CardTitle className="text-2xl font-bold flex items-center font-serif tracking-wide">
                    <Award className="w-6 h-6 mr-3" />
                    Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 tracking-wide">Status</label>
                        <div className="mt-1">
                          <Badge className={`${getStatusColor(project.status)} flex items-center space-x-1 w-fit`}>
                            {getStatusIcon(project.status)}
                            <span>{project.status}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500 tracking-wide">Created</label>
                        <p className="text-sm text-black font-medium">{formatDate(project.createdAt)}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500 tracking-wide">Last Updated</label>
                        <p className="text-sm text-black font-medium">{formatDate(project.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {project.teamSize && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 tracking-wide">Team Size</label>
                          <p className="text-sm text-black font-medium">{project.teamSize} members</p>
                        </div>
                      )}

                      {project.documents && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 tracking-wide">Documents</label>
                          <p className="text-sm text-black font-medium">{project.documents.length} files</p>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-gray-500 tracking-wide">Company</label>
                        <p className="text-sm text-black font-medium">{company?.name || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

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

export default EnhancedProjectPage;
