import { useCallback } from 'react';
import { useParentalControl } from '../context/ParentalControlContext';
import { bounceAnimation, rotateAnimation, pulseAnimation, scaleAnimation } from '../utils/animations';

// Export as named export to match possible import statements in components
export const useAnimation = () => {
  const { settings } = useParentalControl();
  const animationsEnabled = settings.allowAnimations && !settings.reducedMotion;
  
  // Default animation params to use if animations are disabled
  const disabledAnimation = {
    animate: {},
    transition: { duration: 0 }
  };
  
  // Helper to check if animations should be enabled
  const shouldAnimate = useCallback(() => {
    return animationsEnabled;
  }, [animationsEnabled]);
  
  // Generate bounce animation
  const getBounceAnimation = useCallback((options = {}) => {
    if (!shouldAnimate()) return disabledAnimation;
    return bounceAnimation(options);
  }, [shouldAnimate]);
  
  // Generate rotate animation
  const getRotateAnimation = useCallback((options = {}) => {
    if (!shouldAnimate()) return disabledAnimation;
    return rotateAnimation(options);
  }, [shouldAnimate]);
  
  // Generate pulse animation
  const getPulseAnimation = useCallback((options = {}) => {
    if (!shouldAnimate()) return disabledAnimation;
    return pulseAnimation(options);
  }, [shouldAnimate]);
  
  // Generate scale animation
  const getScaleAnimation = useCallback((options = {}) => {
    if (!shouldAnimate()) return disabledAnimation;
    return scaleAnimation(options);
  }, [shouldAnimate]);
  
  // Create custom animation with reduced params if animations are disabled
  const getCustomAnimation = useCallback((animation) => {
    if (!shouldAnimate()) return disabledAnimation;
    return animation;
  }, [shouldAnimate]);
  
  return {
    shouldAnimate,
    getBounceAnimation,
    getRotateAnimation,
    getPulseAnimation,
    getScaleAnimation,
    getCustomAnimation
  };
};

// Also export as default to maintain backward compatibility
export default useAnimation;
