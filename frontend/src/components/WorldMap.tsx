import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  email?: string;
  phone?: string;
  coordinates: [number, number];
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
    coordinates: [78.4867, 17.3850],
  },
  {
    id: 'nepal',
    name: 'Edicius Imports and Exports Private Limited',
    address: 'Prapti Complex, Hetauda Sub-Metropolitan city - 4',
    city: 'Bagmati Province',
    country: 'Nepal',
    email: 'admin@1edicius.com',
    phone: '+91 8341 029 691',
    coordinates: [85.0333, 27.4167],
  },
  {
    id: 'london',
    name: 'One Edicius Pvt Ltd',
    address: '3rd Floor Suite, 207 Regent Street',
    city: 'London, England',
    country: 'United Kingdom',
    email: 'biz.uk@1edicius.com',
    phone: '+44-7426480105',
    coordinates: [-0.1278, 51.5074],
  },
];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = () => {
  const [hoveredOffice, setHoveredOffice] = useState<string | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

  return (
    <div className="relative w-full h-[600px] bg-white rounded-lg overflow-hidden border border-gray-200">
      <ComposableMap
        projectionConfig={{
          scale: 200,
          center: [0, 20],
        }}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="none"
                stroke="#000000"
                strokeWidth={1.2}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        
        {offices.map((office) => {
          const isHovered = hoveredOffice === office.id || selectedOffice === office.id;
          
          return (
            <Marker key={office.id} coordinates={office.coordinates}>
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
                <circle
                  r={isHovered ? "18" : "14"}
                  fill="#f97316"
                  opacity={isHovered ? 0.15 : 0.08}
                />
                <path
                  d={`M 0 -14 L -7 5 L 7 5 Z`}
                  fill={isHovered ? "#f97316" : "#fb923c"}
                  stroke="white"
                  strokeWidth="3"
                />
                <circle
                  r="7"
                  cy="-7"
                  fill={isHovered ? "#f97316" : "#fb923c"}
                  stroke="white"
                  strokeWidth="3"
                />
                <circle
                  r="3.5"
                  cy="-7"
                  fill="white"
                />
              </motion.g>
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Office Info Tooltips */}
      <AnimatePresence>
        {(hoveredOffice || selectedOffice) && (() => {
          const office = offices.find(o => o.id === (hoveredOffice || selectedOffice));
          if (!office) return null;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bg-white rounded-lg shadow-2xl p-6 min-w-[280px] max-w-[320px] border border-gray-200 z-10"
              style={{
                left: '50%',
                top: '20%',
                transform: 'translateX(-50%)',
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
