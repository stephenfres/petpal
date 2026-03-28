import React, { useState, useRef } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

export const LanguageSwitcher = ({ mobile = false }) => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const currentLang = languages.find((l) => l.code === currentLanguage);

  if (mobile) {
    return (
      <div className="px-3 py-2">
        <p className="text-xs text-gray-400 mb-2 uppercase">Language</p>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              changeLanguage(lang.code);
              setIsOpen(false);
            }}
            className={`block w-full text-left px-2 py-2 rounded-md ${
              currentLanguage === lang.code ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 hover:bg-white/20 px-3 py-2 rounded-md transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden lg:inline">{currentLang?.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 transition-colors ${
                currentLanguage === lang.code ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {currentLanguage === lang.code && (
                <span className="ml-auto text-teal-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};