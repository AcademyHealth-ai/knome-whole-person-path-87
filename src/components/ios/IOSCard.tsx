import React from 'react';
import { cn } from '@/lib/utils';

interface IOSCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: boolean;
  onClick?: () => void;
}

export const IOSCard: React.FC<IOSCardProps> = ({ children, className, blur = false, onClick }) => {
  return (
    <div 
      className={cn(
        'ios-card p-4',
        blur && 'ios-blur bg-card/80',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default IOSCard;