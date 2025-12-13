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
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <img
        src="/logo.png"
        alt="EDICIUS Logo"
        className="h-full w-auto object-contain"
        style={{ maxHeight: height, maxWidth: width }}
      />
    </div>
  );
};

export default Logo;
