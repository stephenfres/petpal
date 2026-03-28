import { useAccessibility } from '../context/AccessibilityContext';

export const useAccessibilityFeatures = () => {
  const { settings } = useAccessibility();

  return {
    // Helper to get ARIA props
    getAriaProps: (label, description) => ({
      'aria-label': label,
      'aria-describedby': description,
      role: settings.screenReader ? 'region' : undefined,
    }),

    // Helper for button props
    getButtonProps: (label) => ({
      'aria-label': label,
      tabIndex: settings.keyboardNavigation ? 0 : undefined,
    }),

    // Check if animations should be disabled
    shouldReduceMotion: settings.reduceMotion,

    // Check if high contrast is enabled
    isHighContrast: settings.highContrast,

    // Get appropriate color class
    getColorClass: (normalClass, highContrastClass) => 
      settings.highContrast ? highContrastClass : normalClass,

    // Get text size class
    getTextSizeClass: (baseClass) => 
      settings.largeText ? `${baseClass} text-lg` : baseClass,
  };
};