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
    address: 'Flat no 105, Lake Melody Apartments, Raj Bhavan Road, Behind Park Hotel, Somajiguda Pincode: 500082',
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
    id: 'nepal-flyaway',
    name: 'Flyaway Consultancy Unit Of Edicius Enterprises Pvt Ltd',
    address: 'Prapti Complex, Second Floor, Hetauda Sub-Metropolitan city - 4',
    city: 'Bagmati Province',
    country: 'Nepal',
    email: 'askflyaway@1edicius.com',
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
  {
    id: 'cochin',
    name: 'Edicius Nursing and Health Care Staffing Consultant (ENHSC)',
    address: 'Anjiparambil Business Center, Door No. 63/2502B (Second Floor) Manorama Junction',
    city: 'Cochin, Kerala',
    country: 'India',
    email: 'admin@1edicius.com',
    phone: '+91 8341 029 691',
    coordinates: [76.2673, 9.9312],
  },
];

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Get color based on coordinates and country name - more reliable approach
const getContinentColor = (geo: any): string => {
  // Get country name from any available property
  const name = String(geo.properties?.NAME || geo.properties?.NAME_LONG || geo.properties?.NAME_EN || geo.properties?.name || '').toLowerCase();
  
  // Get coordinates center for fallback
  const coordinates = geo.coordinates || geo.geometry?.coordinates;
  
  // North America - Light green (#4ade80)
  if (name.includes('united states') || name.includes('usa') || name.includes('canada') || 
      name.includes('mexico') || name.includes('greenland') || name.includes('cuba') || 
      name.includes('jamaica') || name.includes('haiti') || name.includes('dominican') ||
      name.includes('guatemala') || name.includes('honduras') || name.includes('salvador') ||
      name.includes('nicaragua') || name.includes('costa rica') || name.includes('panama') ||
      name.includes('bahamas') || name.includes('belize') || name.includes('barbados') ||
      name.includes('trinidad') || name.includes('grenada') || name.includes('saint')) {
    return '#4ade80';
  }
  
  // South America - Dark green (#16a34a)
  if (name.includes('brazil') || name.includes('argentina') || name.includes('chile') ||
      name.includes('peru') || name.includes('colombia') || name.includes('venezuela') ||
      name.includes('ecuador') || name.includes('bolivia') || name.includes('paraguay') ||
      name.includes('uruguay') || name.includes('guyana') || name.includes('suriname') ||
      name.includes('french guiana')) {
    return '#16a34a';
  }
  
  // Europe - Light blue (#60a5fa)
  if (name.includes('united kingdom') || name.includes('uk') || name.includes('france') ||
      name.includes('germany') || name.includes('italy') || name.includes('spain') ||
      name.includes('poland') || name.includes('netherlands') || name.includes('belgium') ||
      name.includes('greece') || name.includes('portugal') || name.includes('sweden') ||
      name.includes('norway') || name.includes('denmark') || name.includes('finland') ||
      name.includes('ireland') || name.includes('switzerland') || name.includes('austria') ||
      name.includes('czech') || name.includes('romania') || name.includes('hungary') ||
      name.includes('bulgaria') || name.includes('croatia') || name.includes('serbia') ||
      name.includes('slovakia') || name.includes('slovenia') || name.includes('lithuania') ||
      name.includes('latvia') || name.includes('estonia') || name.includes('luxembourg') ||
      name.includes('malta') || name.includes('cyprus') || name.includes('iceland') ||
      name.includes('russia') || name.includes('ukraine') || name.includes('belarus') ||
      name.includes('moldova') || name.includes('albania') || name.includes('bosnia') ||
      name.includes('macedonia') || name.includes('montenegro')) {
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
      name.includes('mauritius') || name.includes('djibouti') || name.includes('comoros') ||
      name.includes('cape verde') || name.includes('sao tome')) {
    return '#fb923c';
  }
  
  // Asia - Orange (#f97316)
  if (name.includes('china') || name.includes('india') || name.includes('japan') ||
      name.includes('korea') || name.includes('thailand') || name.includes('vietnam') ||
      name.includes('indonesia') || name.includes('malaysia') || name.includes('philippines') ||
      name.includes('singapore') || name.includes('myanmar') || name.includes('cambodia') ||
      name.includes('laos') || name.includes('bangladesh') || name.includes('pakistan') ||
      name.includes('afghanistan') || name.includes('iran') || name.includes('iraq') ||
      name.includes('saudi') || name.includes('turkey') || name.includes('israel') ||
      name.includes('jordan') || name.includes('lebanon') || name.includes('syria') ||
      name.includes('yemen') || name.includes('oman') || name.includes('uae') ||
      name.includes('emirates') || name.includes('kuwait') || name.includes('qatar') ||
      name.includes('bahrain') || name.includes('kazakhstan') || name.includes('uzbekistan') ||
      name.includes('mongolia') || name.includes('nepal') || name.includes('bhutan') ||
      name.includes('sri lanka') || name.includes('maldives') || name.includes('taiwan') ||
      name.includes('hong kong') || name.includes('macau') || name.includes('brunei') ||
      name.includes('azerbaijan') || name.includes('armenia') || name.includes('georgia') ||
      name.includes('kyrgyzstan') || name.includes('tajikistan') || name.includes('turkmenistan')) {
    return '#f97316';
  }
  
  // Oceania/Australia - Red (#ef4444)
  if (name.includes('australia') || name.includes('new zealand') || name.includes('papua') ||
      name.includes('fiji') || name.includes('samoa') || name.includes('tonga') ||
      name.includes('vanuatu') || name.includes('solomon') || name.includes('micronesia') ||
      name.includes('palau') || name.includes('marshall') || name.includes('kiribati') ||
      name.includes('nauru') || name.includes('tuvalu')) {
    return '#ef4444';
  }
  
  // Antarctica - Light orange
  if (name.includes('antarctica')) {
    return '#fed7aa';
  }
  
  // Default - Light orange for any unclassified areas
  return '#fed7aa';
};

const WorldMap = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Group offices by coordinates to handle multiple offices at same location
  const locationGroups = offices.reduce((acc, office) => {
    const key = `${office.coordinates[0]},${office.coordinates[1]}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(office);
    return acc;
  }, {} as Record<string, OfficeLocation[]>);

  // Get unique locations for markers
  const uniqueLocations = Object.entries(locationGroups).map(([key, offices]) => ({
    coordinates: offices[0].coordinates,
    key,
    offices,
  }));

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
            geographies.map((geo) => {
              const fillColor = getContinentColor(geo);
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#ffffff"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: 'none',
                      fill: fillColor,
                    },
                    hover: {
                      outline: 'none',
                      fill: fillColor,
                      opacity: 0.9,
                    },
                    pressed: {
                      outline: 'none',
                      fill: fillColor,
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
        
        {uniqueLocations.map((location) => {
          const isHovered = hoveredLocation === location.key || selectedLocation === location.key;
          
          return (
            <Marker key={location.key} coordinates={location.coordinates}>
              <motion.g
                onMouseEnter={() => setHoveredLocation(location.key)}
                onMouseLeave={() => setHoveredLocation(null)}
                onClick={() => setSelectedLocation(selectedLocation === location.key ? null : location.key)}
                style={{ cursor: 'pointer' }}
                animate={{
                  scale: isHovered ? 1.5 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Background circle for hover effect */}
                <circle
                  r={isHovered ? "20" : "18"}
                  fill="#000000"
                  opacity={isHovered ? 0.12 : 0.08}
                />
                {/* White teardrop pin shape */}
                <path
                  d="M 0 -13 C -6.5 -13, -9 -6.5, -9 0 C -9 4, -4.5 8.5, 0 13 C 4.5 8.5, 9 4, 9 0 C 9 -6.5, 6.5 -13, 0 -13 Z"
                  fill="#FFFFFF"
                  stroke="#E5E5E5"
                  strokeWidth="0.5"
                />
                {/* Red capital letter E - clean sans-serif */}
                <text
                  x="0"
                  y="2.5"
                  fill="#DC2626"
                  fontSize="13"
                  fontFamily="Arial, sans-serif"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  E
                </text>
              </motion.g>
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Office Info Tooltips */}
      <AnimatePresence>
        {(hoveredLocation || selectedLocation) && (() => {
          const locationKey = hoveredLocation || selectedLocation;
          const locationOffices = locationGroups[locationKey!];
          if (!locationOffices || locationOffices.length === 0) return null;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute bg-white rounded-lg shadow-2xl p-6 border border-gray-200 z-10 ${
                locationOffices.length > 1 
                  ? 'min-w-[640px] max-w-[800px]' 
                  : 'min-w-[320px] max-w-[400px]'
              }`}
              style={{
                left: '50%',
                top: '20%',
                transform: 'translateX(-50%)',
              }}
              onMouseEnter={() => setHoveredLocation(locationKey!)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              <div className={locationOffices.length > 1 ? 'grid grid-cols-2 gap-6' : ''}>
                {locationOffices.map((office, index) => (
                  <div key={office.id} className={locationOffices.length > 1 ? 'border-r border-gray-200 pr-6 last:border-r-0 last:pr-0' : ''}>
              <h3 className="font-bold text-lg text-edicius-navy mb-3">{office.name}</h3>
              <div className="space-y-2 text-sm text-gray-700">
                      {office.id === 'hyderabad' && (
                        <p className="font-semibold text-edicius-navy mb-1">Corporate Address</p>
                      )}
                      {office.id === 'cochin' && (
                        <p className="font-semibold text-edicius-navy mb-1">Head Office</p>
                      )}
                      {(office.id === 'nepal' || office.id === 'nepal-flyaway') && (
                        <p className="font-semibold text-edicius-navy mb-1">Branch Office</p>
                      )}
                      {office.id === 'london' && (
                        <p className="font-semibold text-edicius-navy mb-1">Registered Address</p>
                      )}
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
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default WorldMap;
