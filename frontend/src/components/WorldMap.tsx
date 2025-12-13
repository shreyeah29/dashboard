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
  x: number; // SVG X position (0-100)
  y: number; // SVG Y position (0-100)
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
    x: 75, // Approximate position on world map
    y: 35,
  },
  {
    id: 'nepal',
    name: 'Edicius Imports and Exports Private Limited',
    address: 'Hetauda Sub-Metropolitan city - 4',
    city: 'Makawanpur, Bagmati Province',
    country: 'Nepal',
    lat: 27.4167,
    lng: 85.0333,
    x: 78,
    y: 28,
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
    x: 48,
    y: 20,
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
          <pattern id="worldMapDots" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="0.8" fill="#9ca3af" opacity="0.4" />
          </pattern>
        </defs>
        
        {/* Background with dot pattern */}
        <rect width="1000" height="500" fill="url(#worldMapDots)" />
        
        {/* More detailed continent shapes */}
        {/* North America */}
        <path
          d="M 120 60 L 180 50 L 220 70 L 240 100 L 250 140 L 240 180 L 220 200 L 180 210 L 140 200 L 110 170 L 100 130 L 105 90 Z"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="0.3"
        />
        
        {/* South America */}
        <path
          d="M 240 180 L 260 200 L 280 240 L 290 280 L 285 320 L 270 350 L 250 360 L 230 350 L 220 320 L 225 280 L 230 240 Z"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="0.3"
        />
        
        {/* Europe */}
        <path
          d="M 480 50 L 520 45 L 540 70 L 550 100 L 545 130 L 530 150 L 510 155 L 490 145 L 475 120 L 470 90 L 475 65 Z"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="0.3"
        />
        
        {/* Africa */}
        <path
          d="M 490 120 L 540 115 L 570 140 L 580 180 L 575 240 L 560 290 L 540 320 L 510 330 L 485 310 L 470 270 L 475 220 L 480 170 Z"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="0.3"
        />
        
        {/* Asia */}
        <path
          d="M 540 30 L 650 25 L 720 50 L 780 80 L 820 120 L 850 180 L 840 240 L 800 280 L 750 300 L 700 290 L 650 270 L 600 240 L 570 200 L 550 150 L 545 100 L 540 60 Z"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="0.3"
        />
        
        {/* Australia */}
        <path
          d="M 750 300 L 820 295 L 850 320 L 860 350 L 850 380 L 820 390 L 790 385 L 760 370 L 745 340 Z"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="0.3"
        />
        
        {/* India (more detailed) */}
        <path
          d="M 680 180 L 720 175 L 740 190 L 745 210 L 740 230 L 720 240 L 695 235 L 675 220 L 670 200 Z"
          fill="none"
          stroke="#d1d5db"
          strokeWidth="0.3"
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
                r={isHovered ? "12" : "8"}
                fill={isHovered ? "#f97316" : "#fb923c"}
                opacity={isHovered ? 0.3 : 0.15}
              />
              
              {/* Pin */}
              <motion.g
                onMouseEnter={() => setHoveredOffice(office.id)}
                onMouseLeave={() => setHoveredOffice(null)}
                onClick={() => setSelectedOffice(selectedOffice === office.id ? null : office.id)}
                style={{ cursor: 'pointer' }}
                animate={{
                  scale: isHovered ? 1.3 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Pin Teardrop Shape (like Tata example) */}
                <path
                  d={`M ${pinX} ${pinY - 8} L ${pinX - 4} ${pinY + 2} L ${pinX + 4} ${pinY + 2} Z`}
                  fill={isHovered ? "#f97316" : "#fb923c"}
                  stroke="white"
                  strokeWidth="2"
                />
                
                {/* Pin Circle */}
                <circle
                  cx={pinX}
                  cy={pinY - 4}
                  r="4"
                  fill={isHovered ? "#f97316" : "#fb923c"}
                  stroke="white"
                  strokeWidth="2"
                />
                
                {/* Pin Center Dot */}
                <circle
                  cx={pinX}
                  cy={pinY - 4}
                  r="2"
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

