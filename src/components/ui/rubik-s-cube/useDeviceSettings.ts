
import { useState, useEffect, useRef, useCallback } from "react";
import { DeviceSettings } from "./types";

export const useDeviceSettings = (resetCube: () => void) => {
  const isMountedRef = useRef(true);
  const viewportSizeRef = useRef({ width: window.innerWidth, height: window.innerHeight });
  const isResizingRef = useRef(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [isVisible, setIsVisible] = useState(true);
  const [deviceSettings, setDeviceSettings] = useState<DeviceSettings>(() => {
    const isMobile = window.innerWidth < 768;
    return {
      smoothness: isMobile ? 2 : 4,
      castShadow: !isMobile,
      receiveShadow: !isMobile
    };
  });

  const handleViewportChange = useCallback(() => {
    if (!isMountedRef.current) return;
    
    isResizingRef.current = true;
    
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const visualViewportWidth = window.visualViewport ? window.visualViewport.width : width;
      const visualViewportHeight = window.visualViewport ? window.visualViewport.height : height;
      
      const effectiveWidth = Math.min(width, visualViewportWidth);
      const effectiveHeight = Math.min(height, visualViewportHeight);
      
      const prevSize = viewportSizeRef.current;
      if (Math.abs(prevSize.width - effectiveWidth) < 10 && 
          Math.abs(prevSize.height - effectiveHeight) < 10) {
        isResizingRef.current = false;
        return;
      }
      
      viewportSizeRef.current = { width: effectiveWidth, height: effectiveHeight };
      
      const isMobile = effectiveWidth < 768;
      setDeviceSettings(prevSettings => {
        const newSettings = {
          smoothness: isMobile ? 2 : 4,
          castShadow: !isMobile,
          receiveShadow: !isMobile
        };
        
        if (prevSettings.smoothness !== newSettings.smoothness ||
            prevSettings.castShadow !== newSettings.castShadow ||
            prevSettings.receiveShadow !== newSettings.receiveShadow) {
          return newSettings;
        }
        return prevSettings;
      });
      
      isResizingRef.current = false;
    }, 150);
  }, [resetCube]);

  useEffect(() => {
    handleViewportChange();
    
    let throttleTimer: NodeJS.Timeout | null = null;
    const throttledHandler = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        handleViewportChange();
        throttleTimer = null;
      }, 100);
    };
    
    window.addEventListener("resize", throttledHandler);
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", throttledHandler);
      window.visualViewport.addEventListener("scroll", throttledHandler);
    }
    
    const handleOrientationChange = () => {
      if (isMountedRef.current) {
        resetCube();
      }
      setTimeout(handleViewportChange, 100);
    };
    
    window.addEventListener("orientationchange", handleOrientationChange);
    
    return () => {
      window.removeEventListener("resize", throttledHandler);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", throttledHandler);
        window.visualViewport.removeEventListener("scroll", throttledHandler);
      }
      window.removeEventListener("orientationchange", handleOrientationChange);
      
      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, [handleViewportChange]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!isMountedRef.current) return;
      const isPageVisible = document.visibilityState === "visible";
      setIsVisible(isPageVisible);

      if (!isPageVisible) {
        resetCube();
      } else {
        setTimeout(() => {
          if (isMountedRef.current) {
            handleViewportChange();
          }
        }, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [resetCube, handleViewportChange]);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
    };
  }, []);

  return {
    deviceSettings,
    isVisible,
    isMountedRef,
    isResizingRef,
    handleViewportChange
  };
};
