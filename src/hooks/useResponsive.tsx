
import { useState, useEffect } from 'react';

type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints: Record<BreakpointKey, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const isAbove = (breakpoint: BreakpointKey): boolean => {
    return mounted ? screenSize.width >= breakpoints[breakpoint] : false;
  };
  
  const isBelow = (breakpoint: BreakpointKey): boolean => {
    return mounted ? screenSize.width < breakpoints[breakpoint] : false;
  };
  
  const isBetween = (minBreakpoint: BreakpointKey, maxBreakpoint: BreakpointKey): boolean => {
    return mounted 
      ? screenSize.width >= breakpoints[minBreakpoint] && screenSize.width < breakpoints[maxBreakpoint]
      : false;
  };
  
  const currentBreakpoint = (): BreakpointKey => {
    if (!mounted) return 'lg'; // Default for SSR
    
    if (screenSize.width >= breakpoints['2xl']) return '2xl';
    if (screenSize.width >= breakpoints.xl) return 'xl';
    if (screenSize.width >= breakpoints.lg) return 'lg';
    if (screenSize.width >= breakpoints.md) return 'md';
    if (screenSize.width >= breakpoints.sm) return 'sm';
    return 'xs';
  };
  
  return {
    screenSize,
    isAbove,
    isBelow,
    isBetween,
    currentBreakpoint,
    isMobile: isBelow('md'),
    isTablet: isBetween('md', 'lg'),
    isDesktop: isAbove('lg'),
  };
};

export default useResponsive;
