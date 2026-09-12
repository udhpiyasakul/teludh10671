import React from 'react';

interface UDHLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const UDHLogo: React.FC<UDHLogoProps> = ({
  className = '',
  size = 48,
}) => {
  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/logo.png"
        alt="โรงพยาบาลอุดรธานี Udon Thani Hospital"
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
