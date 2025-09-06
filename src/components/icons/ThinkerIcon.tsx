import React from 'react';

interface ThinkerIconProps {
  className?: string;
}

export const ThinkerIcon: React.FC<ThinkerIconProps> = ({ className = "h-8 w-8" }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <img 
        src="/src/assets/thinker-icon.png" 
        alt="The Thinker" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};