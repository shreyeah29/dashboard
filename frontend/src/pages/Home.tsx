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
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-edicius-red/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-edicius-red/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-edicius-red/3 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="flex items-center space-x-1">
                  <motion.div 
                    className="w-2 h-16 bg-edicius-red"
                    initial={{ height: 0 }}
                    animate={{ height: 64 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  ></motion.div>
                  <motion.div 
                    className="w-2 h-20 bg-edicius-red"
                    initial={{ height: 0 }}
                    animate={{ height: 80 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  ></motion.div>
                  <motion.div 
                    className="w-2 h-12 bg-edicius-red"
                    initial={{ height: 0 }}
                    animate={{ height: 48 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                  ></motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="text-2xl md:text-3xl font-bold tracking-wider"
                >
                  EDICIUS
                </motion.div>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8"
            >
              <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Consulting Minds.
              </span>
              <span className="block bg-gradient-to-r from-edicius-red via-red-500 to-edicius-red bg-clip-text text-transparent">
                Diverse Ventures.
              </span>
              <span className="block bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                One Vision.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Edicius Group blends expert consulting with a wide spectrum of industries — 
              from consumer products to infrastructure — driving innovation, efficiency, 
              and excellence across every vertical.
            </motion.p>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-edicius-red mb-2">8+</div>
                <div className="text-gray-300 font-semibold">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-edicius-red mb-2">7+</div>
                <div className="text-gray-300 font-semibold">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-edicius-red mb-2">100%</div>
                <div className="text-gray-300 font-semibold">Innovation Focus</div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(220, 38, 38, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-edicius-red text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Explore Our Companies</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-300"
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            ></motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Companies Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="text-edicius-red">Companies</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
                    <Card className="h-full bg-gray-800 border-gray-700 hover:shadow-2xl hover:shadow-edicius-red/20 transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                      <div className="relative overflow-hidden rounded-t-lg">
                        {company.heroImage ? (
                          <img
                            src={company.heroImage}
                            alt={company.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              console.log('Image failed to load:', company.heroImage);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-edicius-red to-red-600 flex items-center justify-center">
                            <Building2 className="w-16 h-16 text-white" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center space-x-1">
                            <div className="w-1 h-4 bg-edicius-red"></div>
                            <div className="w-1 h-6 bg-edicius-red"></div>
                            <div className="w-1 h-3 bg-edicius-red"></div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6 bg-gray-800">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-edicius-red transition-colors duration-200">
                          {company.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                          {company.overview}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs border-edicius-red text-edicius-red hover:bg-edicius-red hover:text-white">
                            Learn More
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-edicius-red group-hover:translate-x-1 transition-transform duration-200" />
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
      <section className="py-20 bg-gradient-to-br from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Our <span className="text-edicius-red">Mission</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                At Edicius Group, we are committed to creating innovative solutions that 
                transform industries and improve lives. Through our diverse portfolio of 
                companies, we drive sustainable growth, technological advancement, and 
                positive social impact.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-edicius-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Innovation</h3>
                  <p className="text-gray-300">Pioneering cutting-edge solutions across all sectors</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-edicius-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Sustainability</h3>
                  <p className="text-gray-300">Building a better future through responsible practices</p>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-edicius-red rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Excellence</h3>
                  <p className="text-gray-300">Delivering exceptional value to our stakeholders</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
