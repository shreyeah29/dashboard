// import React from 'react';

// interface LogoProps {
//   className?: string;
//   width?: number;
//   height?: number;
// }

// const Logo: React.FC<LogoProps> = ({ className = '', width = 120, height = 40 }) => {
//   // Always use CSS-based logo for perfect control and consistency
//   return (
//     <div className={`flex flex-col items-center justify-center ${className}`} style={{ width, height }}>
//       {/* 5 bars - 3 red, 2 black with precise measurements */}
//       <div className="flex items-end space-x-1.5 mb-2">
//         <div className="w-2.5 h-4 bg-red-600 rounded-sm"></div>
//         <div className="w-2.5 h-5 bg-red-600 rounded-sm"></div>
//         <div className="w-2.5 h-6 bg-red-600 rounded-sm"></div>
//         <div className="w-2.5 h-7 bg-black rounded-sm"></div>
//         <div className="w-2.5 h-8 bg-black rounded-sm"></div>
//       </div>
//       {/* EDICIUS text */}
//       <div className="text-red-600 font-bold text-sm tracking-wider">EDICIUS</div>
//     </div>
//   );
// };

// export default Logo;


import React from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({
  className = "",
  width = 200,
  height = 80,
}) => {
  // Calculate text size based on logo size
  const textSize = width > 1000 ? 'text-4xl md:text-5xl lg:text-6xl' : 
                   width > 500 ? 'text-2xl md:text-3xl lg:text-4xl' :
                   width > 200 ? 'text-lg md:text-xl lg:text-2xl' :
                   'text-sm md:text-base';
  
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      style={{ width, height }}
    >
      {/* SVG Bars - 3 red, 2 black */}
      <svg
        width={width * 0.7}
        height={height * 0.6}
        viewBox="0 0 100 70"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-3"
        style={{ display: 'block' }}
      >
        {/* Red Bars */}
        <rect x="5" y="50" width="10" height="15" fill="#D32F2F" rx="1" />
        <rect x="20" y="40" width="10" height="25" fill="#E53935" rx="1" />
        <rect x="35" y="30" width="10" height="35" fill="#C62828" rx="1" />

        {/* Black Bars - 2 bars */}
        <rect x="50" y="20" width="10" height="45" fill="#000000" rx="1" />
        <rect x="65" y="10" width="10" height="55" fill="#000000" rx="1" />
      </svg>

      {/* EDICIUS Text - perfectly aligned with logo bars */}
      <div 
        className={`text-white font-bold ${textSize}`} 
        style={{ 
          letterSpacing: '0.15em',
          textAlign: 'center',
          width: `${width * 0.2}px`,
          margin: '0 auto'
        }}
      >
        EDICIUS
      </div>
    </div>
  );
};

export default Logo;
