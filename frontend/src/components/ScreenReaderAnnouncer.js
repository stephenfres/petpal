import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export const ScreenReaderAnnouncer = () => {
  const { settings } = useAccessibility();
  const lastAnnouncedRef = useRef('');
  const timeoutRef = useRef(null);
  const isSpeakingRef = useRef(false);

  // Function to announce text with debouncing
  const announce = (text) => {
    if (!settings.screenReader) return;
    if (!text || text.length === 0) return;
    
    // Don't announce the same text repeatedly
    if (lastAnnouncedRef.current === text) return;
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce announcements to prevent rapid repeats
    timeoutRef.current = setTimeout(() => {
      // Cancel any ongoing speech
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      
      lastAnnouncedRef.current = text;
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        isSpeakingRef.current = true;
      };
      
      utterance.onend = () => {
        isSpeakingRef.current = false;
      };
      
      utterance.onerror = () => {
        isSpeakingRef.current = false;
      };
      
      window.speechSynthesis.speak(utterance);
    }, 300);
  };

  // Announce page title when it changes
  useEffect(() => {
    if (!settings.screenReader) return;

    // Function to get main heading
    const getMainHeading = () => {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        const heading = mainContent.querySelector('h1, h2');
        if (heading && heading.innerText) {
          return heading.innerText.trim();
        }
      }
      return document.title;
    };

    // Announce on initial load
    const initialHeading = getMainHeading();
    if (initialHeading) {
      announce(initialHeading);
    }

    // Observe title changes
    const titleObserver = new MutationObserver(() => {
      const heading = getMainHeading();
      if (heading) {
        announce(heading);
      }
    });

    titleObserver.observe(document.querySelector('title') || document.head, {
      subtree: true,
      characterData: true,
      childList: true,
    });

    return () => {
      titleObserver.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [settings.screenReader]);

  return null;
};