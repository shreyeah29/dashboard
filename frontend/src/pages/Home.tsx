import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { companiesApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, ArrowRight, Star, Users, Globe } from 'lucide-react';

const Home = () => {
  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: companiesApi.getAll,
  });

  // Debug logging
  console.log('Companies data:', companies);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

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
      <section className="relative bg-gradient-to-br from-gray-50 to-white text-edicius-navy overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="block">Consulting Minds.</span>
                <span className="block">Diverse Ventures.</span>
                <span className="block">One Vision.</span>
              </h1>
              <p className="text-lg text-edicius-gray leading-relaxed max-w-2xl">
                Edicius Group blends expert consulting with a wide spectrum of industries — 
                from consumer products to infrastructure — driving innovation, efficiency, 
                and excellence across every vertical.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-edicius-navy text-white px-8 py-4 rounded-lg font-semibold hover:bg-edicius-navy/90 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Explore More</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Right Content - Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg border"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-6 bg-edicius-red"></div>
                    <div className="w-1 h-6 bg-edicius-red"></div>
                    <div className="w-1 h-6 bg-edicius-red"></div>
                  </div>
                  <span className="text-lg font-bold text-edicius-navy">EDICIUS GROUP OF COMPANIES</span>
                </div>
                
                <p className="text-edicius-gray text-sm leading-relaxed">
                  where innovation meets precision. With over 7 years of relentless dedication, 
                  we've been shaping industries, setting standards.
                </p>

                <div className="space-y-4">
                  <h3 className="font-bold text-edicius-navy">Registered Office</h3>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 text-edicius-red mt-0.5">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-sm text-edicius-gray">
                      <p>Flat. No.105 Lake Melody Apartment,</p>
                      <p>Rajbhavan Road, Somajiguda,</p>
                      <p>Hyderabad. Pin: 500082.</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-edicius-red">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <span className="text-sm text-edicius-gray">+91 8341 029 691</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 text-edicius-red">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-sm text-edicius-gray">info@gmail.com</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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

          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">Error loading companies: {error.message}</p>
            </div>
          ) : companies && companies.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {companies.map((company, index) => (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No companies found</p>
              <p className="text-gray-500 text-sm mt-2">Companies data: {JSON.stringify(companies)}</p>
            </div>
          )}
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
