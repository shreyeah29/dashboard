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

// Color mapping based on coordinates and country names
const getContinentColor = (geo: any): string => {
  // Get all possible name variations
  const name = (geo.properties?.NAME || geo.properties?.NAME_LONG || geo.properties?.NAME_EN || '').toLowerCase();
  
  // North America - Light green (#4ade80)
  if (name.includes('united states') || name.includes('canada') || name.includes('mexico') || 
      name.includes('greenland') || name.includes('cuba') || name.includes('jamaica') ||
      name.includes('haiti') || name.includes('dominican') || name.includes('guatemala') ||
      name.includes('honduras') || name.includes('el salvador') || name.includes('nicaragua') ||
      name.includes('costa rica') || name.includes('panama') || name.includes('bahamas') ||
      name.includes('belize') || name.includes('barbados') || name.includes('trinidad')) {
    return '#4ade80';
  }
  
  // South America - Dark green (#16a34a)
  if (name.includes('brazil') || name.includes('argentina') || name.includes('chile') ||
      name.includes('peru') || name.includes('colombia') || name.includes('venezuela') ||
      name.includes('ecuador') || name.includes('bolivia') || name.includes('paraguay') ||
      name.includes('uruguay') || name.includes('guyana') || name.includes('suriname')) {
    return '#16a34a';
  }
  
  // Europe - Light blue (#60a5fa)
  if (name.includes('united kingdom') || name.includes('france') || name.includes('germany') ||
      name.includes('italy') || name.includes('spain') || name.includes('poland') ||
      name.includes('netherlands') || name.includes('belgium') || name.includes('greece') ||
      name.includes('portugal') || name.includes('sweden') || name.includes('norway') ||
      name.includes('denmark') || name.includes('finland') || name.includes('ireland') ||
      name.includes('switzerland') || name.includes('austria') || name.includes('czech') ||
      name.includes('romania') || name.includes('hungary') || name.includes('bulgaria') ||
      name.includes('croatia') || name.includes('serbia') || name.includes('slovakia') ||
      name.includes('slovenia') || name.includes('lithuania') || name.includes('latvia') ||
      name.includes('estonia') || name.includes('luxembourg') || name.includes('malta') ||
      name.includes('cyprus') || name.includes('iceland') || name.includes('russia') ||
      name.includes('ukraine') || name.includes('belarus') || name.includes('moldova')) {
    return '#60a5fa';
  }
  
  // Africa - Light orange (#fb923c)
  if (name.includes('south africa') || name.includes('egypt') || name.includes('nigeria') ||
      name.includes('kenya') || name.includes('ethiopia') || name.includes('ghana') ||
      name.includes('tanzania') || name.includes('uganda') || name.includes('morocco') ||
      name.includes('algeria') || name.includes('sudan') || name.includes('angola') ||
      name.includes('mozambique') || name.includes('madagascar') || name.includes('cameroon') ||
      name.includes('niger') || name.includes('mali') || name.includes('zambia') ||
      name.includes('senegal') || name.includes('chad') || name.includes('somalia') ||
      name.includes('zimbabwe') || name.includes('guinea') || name.includes('rwanda') ||
      name.includes('benin') || name.includes('burundi') || name.includes('tunisia') ||
      name.includes('togo') || name.includes('libya') || name.includes('liberia') ||
      name.includes('mauritania') || name.includes('eritrea') || name.includes('botswana') ||
      name.includes('namibia') || name.includes('gabon') || name.includes('lesotho') ||
      name.includes('mauritius') || name.includes('djibouti') || name.includes('comoros')) {
    return '#fb923c';
  }
  
  // Asia - Orange (#f97316)
  if (name.includes('china') || name.includes('india') || name.includes('japan') ||
      name.includes('korea') || name.includes('thailand') || name.includes('vietnam') ||
      name.includes('indonesia') || name.includes('malaysia') || name.includes('philippines') ||
      name.includes('singapore') || name.includes('myanmar') || name.includes('cambodia') ||
      name.includes('laos') || name.includes('bangladesh') || name.includes('pakistan') ||
      name.includes('afghanistan') || name.includes('iran') || name.includes('iraq') ||
      name.includes('saudi arabia') || name.includes('turkey') || name.includes('israel') ||
      name.includes('jordan') || name.includes('lebanon') || name.includes('syria') ||
      name.includes('yemen') || name.includes('oman') || name.includes('uae') ||
      name.includes('kuwait') || name.includes('qatar') || name.includes('bahrain') ||
      name.includes('kazakhstan') || name.includes('uzbekistan') || name.includes('mongolia') ||
      name.includes('nepal') || name.includes('bhutan') || name.includes('sri lanka') ||
      name.includes('maldives') || name.includes('taiwan') || name.includes('hong kong') ||
      name.includes('macau') || name.includes('brunei') || name.includes('azerbaijan') ||
      name.includes('armenia') || name.includes('georgia')) {
    return '#f97316';
  }
  
  // Oceania/Australia - Red (#ef4444)
  if (name.includes('australia') || name.includes('new zealand') || name.includes('papua') ||
      name.includes('fiji') || name.includes('samoa') || name.includes('tonga') ||
      name.includes('vanuatu') || name.includes('solomon') || name.includes('micronesia') ||
      name.includes('palau') || name.includes('marshall') || name.includes('kiribati')) {
    return '#ef4444';
  }
  
  // Default gray for unknown
  return '#e5e7eb';
};

const WorldMap = () => {
  const [hoveredOffice, setHoveredOffice] = useState<string | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

  return (
    <div className="relative w-full bg-white rounded-lg overflow-hidden border border-gray-200" style={{ height: '450px', padding: '0' }}>
      <ComposableMap
        projectionConfig={{
          scale: 200,
          center: [0, 20],
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const fillColor = getContinentColor(geo);
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#ffffff"
                  strokeWidth={0.4}
                  style={{
                    default: { 
                      outline: 'none',
                    },
                    hover: { 
                      outline: 'none',
                      opacity: 0.9,
                    },
                    pressed: { 
                      outline: 'none',
                    },
                  }}
                />
              );
            })
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
