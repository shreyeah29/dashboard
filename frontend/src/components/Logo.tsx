import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', width = 120, height = 40 }) => {
  // Check if logo image exists, fallback to CSS logo
  const [imageError, setImageError] = React.useState(false);

  if (imageError) {
    // CSS-based logo fallback
    return (
      <div className={`flex flex-col items-center ${className}`} style={{ width, height }}>
        {/* 5 bars - 3 red, 2 black */}
        <div className="flex items-end space-x-1 mb-2">
          <div className="w-2 h-3 bg-red-600"></div>
          <div className="w-2 h-4 bg-red-600"></div>
          <div className="w-2 h-5 bg-red-600"></div>
          <div className="w-2 h-6 bg-black"></div>
          <div className="w-2 h-7 bg-black"></div>
        </div>
        {/* EDICIUS text */}
        <div className="text-black font-bold text-sm tracking-wide">EDICIUS</div>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="EDICIUS Logo"
        width={width}
        height={height}
        className="object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default Logo;
