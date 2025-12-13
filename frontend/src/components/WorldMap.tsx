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
    email: 'admin@1edicius.com',
    phone: '+91 8341 029 691',
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
      {/* World Map SVG - Clean Professional Outline */}
      <svg
        viewBox="0 0 1000 461"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Clean World Map - Black outlines only, no fills */}
        <g fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {/* North America */}
          <path d="M 89.5 49.5 L 120.5 45.5 L 160.5 55.5 L 195.5 75.5 L 220.5 105.5 L 235.5 145.5 L 230.5 185.5 L 210.5 215.5 L 180.5 235.5 L 145.5 240.5 L 115.5 230.5 L 90.5 200.5 L 75.5 160.5 L 70.5 120.5 L 72.5 80.5 Z" />
          <path d="M 50.5 25.5 L 85.5 20.5 L 100.5 40.5 L 95.5 60.5 L 75.5 65.5 L 55.5 55.5 Z" />
          <path d="M 230.5 185.5 L 245.5 205.5 L 250.5 235.5 L 245.5 260.5 L 230.5 275.5 L 210.5 280.5 L 195.5 270.5 L 185.5 250.5 L 190.5 225.5 Z" />
          <path d="M 280.5 15.5 L 320.5 12.5 L 340.5 25.5 L 335.5 50.5 L 315.5 60.5 L 290.5 55.5 L 275.5 40.5 Z" />
          
          {/* South America */}
          <path d="M 250.5 200.5 L 275.5 220.5 L 290.5 260.5 L 295.5 300.5 L 285.5 340.5 L 265.5 370.5 L 240.5 380.5 L 215.5 375.5 L 200.5 350.5 L 195.5 320.5 L 200.5 280.5 L 210.5 240.5 Z" />
          
          {/* Europe */}
          <path d="M 460.5 35.5 L 500.5 30.5 L 530.5 50.5 L 545.5 80.5 L 540.5 110.5 L 525.5 135.5 L 500.5 145.5 L 475.5 140.5 L 460.5 120.5 L 450.5 90.5 L 455.5 60.5 Z" />
          <path d="M 520.5 20.5 L 560.5 15.5 L 580.5 35.5 L 575.5 60.5 L 550.5 70.5 L 525.5 65.5 L 510.5 50.5 Z" />
          <path d="M 440.5 50.5 L 460.5 48.5 L 470.5 65.5 L 465.5 80.5 L 450.5 82.5 L 435.5 75.5 Z" />
          <path d="M 430.5 90.5 L 450.5 88.5 L 460.5 105.5 L 455.5 120.5 L 440.5 122.5 L 425.5 115.5 Z" />
          <path d="M 500.5 100.5 L 510.5 98.5 L 515.5 120.5 L 510.5 140.5 L 500.5 142.5 L 490.5 130.5 Z" />
          
          {/* Africa */}
          <path d="M 480.5 105.5 L 525.5 100.5 L 560.5 125.5 L 570.5 165.5 L 565.5 225.5 L 550.5 275.5 L 525.5 315.5 L 495.5 325.5 L 470.5 305.5 L 455.5 265.5 L 460.5 215.5 L 470.5 165.5 Z" />
          <path d="M 600.5 280.5 L 620.5 275.5 L 630.5 295.5 L 625.5 315.5 L 610.5 320.5 L 595.5 310.5 Z" />
          
          {/* Asia */}
          <path d="M 530.5 15.5 L 640.5 10.5 L 710.5 30.5 L 770.5 60.5 L 810.5 100.5 L 840.5 160.5 L 835.5 220.5 L 795.5 260.5 L 745.5 280.5 L 695.5 270.5 L 645.5 250.5 L 600.5 220.5 L 565.5 170.5 L 550.5 120.5 L 545.5 70.5 L 540.5 40.5 Z" />
          <path d="M 670.5 165.5 L 705.5 160.5 L 725.5 175.5 L 730.5 195.5 L 725.5 215.5 L 705.5 225.5 L 680.5 220.5 L 660.5 205.5 L 655.5 185.5 Z" />
          <path d="M 595.5 115.5 L 635.5 110.5 L 655.5 125.5 L 660.5 145.5 L 650.5 165.5 L 630.5 170.5 L 610.5 160.5 L 595.5 140.5 Z" />
          <path d="M 600.5 140.5 L 640.5 135.5 L 660.5 150.5 L 655.5 180.5 L 635.5 190.5 L 615.5 185.5 L 600.5 170.5 Z" />
          <path d="M 745.5 195.5 L 775.5 190.5 L 795.5 205.5 L 800.5 225.5 L 790.5 245.5 L 770.5 250.5 L 750.5 240.5 L 740.5 220.5 Z" />
          <path d="M 845.5 135.5 L 865.5 130.5 L 875.5 145.5 L 870.5 160.5 L 860.5 165.5 L 845.5 160.5 Z" />
          <path d="M 820.5 140.5 L 835.5 138.5 L 840.5 155.5 L 835.5 170.5 L 820.5 172.5 L 810.5 160.5 Z" />
          
          {/* Australia */}
          <path d="M 735.5 280.5 L 805.5 275.5 L 835.5 300.5 L 845.5 330.5 L 835.5 360.5 L 805.5 370.5 L 775.5 365.5 L 745.5 350.5 L 730.5 320.5 Z" />
          <path d="M 860.5 340.5 L 880.5 335.5 L 890.5 350.5 L 885.5 365.5 L 870.5 370.5 L 855.5 360.5 Z" />
        </g>

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
                r={isHovered ? "18" : "14"}
                fill="#f97316"
                opacity={isHovered ? 0.15 : 0.08}
              />
              
              {/* Pin */}
              <motion.g
                onMouseEnter={() => setHoveredOffice(office.id)}
                onMouseLeave={() => setHoveredOffice(null)}
                onClick={() => setSelectedOffice(selectedOffice === office.id ? null : office.id)}
                style={{ cursor: 'pointer' }}
                animate={{
                  scale: isHovered ? 1.5 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Pin Teardrop Shape */}
                <path
                  d={`M ${pinX} ${pinY - 14} L ${pinX - 7} ${pinY + 5} L ${pinX + 7} ${pinY + 5} Z`}
                  fill={isHovered ? "#f97316" : "#fb923c"}
                  stroke="white"
                  strokeWidth="3"
                />
                
                {/* Pin Circle */}
                <circle
                  cx={pinX}
                  cy={pinY - 7}
                  r="7"
                  fill={isHovered ? "#f97316" : "#fb923c"}
                  stroke="white"
                  strokeWidth="3"
                />
                
                {/* Pin Center Dot */}
                <circle
                  cx={pinX}
                  cy={pinY - 7}
                  r="3.5"
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
          const tooltipYPercent = (position.y / 461) * 100;
          
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
