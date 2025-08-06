import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IOSButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const IOSButton: React.FC<IOSButtonProps> = ({ children, className, ...props }) => {
  return (
    <Button 
      className={cn('ios-button', className)} 
      {...props}
    >
      {children}
    </Button>
  );
};

export default IOSButton;