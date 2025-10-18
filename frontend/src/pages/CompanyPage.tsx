import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { companiesApi, projectsApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Calendar, Users, ArrowRight } from 'lucide-react';
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
      <section className="relative bg-gradient-to-br from-edicius-navy via-blue-900 to-edicius-navy text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
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
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {company.name}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              {company.overview}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-edicius-navy mb-6">
              About {company.name}
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 leading-relaxed">
                {company.overview}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-edicius-navy mb-4">
              Our Projects
            </h2>
            <p className="text-lg text-gray-600">
              Explore the innovative projects and initiatives driving our success
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
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                      <div className="relative overflow-hidden rounded-t-lg">
                        {project.bannerImage ? (
                          <img
                            src={project.bannerImage}
                            alt={project.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-edicius-navy to-edicius-gold flex items-center justify-center">
                            <Building2 className="w-16 h-16 text-white" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-edicius-navy mb-3 group-hover:text-edicius-gold transition-colors duration-200">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{project.team.length} members</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(project.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-edicius-gold font-medium">
                            View Project
                          </span>
                          <ArrowRight className="w-4 h-4 text-edicius-gold group-hover:translate-x-1 transition-transform duration-200" />
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
