import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { companiesApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, ArrowRight, Star, Users, Globe } from 'lucide-react';

const Home = () => {
  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesApi.getAll,
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-edicius-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-edicius-navy via-blue-900 to-edicius-navy text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              The Edicius Group
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Innovating Across Industries
            </p>
            <p className="text-lg text-gray-300 mb-12 max-w-4xl mx-auto">
              A diverse portfolio of companies driving innovation, sustainability, and excellence 
              across consumer products, infrastructure, technology, and entertainment sectors.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              <div className="flex items-center space-x-2">
                <Building2 className="w-6 h-6 text-edicius-gold" />
                <span className="text-lg font-semibold">8 Companies</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-6 h-6 text-edicius-gold" />
                <span className="text-lg font-semibold">Global Reach</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-edicius-gold" />
                <span className="text-lg font-semibold">Innovation Leader</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-edicius-navy mb-4">
              Our Companies
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the diverse portfolio of Edicius companies, each leading innovation 
              in their respective industries.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {companies?.map((company, index) => (
              <motion.div key={company._id} variants={itemVariants}>
                <Link to={`/company/${company.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                    <div className="relative overflow-hidden rounded-t-lg">
                      {company.heroImage ? (
                        <img
                          src={company.heroImage}
                          alt={company.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-edicius-navy to-edicius-gold flex items-center justify-center">
                          <Building2 className="w-16 h-16 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-edicius-navy mb-3 group-hover:text-edicius-gold transition-colors duration-200">
                        {company.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {company.overview}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          Learn More
                        </Badge>
                        <ArrowRight className="w-4 h-4 text-edicius-gold group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-edicius-navy mb-8">
              Our Mission
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                At Edicius Group, we are committed to creating innovative solutions that 
                transform industries and improve lives. Through our diverse portfolio of 
                companies, we drive sustainable growth, technological advancement, and 
                positive social impact.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-edicius-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-edicius-navy mb-2">Innovation</h3>
                  <p className="text-gray-600">Pioneering cutting-edge solutions across all sectors</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-edicius-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-edicius-navy mb-2">Sustainability</h3>
                  <p className="text-gray-600">Building a better future through responsible practices</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-edicius-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-edicius-navy mb-2">Excellence</h3>
                  <p className="text-gray-600">Delivering exceptional value to our stakeholders</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
