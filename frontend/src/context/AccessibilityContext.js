import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    screenReader: false,
    reduceMotion: false,
    keyboardNavigation: false,
    autoPlayAudio: false,
  });

  const lastFocusedRef = useRef(null);
  const focusTimeoutRef = useRef(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  // Handle screen reader activation with improved focus reading
  useEffect(() => {
    if (settings.screenReader && window.speechSynthesis) {
      // Announce that screen reader is enabled
      const utterance = new SpeechSynthesisUtterance(
        'Screen reader mode enabled. Press Tab to navigate. Focus on any element to hear it.'
      );
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      
      // Add focus listener for reading elements with debouncing
      const handleFocus = (e) => {
        // Don't announce if it's the same element as before
        if (lastFocusedRef.current === e.target) return;
        
        // Clear previous timeout
        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current);
        }
        
        lastFocusedRef.current = e.target;
        
        // Debounce focus announcements
        focusTimeoutRef.current = setTimeout(() => {
          const element = e.target;
          let text = '';
          
          // Skip if element is hidden or not visible
          if (element.offsetParent === null) return;
          
          // Get text based on element type
          if (element.tagName === 'BUTTON') {
            text = element.innerText || element.getAttribute('aria-label') || 'Button';
          } else if (element.tagName === 'A') {
            text = element.innerText || element.getAttribute('aria-label') || 'Link';
          } else if (element.tagName === 'INPUT') {
            const inputType = element.type || 'text';
            const label = element.getAttribute('aria-label') || element.placeholder || `${inputType} field`;
            text = label;
          } else if (element.hasAttribute('aria-label')) {
            text = element.getAttribute('aria-label');
          } else if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') {
            text = element.innerText;
          } else if (element.innerText && element.innerText.length < 100 && element.innerText.length > 3) {
            text = element.innerText;
          }
          
          if (text && text.length > 0) {
            // Cancel any ongoing speech
            if (window.speechSynthesis.speaking) {
              window.speechSynthesis.cancel();
            }
            
            const readUtterance = new SpeechSynthesisUtterance(text);
            readUtterance.rate = 0.9;
            window.speechSynthesis.speak(readUtterance);
          }
        }, 200);
      };
      
      document.addEventListener('focus', handleFocus, true);
      
      return () => {
        document.removeEventListener('focus', handleFocus, true);
        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current);
        }
        window.speechSynthesis.cancel();
      };
    }
  }, [settings.screenReader]);

  const toggleSetting = (key) => {
    setSettings(prev => {
      const newValue = !prev[key];
      
      // If disabling screen reader, cancel any ongoing speech
      if (key === 'screenReader' && !newValue) {
        window.speechSynthesis.cancel();
      }
      
      // Apply settings to body
      if (key === 'highContrast') {
        document.body.classList.toggle('high-contrast', newValue);
      }
      if (key === 'largeText') {
        document.documentElement.style.fontSize = newValue ? '125%' : '';
      }
      if (key === 'reduceMotion') {
        document.body.classList.toggle('reduce-motion', newValue);
      }
      if (key === 'keyboardNavigation') {
        document.body.classList.toggle('keyboard-navigation', newValue);
      }
      
      return { ...prev, [key]: newValue };
    });
  };

  const resetSettings = () => {
    setSettings({
      highContrast: false,
      largeText: false,
      screenReader: false,
      reduceMotion: false,
      keyboardNavigation: false,
      autoPlayAudio: false,
    });
    
    // Reset all body classes and styles
    document.body.classList.remove('high-contrast', 'reduce-motion', 'keyboard-navigation');
    document.documentElement.style.fontSize = '';
    window.speechSynthesis.cancel();
  };

  // Apply settings on mount and when they change
  useEffect(() => {
    if (settings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    if (settings.largeText) {
      document.documentElement.style.fontSize = '125%';
    } else {
      document.documentElement.style.fontSize = '';
    }
    
    if (settings.reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    
    if (settings.keyboardNavigation) {
      document.body.classList.add('keyboard-navigation');
    } else {
      document.body.classList.remove('keyboard-navigation');
    }
  }, [settings]);

  return (
    <AccessibilityContext.Provider value={{ settings, toggleSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};