'use client';
import { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <LayoutContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);
