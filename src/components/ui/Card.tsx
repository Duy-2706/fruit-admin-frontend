import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  padding = true 
}) => {
  return (
    <div className={clsx(
      'bg-white rounded-2xl border border-gray-200 shadow-soft',
      padding && 'p-6',
      className
    )}>
      {children}
    </div>
  );
};