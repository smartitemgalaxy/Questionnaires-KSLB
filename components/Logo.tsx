
import React from 'react';
import logoSrc from '/logo_kslb.png';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-24 w-24" }) => {
  return (
    <img
      src={logoSrc}
      alt="Logo KSLB"
      className={`object-contain ${className}`}
    />
  );
};

export default Logo;
