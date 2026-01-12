import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import HiddenAdminTrigger from '@/components/admin/HiddenAdminTrigger';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Business', href: '/companies' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <motion.header 
        className="bg-gradient-to-br from-black via-gray-800 to-black shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center" style={{ marginLeft: 0 }}>
              <span className="text-white text-xl font-bold tracking-wide">EDICIUS GROUP OF COMPANIES</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-white hover:text-edicius-red transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-edicius-red transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-white hover:text-edicius-red transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            </motion.div>
          )}
        </div>
      </motion.header>
      
      {/* Hidden Admin Trigger */}
      <HiddenAdminTrigger />
    </>
  );
};

export default Header;
