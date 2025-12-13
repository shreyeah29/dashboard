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
  lat: number;
  lng: number;
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

  // Convert lat/lng to SVG coordinates (Mercator projection)
  const getPinPosition = (office: OfficeLocation) => {
    const x = ((office.lng + 180) / 360) * 1000;
    const latRad = (office.lat * Math.PI) / 180;
    const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = (500 / 2) - (mercatorY * (500 / (2 * Math.PI)));
    return { x, y };
  };

  return (
    <div className="relative w-full h-[600px] bg-white rounded-lg overflow-hidden border border-gray-200">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Professional World Map - Using smooth, accurate paths */}
        <g fill="none" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round">
          {/* North America */}
          <path d="M 100 50 L 140 45 L 180 55 L 210 75 L 230 105 L 235 145 L 230 185 L 210 215 L 180 235 L 145 240 L 115 230 L 90 200 L 75 160 L 70 120 L 72 80 Z" />
          <path d="M 50 25 L 85 20 L 100 40 L 95 60 L 75 65 L 55 55 Z" />
          <path d="M 230 185 L 245 205 L 250 235 L 245 260 L 230 275 L 210 280 L 195 270 L 185 250 L 190 225 Z" />
          <path d="M 280 15 L 320 12 L 340 25 L 335 50 L 315 60 L 290 55 L 275 40 Z" />
          
          {/* South America */}
          <path d="M 250 200 L 275 220 L 290 260 L 295 300 L 285 340 L 265 370 L 240 380 L 215 375 L 200 350 L 195 320 L 200 280 L 210 240 Z" />
          
          {/* Europe */}
          <path d="M 460 35 L 500 30 L 530 50 L 545 80 L 540 110 L 525 135 L 500 145 L 475 140 L 460 120 L 450 90 L 455 60 Z" />
          <path d="M 520 20 L 560 15 L 580 35 L 575 60 L 550 70 L 525 65 L 510 50 Z" />
          <path d="M 440 50 L 460 48 L 470 65 L 465 80 L 450 82 L 435 75 Z" />
          <path d="M 430 90 L 450 88 L 460 105 L 455 120 L 440 122 L 425 115 Z" />
          <path d="M 500 100 L 510 98 L 515 120 L 510 140 L 500 142 L 490 130 Z" />
          
          {/* Africa */}
          <path d="M 480 105 L 525 100 L 560 125 L 570 165 L 565 225 L 550 275 L 525 315 L 495 325 L 470 305 L 455 265 L 460 215 L 470 165 Z" />
          <path d="M 600 280 L 620 275 L 630 295 L 625 315 L 610 320 L 595 310 Z" />
          
          {/* Asia */}
          <path d="M 530 15 L 640 10 L 710 30 L 770 60 L 810 100 L 840 160 L 835 220 L 795 260 L 745 280 L 695 270 L 645 250 L 600 220 L 565 170 L 550 120 L 545 70 L 540 40 Z" />
          <path d="M 670 165 L 705 160 L 725 175 L 730 195 L 725 215 L 705 225 L 680 220 L 660 205 L 655 185 Z" />
          <path d="M 595 115 L 635 110 L 655 125 L 660 145 L 650 165 L 630 170 L 610 160 L 595 140 Z" />
          <path d="M 600 140 L 640 135 L 660 150 L 655 180 L 635 190 L 615 185 L 600 170 Z" />
          <path d="M 745 195 L 775 190 L 795 205 L 800 225 L 790 245 L 770 250 L 750 240 L 740 220 Z" />
          <path d="M 845 135 L 865 130 L 875 145 L 870 160 L 860 165 L 845 160 Z" />
          <path d="M 820 140 L 835 138 L 840 155 L 835 170 L 820 172 L 810 160 Z" />
          
          {/* Australia */}
          <path d="M 735 280 L 805 275 L 835 300 L 845 330 L 835 360 L 805 370 L 775 365 L 745 350 L 730 320 Z" />
          <path d="M 860 340 L 880 335 L 890 350 L 885 365 L 870 370 L 855 360 Z" />
        </g>

        {/* Office Location Pins */}
        {offices.map((office) => {
          const position = getPinPosition(office);
          const isHovered = hoveredOffice === office.id || selectedOffice === office.id;
          const pinX = position.x;
          const pinY = position.y;
          
          return (
            <g key={office.id}>
              <circle
                cx={pinX}
                cy={pinY}
                r={isHovered ? "18" : "14"}
                fill="#f97316"
                opacity={isHovered ? 0.15 : 0.08}
              />
              
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
                <path
                  d={`M ${pinX} ${pinY - 14} L ${pinX - 7} ${pinY + 5} L ${pinX + 7} ${pinY + 5} Z`}
                  fill={isHovered ? "#f97316" : "#fb923c"}
                  stroke="white"
                  strokeWidth="3"
                />
                <circle
                  cx={pinX}
                  cy={pinY - 7}
                  r="7"
                  fill={isHovered ? "#f97316" : "#fb923c"}
                  stroke="white"
                  strokeWidth="3"
                />
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
          const tooltipXPercent = (position.x / 1000) * 100;
          const tooltipYPercent = (position.y / 500) * 100;
          
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
