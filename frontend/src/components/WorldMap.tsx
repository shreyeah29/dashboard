import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  email?: string;
  phone?: string;
  lat: number; // Latitude
  lng: number; // Longitude
}

const offices: OfficeLocation[] = [
  {
    id: 'hyderabad',
    name: 'Edicius Group',
    address: 'Flat no 406, G B Apartments',
    city: 'Hyderabad, Telangana',
    country: 'India',
    email: 'admin@1edicius.com',
    phone: '+91 8341 029 691',
    lat: 17.3850,
    lng: 78.4867,
  },
  {
    id: 'nepal',
    name: 'Edicius Imports and Exports Private Limited',
    address: 'Prapti Complex, Hetauda Sub-Metropolitan city - 4',
    city: 'Bagmati Province',
    country: 'Nepal',
    lat: 27.4167,
    lng: 85.0333,
  },
  {
    id: 'london',
    name: 'One Edicius Pvt Ltd',
    address: '3rd Floor Suite, 207 Regent Street',
    city: 'London, England',
    country: 'United Kingdom',
    email: 'biz.uk@1edicius.com',
    phone: '+44-7426480105',
    lat: 51.5074,
    lng: -0.1278,
  },
];

const WorldMap = () => {
  const [hoveredOffice, setHoveredOffice] = useState<string | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

  // Convert lat/lng to SVG coordinates (Mercator projection for 1000x500 viewBox)
  const getPinPosition = (office: OfficeLocation) => {
    // Convert longitude to X (0-1000)
    const x = ((office.lng + 180) / 360) * 1000;
    
    // Convert latitude to Y using Mercator projection
    const latRad = (office.lat * Math.PI) / 180;
    const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = (500 / 2) - (mercatorY * (500 / (2 * Math.PI)));
    
    return { x, y };
  };

  return (
    <div className="relative w-full h-[600px] bg-white rounded-lg overflow-hidden border border-gray-200">
      {/* World Map SVG */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Dense dot pattern like Tata example */}
          <pattern id="worldMapDots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.6" fill="#9ca3af" opacity="0.5" />
          </pattern>
        </defs>
        
        {/* Background with dot pattern */}
        <rect width="1000" height="500" fill="url(#worldMapDots)" />
        
        {/* Detailed World Map - Continent Outlines */}
        {/* North America */}
        <path
          d="M 100 50 L 140 45 L 180 55 L 210 75 L 230 105 L 240 145 L 235 185 L 220 215 L 195 230 L 165 235 L 135 225 L 110 200 L 95 160 L 90 120 L 92 80 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="0.5"
          opacity="0.8"
        />
        <path
          d="M 240 185 L 250 200 L 255 230 L 250 260 L 240 285 L 225 300 L 205 305 L 185 295 L 170 275 L 175 245 L 185 220 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="0.5"
          opacity="0.8"
        />
        
        {/* South America */}
        <path
          d="M 250 200 L 270 220 L 285 260 L 290 300 L 280 340 L 260 365 L 235 370 L 215 355 L 205 330 L 210 290 L 220 250 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="0.5"
          opacity="0.8"
        />
        
        {/* Europe */}
        <path
          d="M 470 40 L 510 35 L 535 55 L 545 85 L 540 115 L 525 140 L 505 150 L 485 145 L 470 125 L 465 95 L 468 65 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="0.5"
          opacity="0.8"
        />
        
        {/* Africa */}
        <path
          d="M 485 110 L 530 105 L 565 130 L 575 170 L 570 230 L 555 280 L 530 320 L 500 330 L 475 310 L 460 270 L 465 220 L 475 170 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="0.5"
          opacity="0.8"
        />
        
        {/* Asia - Mainland */}
        <path
          d="M 535 20 L 640 15 L 710 35 L 770 65 L 810 105 L 840 165 L 835 225 L 795 265 L 745 285 L 695 275 L 645 255 L 600 225 L 565 175 L 550 125 L 545 75 L 540 45 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="0.5"
          opacity="0.8"
        />
        
        {/* India - More detailed shape */}
        <path
          d="M 675 170 L 710 165 L 730 180 L 735 200 L 730 220 L 710 230 L 685 225 L 665 210 L 660 190 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="0.5"
          opacity="0.8"
        />
        
        {/* Middle East */}
        <path
          d="M 600 120 L 640 115 L 660 130 L 665 150 L 655 170 L 635 175 L 615 165 L 600 145 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="0.5"
          opacity="0.8"
        />
        
        {/* Australia */}
        <path
          d="M 740 285 L 810 280 L 840 305 L 850 335 L 840 365 L 810 375 L 780 370 L 750 355 L 735 325 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="0.5"
          opacity="0.8"
        />
        
        {/* Japan */}
        <path
          d="M 850 140 L 870 135 L 880 150 L 875 165 L 865 170 L 850 165 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="0.5"
          opacity="0.8"
        />
        
        {/* Southeast Asia */}
        <path
          d="M 750 200 L 780 195 L 800 210 L 805 230 L 795 250 L 775 255 L 755 245 L 745 225 Z"
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth="0.5"
          opacity="0.8"
        />

        {/* Office Location Pins */}
        {offices.map((office) => {
          const position = getPinPosition(office);
          const isHovered = hoveredOffice === office.id || selectedOffice === office.id;
          const pinX = position.x;
          const pinY = position.y;
          
          return (
            <g key={office.id}>
              {/* Pin Shadow/Glow */}
              <circle
                cx={pinX}
                cy={pinY}
                r={isHovered ? "14" : "10"}
                fill="#f97316"
                opacity={isHovered ? 0.25 : 0.12}
              />
              
              {/* Pin */}
              <motion.g
                onMouseEnter={() => setHoveredOffice(office.id)}
                onMouseLeave={() => setHoveredOffice(null)}
                onClick={() => setSelectedOffice(selectedOffice === office.id ? null : office.id)}
                style={{ cursor: 'pointer' }}
                animate={{
                  scale: isHovered ? 1.4 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Pin Teardrop Shape (like Tata example) */}
                <path
                  d={`M ${pinX} ${pinY - 10} L ${pinX - 5} ${pinY + 3} L ${pinX + 5} ${pinY + 3} Z`}
                  fill={isHovered ? "#f97316" : "#fb923c"}
                  stroke="white"
                  strokeWidth="2.5"
                />
                
                {/* Pin Circle */}
                <circle
                  cx={pinX}
                  cy={pinY - 5}
                  r="5"
                  fill={isHovered ? "#f97316" : "#fb923c"}
                  stroke="white"
                  strokeWidth="2.5"
                />
                
                {/* Pin Center Dot */}
                <circle
                  cx={pinX}
                  cy={pinY - 5}
                  r="2.5"
                  fill="white"
                />
              </motion.g>
            </g>
          );
        })}
      </svg>

      {/* Office Info Tooltips */}
      <AnimatePresence>
        {(hoveredOffice || selectedOffice) && (() => {
          const office = offices.find(o => o.id === (hoveredOffice || selectedOffice));
          if (!office) return null;
          
          const position = getPinPosition(office);
          // Calculate tooltip position relative to viewport (position is in SVG coordinates 0-1000)
          const tooltipXPercent = (position.x / 1000) * 100;
          const tooltipYPercent = (position.y / 500) * 100;
          
          // Position tooltip to the right if pin is on left side, left if on right side
          const tooltipLeft = tooltipXPercent < 50 ? `${tooltipXPercent + 2}%` : 'auto';
          const tooltipRight = tooltipXPercent >= 50 ? `${100 - tooltipXPercent + 2}%` : 'auto';
          const tooltipTop = `${Math.max(10, Math.min(90, tooltipYPercent - 15))}%`;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bg-white rounded-lg shadow-2xl p-6 min-w-[280px] max-w-[320px] border border-gray-200 z-10"
              style={{
                left: tooltipLeft,
                right: tooltipRight,
                top: tooltipTop,
                transform: 'translateY(-50%)',
              }}
              onMouseEnter={() => setHoveredOffice(office.id)}
              onMouseLeave={() => setHoveredOffice(null)}
            >
              <h3 className="font-bold text-lg text-edicius-navy mb-3">{office.name}</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-medium">{office.address}</p>
                <p>{office.city}</p>
                <p className="text-gray-600">{office.country}</p>
                {office.email && (
                  <p className="mt-3">
                    <span className="font-medium">Email: </span>
                    <a href={`mailto:${office.email}`} className="text-edicius-red hover:underline">
                      {office.email}
                    </a>
                  </p>
                )}
                {office.phone && (
                  <p>
                    <span className="font-medium">Phone: </span>
                    <a href={`tel:${office.phone}`} className="text-edicius-red hover:underline">
                      {office.phone}
                    </a>
                  </p>
                )}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default WorldMap;
