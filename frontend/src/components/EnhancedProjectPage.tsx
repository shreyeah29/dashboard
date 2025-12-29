import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { enhanceProjectContent, EnhancedProjectContent } from '@/utils/contentEnhancer';

// Function to get appropriate hero image based on project name
const getProjectHeroImage = (projectName: string) => {
  const name = projectName.toLowerCase();
  
  if (name.includes('legal') || name.includes('law')) {
    return 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Legal/Law
  } else if (name.includes('tech') || name.includes('software') || name.includes('digital')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80'; // Technology
  } else if (name.includes('mining') || name.includes('industrial')) {
    return 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Mining/Industrial
  } else if (name.includes('entertainment') || name.includes('media') || name.includes('production')) {
    return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Entertainment/Media
  } else if (name.includes('consulting') || name.includes('strategy')) {
    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Consulting/Strategy
  } else if (name.includes('construction') || name.includes('building')) {
    return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Construction
  } else if (name.includes('finance') || name.includes('banking')) {
    return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Finance
  } else {
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80'; // Default business
  }
};

// Function to get feature images for project sections
const getProjectFeatureImage = (projectName: string) => {
  const name = projectName.toLowerCase();
  
  if (name.includes('legal') || name.includes('law')) {
    return 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Legal/Law
  } else if (name.includes('tech') || name.includes('software') || name.includes('digital')) {
    return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2025&q=80'; // Technology
  } else if (name.includes('mining') || name.includes('industrial')) {
    return 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Mining/Industrial
  } else if (name.includes('entertainment') || name.includes('media') || name.includes('production')) {
    return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Entertainment/Media
  } else if (name.includes('consulting') || name.includes('strategy')) {
    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Consulting/Strategy
  } else if (name.includes('construction') || name.includes('building')) {
    return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Construction
  } else if (name.includes('finance') || name.includes('banking')) {
    return 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'; // Finance
  } else {
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80'; // Default business
  }
};

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
  // Enhance the project content
  const enhancedContent: EnhancedProjectContent = enhanceProjectContent(
    project.name, 
    project.description
  );

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
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${getProjectHeroImage(project.name)})` }}
        >
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <Link 
              to={company ? `/company/${company.slug}` : '/'} 
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 mb-8 font-medium tracking-wide"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {company ? company.name : 'Companies'}
            </Link>
            
            {company && (
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Badge variant="outline" className="text-white border-white px-4 py-2">
                  {company.name}
                </Badge>
              </div>
            )}
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white font-serif tracking-tight">
              {enhancedContent.hero.title}
            </h1>
            <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium">
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
          </motion.div>

          {/* Visual Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src={getProjectFeatureImage(project.name)}
                alt={`${project.name} project details`}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-black font-serif tracking-wide">
                Project Highlights
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                This project represents our commitment to delivering innovative solutions that drive real business value. 
                Through careful planning and execution, we ensure every milestone is met with excellence.
              </p>
              
              {/* Key Points */}
              <div className="space-y-4">
                {enhancedContent.overview.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium">{point}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
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
              <h2 className="text-4xl font-bold text-black mb-6 font-serif tracking-wide">Technology Stack</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
                Built with modern technologies and best practices
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
              {[
                'React 18',
                'TypeScript',
                'Vite',
                'Node.js',
                'Express.js',
                'MongoDB',
                'Mongoose',
                'Tailwind CSS',
                'React Router',
                'TanStack Query',
                'Framer Motion',
                'Axios',
                'Radix UI',
                'React Hook Form',
                'Zod',
                'JWT',
                'REST API'
              ].map((tech, index) => (
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
    </div>
  );
};

export default EnhancedProjectPage;
