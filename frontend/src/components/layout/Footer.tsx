import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '@/components/Logo';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Logo width={120} height={40} />
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Where power of Consulting meets Precision. With over five years of relentless R&D and dedication, 
              we have been shaping solutions based on industry and market standards.
            </p>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-gray-300">
                <MapPin className="w-4 h-4 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-white mb-1">Registered Address</p>
                  <p>Flat no 105, Lake Melody Apartments,</p>
                  <p>Raj Bhavan Road, Behind Park Hotel, Somajiguda,</p>
                  <p>Hyderabad 500082, Telangana</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>admin@1edicius.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+91 8341 029 691</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Companies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Companies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/company/edicius-enterprises" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Enterprises
                </Link>
              </li>
              <li>
                <Link to="/company/edicius-imports-and-exports" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Imports & Exports
                </Link>
              </li>
              <li>
                <Link to="/company/edicius-innovations-and-consulting" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Innovations
                </Link>
              </li>
              <li>
                <Link to="/company/edicius-infrastructure-and-developers" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Infrastructure
                </Link>
              </li>
              <li>
                <Link to="/company/edicius-productions-and-entertainment" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Productions & Entertainment
                </Link>
              </li>
              <li>
                <Link to="/company/edicius-consumer-products" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Consumer Products
                </Link>
              </li>
              <li>
                <Link to="/company/edicius-hotels-and-hospitality" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Hotels & Hospitality
                </Link>
              </li>
              <li>
                <Link to="/company/edicius-mining-and-minerals" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Mining & Minerals
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Edicius Group. All rights reserved. | Innovating Across Industries.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
