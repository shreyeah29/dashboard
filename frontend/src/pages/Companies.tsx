import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { companiesApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, ArrowRight, Star, Users, Globe } from 'lucide-react';

const Companies = () => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-black via-gray-800 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Companies
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Discover the diverse portfolio of Edicius companies, each leading innovation 
              in their respective industries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Companies Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                            onError={(e) => {
                              console.log('Image failed to load:', company.heroImage);
                              e.currentTarget.style.display = 'none';
                            }}
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
    </div>
  );
};

export default Companies;
