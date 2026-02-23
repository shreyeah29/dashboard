import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Menu, X, HeartHandshake, Globe2 } from 'lucide-react';
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
            <div className="flex items-center gap-4">
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

              {/* One Edicius UK icon (desktop) */}
              <Link
                to="/one-edicius-uk"
                className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/20 hover:bg-sky-500/20 hover:border-sky-300 transition-colors"
                title="One Edicius UK"
              >
                <Globe2 className="w-4 h-4 text-sky-300" />
              </Link>

              {/* Edicius Foundation icon (desktop) */}
              <Link
                to="/foundation"
                className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/20 hover:bg-pink-500/20 hover:border-pink-300 transition-colors"
                title="Edicius Foundation"
              >
                <HeartHandshake className="w-4 h-4 text-pink-300" />
              </Link>

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
              <Link
                to="/one-edicius-uk"
                className="flex items-center gap-2 text-white hover:text-edicius-red transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Globe2 className="w-4 h-4" />
                <span>One Edicius UK</span>
              </Link>
              <Link
                to="/foundation"
                className="flex items-center gap-2 text-white hover:text-edicius-red transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Edicius Foundation</span>
              </Link>
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
