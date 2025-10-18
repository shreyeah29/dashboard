import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-edicius-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-edicius-gold to-yellow-400 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-edicius-navy" />
              </div>
              <span className="text-xl font-bold">Edicius Group</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Innovating across industries with cutting-edge solutions, sustainable practices, 
              and transformative technologies that shape the future.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>Hyderabad, India</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>info@ediciusgroup.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+91 40 1234 5678</span>
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
                <Link to="/about" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  About Us
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
                <Link to="/company/edicius-consumer-products" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Consumer Products
                </Link>
              </li>
              <li>
                <Link to="/company/edicius-infrastructure-and-developers" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Infrastructure
                </Link>
              </li>
              <li>
                <Link to="/company/edicius-innovations-and-consulting" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Innovations
                </Link>
              </li>
              <li>
                <Link to="/company/edicius-productions-and-entertainment" className="text-gray-300 hover:text-edicius-gold transition-colors duration-200">
                  Entertainment
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
