import { useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export const useKeyboardShortcuts = () => {
  const { toggleSetting, resetSettings } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only work with Alt key
      if (!e.altKey) return;
      
      switch(e.key.toLowerCase()) {
        case 'h':
          e.preventDefault();
          toggleSetting('highContrast');
          break;
        case 't':
          e.preventDefault();
          toggleSetting('largeText');
          break;
        case 'm':
          e.preventDefault();
          toggleSetting('reduceMotion');
          break;
        case 'r':
          e.preventDefault();
          resetSettings();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSetting, resetSettings]);
};