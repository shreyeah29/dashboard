import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { companiesApi, projectsApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Calendar, Users, ArrowRight, Globe } from 'lucide-react';
import { formatDate, getStatusColor } from '@/lib/utils';

const CompanyPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['company', slug],
    queryFn: () => companiesApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', slug],
    queryFn: () => projectsApi.getByCompanySlug(slug!),
    enabled: !!slug,
  });

  if (companyLoading || projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edicius-gold"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Company not found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-edicius-red to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        {company.heroImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${company.heroImage})` }}
          ></div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="inline-flex items-center text-edicius-gold hover:text-yellow-300 transition-colors duration-200 mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Link>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              {company.name}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              {company.overview}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-gradient-to-br from-black to-edicius-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-8">
              About {company.name}
            </h2>
            <div className="max-w-5xl mx-auto">
              <p className="text-xl text-gray-200 leading-relaxed mb-8">
                {company.overview}
              </p>
              
              {/* Company Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/20"
                >
                  <div className="w-16 h-16 bg-edicius-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Innovation Focus</h3>
                  <p className="text-gray-200">Cutting-edge technology solutions and strategic consulting services</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/20"
                >
                  <div className="w-16 h-16 bg-edicius-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Expert Team</h3>
                  <p className="text-gray-200">Experienced professionals dedicated to digital transformation</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/20"
                >
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Global Reach</h3>
                  <p className="text-gray-200">Serving clients worldwide with innovative solutions</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Services Section */}
      <section className="py-20 bg-gradient-to-br from-edicius-red to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Services</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Comprehensive solutions tailored to meet your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-edicius-gold to-edicius-red rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Innovation & Technology</h3>
                  <p className="text-gray-200 leading-relaxed">
                    Cutting-edge technology solutions and digital transformation services
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-edicius-red to-edicius-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">💼</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Strategic Consulting</h3>
                  <p className="text-gray-200 leading-relaxed">
                    Expert business consulting and strategic planning services
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-edicius-gold to-edicius-red rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Custom Solutions</h3>
                  <p className="text-gray-200 leading-relaxed">
                    Tailored solutions designed to meet your specific requirements
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-gradient-to-br from-black to-edicius-red">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Our Projects
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Explore the innovative projects and initiatives driving our success in digital transformation
            </p>
          </motion.div>

          {projects && projects.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project) => (
                <motion.div key={project._id} variants={itemVariants}>
                  <Link to={`/project/${project.slug}`}>
                    <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group cursor-pointer border-0 shadow-lg bg-white/10 backdrop-blur-sm border-white/20">
                      <div className="relative overflow-hidden rounded-t-xl">
                        {project.bannerImage ? (
                          <img
                            src={project.bannerImage}
                            alt={project.name}
                            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-56 bg-gradient-to-br from-black via-edicius-red to-edicius-gold flex items-center justify-center">
                            <Building2 className="w-20 h-20 text-white group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Badge className={`${getStatusColor(project.status)} text-sm font-semibold px-3 py-1`}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-edicius-gold transition-colors duration-200">
                          {project.name}
                        </h3>
                        <p className="text-gray-200 text-base mb-6 line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-300 mb-6">
                          <div className="flex items-center bg-white/10 px-3 py-2 rounded-full">
                            <Users className="w-4 h-4 mr-2 text-edicius-gold" />
                            <span className="font-medium">{project.teamSize || 0} members</span>
                          </div>
                          <div className="flex items-center bg-white/10 px-3 py-2 rounded-full">
                            <Calendar className="w-4 h-4 mr-2 text-edicius-gold" />
                            <span className="font-medium">{formatDate(project.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/20">
                          <span className="text-lg font-semibold text-edicius-gold group-hover:text-white transition-colors duration-200">
                            View Project Details
                          </span>
                          <ArrowRight className="w-5 h-5 text-edicius-gold group-hover:translate-x-2 transition-transform duration-200" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center py-12"
            >
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No projects yet
              </h3>
              <p className="text-gray-500">
                Projects for this company will be displayed here once they are added.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CompanyPage;
