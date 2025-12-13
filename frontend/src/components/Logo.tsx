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
  width = 600,
  height = 420,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${className}`}
      style={{ width, height }}
    >
      {/* SVG Bars - 3 red, 2 black */}
      <svg
        width={width}
        height={height * 0.7}
        viewBox="0 0 100 70"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Red Bars */}
        <rect x="5" y="50" width="10" height="15" fill="#D32F2F" rx="1" />
        <rect x="20" y="40" width="10" height="25" fill="#E53935" rx="1" />
        <rect x="35" y="30" width="10" height="35" fill="#C62828" rx="1" />

        {/* Black Bars - 2 bars */}
        <rect x="50" y="20" width="10" height="45" fill="#000000" rx="1" />
        <rect x="65" y="10" width="10" height="55" fill="#000000" rx="1" />
      </svg>

      {/* EDICIUS Text */}
      <div className="text-white font-bold tracking-wider text-lg">
        EDICIUS
      </div>
    </div>
  );
};

export default Logo;
