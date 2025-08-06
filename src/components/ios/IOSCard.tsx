import React from 'react';
import { cn } from '@/lib/utils';

interface IOSCardProps {
  children: React.ReactNode;
  className?: string;
  blur?: boolean;
}

export const IOSCard: React.FC<IOSCardProps> = ({ children, className, blur = false }) => {
  return (
    <div className={cn(
      'ios-card p-4',
      blur && 'ios-blur bg-card/80',
      className
    )}>
      {children}
    </div>
  );
};

export default IOSCard;