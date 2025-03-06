
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
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      
      // Fix for 100vh in mobile browsers
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    // Initial check
    handleResize();
    
    // Throttled resize handler for better performance
    let resizeTimer: ReturnType<typeof setTimeout>;
    
    const throttledResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', throttledResize);
    
    // Check for orientation changes on mobile
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(resizeTimer);
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
  
  // Is this a touch device?
  const isTouchDevice = () => {
    if (!mounted) return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };
  
  // Calculate viewport height correctly (fixing iOS issues)
  const getViewportHeight = () => {
    if (!mounted) return '100vh';
    
    // For iOS devices that have issues with 100vh
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS) {
      return `calc(var(--vh, 1vh) * 100)`;
    }
    
    return '100vh';
  };
  
  // Get safe area insets
  const getSafeAreaInsets = () => {
    return {
      top: 'env(safe-area-inset-top, 0px)',
      right: 'env(safe-area-inset-right, 0px)',
      bottom: 'env(safe-area-inset-bottom, 0px)',
      left: 'env(safe-area-inset-left, 0px)',
    };
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
    isSmallScreen: isBelow('sm'),
    isTouchDevice: isTouchDevice(),
    viewportHeight: getViewportHeight(),
    orientation: screenSize.width > screenSize.height ? 'landscape' : 'portrait',
    safeAreaInsets: getSafeAreaInsets(),
  };
};

export default useResponsive;
