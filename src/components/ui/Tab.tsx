import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext<{ value: string; onValueChange: (value: string) => void } | null>(null);

export const Tabs = ({ 
  value, 
  onValueChange, 
  className = '', 
  children 
}: { 
  value: string; 
  onValueChange: (value: string) => void; 
  className?: string; 
  children: React.ReactNode;
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className = '', children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, className = '', children }: { value: string; className?: string; children: React.ReactNode }) => {
  const context = useContext(TabsContext);
  if (!context) return null;

  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, className = '', children }: { value: string; className?: string; children: React.ReactNode }) => {
  const context = useContext(TabsContext);
  if (!context || context.value !== value) return null;

  return <div className={className}>{children}</div>;
};