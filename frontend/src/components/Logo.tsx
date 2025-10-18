import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className = '', width = 120, height = 40 }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="EDICIUS Logo"
        width={width}
        height={height}
        className="object-contain"
      />
    </div>
  );
};

export default Logo;
