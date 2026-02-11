
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-24 w-24" }) => {
  return (
    <img
      src="/logo_kslb.png"
      alt="Logo KSLB"
      className={`object-contain ${className}`}
    />
  );
};

export default Logo;
