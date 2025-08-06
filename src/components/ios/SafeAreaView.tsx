import React from 'react';
import { cn } from '@/lib/utils';

interface SafeAreaViewProps {
  children: React.ReactNode;
  className?: string;
}

export const SafeAreaView: React.FC<SafeAreaViewProps> = ({ children, className }) => {
  return (
    <div className={cn('ios-safe-area min-h-screen', className)}>
      {children}
    </div>
  );
};

export default SafeAreaView;