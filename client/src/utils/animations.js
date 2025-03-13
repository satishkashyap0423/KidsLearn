// Common animation presets for the app

// Bounce animation - good for buttons, icons, etc.
export const bounceAnimation = ({ 
  height = 10, // bounce height in pixels
  duration = 0.5, // animation duration in seconds
  repeat = 0 // number of repeats, Infinity for infinite
} = {}) => {
  return {
    animate: { 
      y: [`0px`, `-${height}px`, `0px`] 
    },
    transition: {
      duration,
      repeat,
      repeatType: "loop",
      ease: "easeInOut"
    }
  };
};

// Rotate animation - good for loading indicators, decorative elements
export const rotateAnimation = ({ 
  degrees = 360, // rotation in degrees
  duration = 2, // animation duration in seconds
  repeat = 0, // number of repeats, Infinity for infinite
  direction = 1 // 1 for clockwise, -1 for counterclockwise
} = {}) => {
  return {
    animate: { 
      rotate: [`0deg`, `${degrees * direction}deg`] 
    },
    transition: {
      duration,
      repeat,
      repeatType: "loop",
      ease: "linear"
    }
  };
};

// Pulse animation - good for highlighting elements
export const pulseAnimation = ({ 
  scale = 1.1, // max scale
  duration = 1, // animation duration in seconds
  repeat = 0 // number of repeats, Infinity for infinite
} = {}) => {
  return {
    animate: { 
      scale: [1, scale, 1] 
    },
    transition: {
      duration,
      repeat,
      repeatType: "loop",
      ease: "easeInOut"
    }
  };
};

// Scale animation - good for appearance/disappearance effects
export const scaleAnimation = ({ 
  from = 0, // initial scale
  to = 1, // final scale
  duration = 0.5, // animation duration in seconds
  delay = 0 // delay before animation starts
} = {}) => {
  return {
    initial: { scale: from },
    animate: { scale: to },
    exit: { scale: from },
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  };
};

// Fade animation - for smooth appearance/disappearance
export const fadeAnimation = ({ 
  duration = 0.3, // animation duration in seconds
  delay = 0 // delay before animation starts
} = {}) => {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration,
      delay,
      ease: "easeInOut"
    }
  };
};

// Slide animation - for elements entering/exiting the screen
export const slideAnimation = ({ 
  direction = 'right', // 'left', 'right', 'up', 'down'
  distance = 50, // distance in pixels
  duration = 0.5, // animation duration in seconds
  delay = 0 // delay before animation starts
} = {}) => {
  const getOffset = () => {
    switch (direction) {
      case 'left': return { x: -distance };
      case 'right': return { x: distance };
      case 'up': return { y: -distance };
      case 'down': return { y: distance };
      default: return { x: distance };
    }
  };
  
  const offset = getOffset();
  
  return {
    initial: { ...offset, opacity: 0 },
    animate: { x: 0, y: 0, opacity: 1 },
    exit: { ...offset, opacity: 0 },
    transition: {
      duration,
      delay,
      ease: "easeOut"
    }
  };
};

// Staggered children animation - for lists of elements
export const staggeredContainerAnimation = ({
  staggerChildren = 0.1, // time between each child animation
  delayChildren = 0.3 // delay before children start animating
} = {}) => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren
      }
    }
  };
};

export const staggeredItemAnimation = ({
  yOffset = 20, // vertical offset
  duration = 0.5 // animation duration
} = {}) => {
  return {
    hidden: { y: yOffset, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration,
        ease: "easeOut"
      }
    }
  };
};
