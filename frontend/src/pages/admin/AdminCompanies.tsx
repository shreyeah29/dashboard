import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';

const AdminCompanies = () => {
  const [companies] = useState([
    {
      id: '1',
      name: 'Edicius Enterprises Private Limited',
      slug: 'edicius-enterprises-private-limited',
      overview: 'Multi-sector B2B venture arm focusing on industrial innovation and strategic business partnerships.',
      heroImage: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      projects: 8,
      status: 'Active'
    },
    {
      id: '2',
      name: 'Edicius Innovations and Consulting Private Limited',
      slug: 'edicius-innovations-and-consulting-private-limited',
      overview: 'Digital transformation through cutting-edge technology solutions and strategic consulting services.',
      heroImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      projects: 12,
      status: 'Active'
    },
    {
      id: '3',
      name: 'Edicius Infrastructure and Developers Private Limited',
      slug: 'edicius-infrastructure-and-developers-private-limited',
      overview: 'Sustainable, smart infrastructure solutions for modern cities and eco-friendly construction projects.',
      heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      projects: 6,
      status: 'Active'
    },
    {
      id: '4',
      name: 'Edicius Imports and Exports Private Limited',
      slug: 'edicius-imports-and-exports-private-limited',
      overview: 'Seamless global commerce through advanced logistics and international trade solutions.',
      heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      projects: 4,
      status: 'Active'
    },
    {
      id: '5',
      name: 'Edicius Productions and Entertainment Private Limited',
      slug: 'edicius-productions-and-entertainment-private-limited',
      overview: 'Compelling digital content, film productions, and immersive brand experiences.',
      heroImage: 'https://images.unsplash.com/photo-1574267432644-f02b5ab7e2a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      projects: 3,
      status: 'Active'
    },
    {
      id: '6',
      name: 'Edicius Consumer Products Private Limited',
      slug: 'edicius-consumer-products-private-limited',
      overview: 'Smart consumer goods, personal care, and lifestyle solutions with cutting-edge technology.',
      heroImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      projects: 7,
      status: 'Active'
    },
    {
      id: '7',
      name: 'Edicius Mining and Minerals Private Limited',
      slug: 'edicius-mining-and-minerals-private-limited',
      overview: 'Ethical resource extraction and environmental stewardship with advanced mining technologies.',
      heroImage: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      projects: 5,
      status: 'Active'
    },
    {
      id: '8',
      name: 'Edicius Hotels and Hospitality Private Limited',
      slug: 'edicius-hotels-and-hospitality-private-limited',
      overview: 'Exceptional travel experiences through luxury accommodations and sustainable tourism practices.',
      heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      projects: 2,
      status: 'Active'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Companies Management</h1>
              <p className="text-gray-600">Manage all Edicius Group companies and their details</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Company</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Companies Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300 group">
                <div className="relative">
                  <img
                    src={company.heroImage}
                    alt={company.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant="secondary" 
                      className="bg-white/90 text-gray-900 hover:bg-white"
                    >
                      {company.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="flex items-center space-x-1">
                      <div className="w-1 h-3 bg-red-600"></div>
                      <div className="w-1 h-4 bg-red-600"></div>
                      <div className="w-1 h-5 bg-red-600"></div>
                      <div className="w-1 h-6 bg-black"></div>
                      <div className="w-1 h-7 bg-black"></div>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {company.overview}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{company.projects} projects</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCompanies;