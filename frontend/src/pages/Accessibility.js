import React from 'react';
import { 
  Eye, 
  Type, 
  Volume2, 
  MousePointer, 
  Keyboard, 
  Info, 
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAccessibility } from '../context/AccessibilityContext';
import { useDarkMode } from '../context/DarkModeContext';

export const Accessibility = () => {
  const { settings, toggleSetting, resetSettings } = useAccessibility();
  const { darkMode } = useDarkMode();

  const handleToggle = (key) => {
    toggleSetting(key);
    const newValue = !settings[key];
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    toast.success(`${label} ${newValue ? 'enabled' : 'disabled'}`);
    
    // Special message for screen reader
    if (key === 'screenReader' && newValue) {
      toast.success('Screen reader enabled. Use Tab to navigate. Elements will be read aloud.', {
        duration: 5000,
      });
    }
  };

  const handleReset = () => {
    resetSettings();
    toast.success('All settings reset to default');
  };

  const features = [
    {
      key: 'highContrast',
      icon: Eye,
      title: 'High Contrast',
      description: 'Increase contrast for better visibility with stronger colors and borders',
      color: 'bg-blue-100 text-blue-600',
      activeColor: 'ring-blue-500',
      preview: settings.highContrast ? 'High contrast mode active' : 'Standard colors'
    },
    {
      key: 'largeText',
      icon: Type,
      title: 'Large Text',
      description: 'Increase text size by 25% throughout the entire application',
      color: 'bg-green-100 text-green-600',
      activeColor: 'ring-green-500',
      preview: settings.largeText ? 'Text size increased' : 'Standard text size'
    },
    {
      key: 'screenReader',
      icon: Volume2,
      title: 'Screen Reader Support',
      description: 'Enable text-to-speech. When enabled, the system will read aloud elements you focus on. Press Tab to navigate and hear content.',
      color: 'bg-purple-100 text-purple-600',
      activeColor: 'ring-purple-500',
      preview: settings.screenReader ? 'Screen reader active - focus on elements to hear them' : 'Standard markup'
    },
    {
      key: 'reduceMotion',
      icon: MousePointer,
      title: 'Reduce Motion',
      description: 'Disable animations, transitions, and auto-playing content',
      color: 'bg-orange-100 text-orange-600',
      activeColor: 'ring-orange-500',
      preview: settings.reduceMotion ? 'Animations disabled' : 'Full animations'
    },
    {
      key: 'keyboardNavigation',
      icon: Keyboard,
      title: 'Keyboard Navigation',
      description: 'Enable full keyboard navigation with visible focus indicators',
      color: 'bg-teal-100 text-teal-600',
      activeColor: 'ring-teal-500',
      preview: settings.keyboardNavigation ? 'Keyboard nav enabled' : 'Mouse focused'
    },
    {
      key: 'autoPlayAudio',
      icon: Volume2,
      title: 'Auto-play Audio',
      description: 'Allow audio content to play automatically (notifications, alerts)',
      color: 'bg-pink-100 text-pink-600',
      activeColor: 'ring-pink-500',
      preview: settings.autoPlayAudio ? 'Audio auto-plays' : 'Audio muted by default'
    },
  ];

  const activeCount = Object.values(settings).filter(Boolean).length;

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className={`p-3 rounded-full mr-4 ${darkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
            <Eye className={`h-8 w-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Accessibility
            </h1>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Customize your experience to suit your needs
            </p>
          </div>
        </div>
        
        <button
          onClick={handleReset}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            darkMode 
              ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <RotateCcw className="h-4 w-4" />
          Reset All
        </button>
      </div>

      {/* Active Settings Summary */}
      <div className={`${darkMode ? 'bg-teal-900/30 border-teal-800' : 'bg-teal-50 border-teal-200'} border rounded-xl p-4 mb-6`}>
        <h3 className={`font-semibold ${darkMode ? 'text-teal-400' : 'text-teal-800'} mb-2`}>
          Currently Active ({activeCount}):
        </h3>
        <div className="flex flex-wrap gap-2">
          {activeCount === 0 ? (
            <span className={`text-sm ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>
              No accessibility features active
            </span>
          ) : (
            Object.entries(settings)
              .filter(([_, value]) => value)
              .map(([key]) => (
                <span 
                  key={key}
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                    darkMode 
                      ? 'bg-teal-900/50 text-teal-300' 
                      : 'bg-teal-100 text-teal-700'
                  }`}
                >
                  <Check className="h-3 w-3" />
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              ))
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <p className="text-blue-800 font-medium">Accessibility Features</p>
            <p className="text-blue-600 text-sm">
              These settings are saved automatically and apply across all pages. 
              Changes take effect immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Screen Reader Tip Banner */}
      {settings.screenReader && (
        <div className={`${darkMode ? 'bg-purple-900/50 border-purple-800' : 'bg-purple-50 border-purple-200'} border p-4 mb-6 rounded-lg`}>
          <div className="flex items-start">
            <Volume2 className={`h-5 w-5 mr-3 mt-0.5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            <div>
              <p className={`font-medium ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>
                Screen Reader Active
              </p>
              <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                ✓ Press <kbd className={`px-2 py-0.5 rounded font-mono ${darkMode ? 'bg-purple-800/50 text-purple-300' : 'bg-purple-100'}`}>Tab</kbd> to navigate between elements<br />
                ✓ Each element will be read aloud when focused<br />
                ✓ Page headings are announced when navigating<br />
                ✓ Press <kbd className={`px-2 py-0.5 rounded font-mono ${darkMode ? 'bg-purple-800/50 text-purple-300' : 'bg-purple-100'}`}>Alt + R</kbd> to reset all settings
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Features */}
      <div className="space-y-4">
        {features.map((feature) => {
          const isActive = settings[feature.key];
          
          return (
            <div 
              key={feature.key} 
              className={`
                rounded-xl shadow-md p-6 transition-all duration-300
                ${isActive ? `ring-2 ${feature.activeColor} shadow-lg` : ''}
                ${darkMode ? 'bg-gray-800' : 'bg-white'}
                ${settings.highContrast ? 'border-2 border-black' : ''}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <div className={`${feature.color} p-3 rounded-lg mr-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {feature.title}
                      </h3>
                      {isActive && (
                        <span className={`px-2 py-1 text-xs font-bold rounded-full animate-pulse ${
                          darkMode ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-100 text-teal-700'
                        }`}>
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                    
                    {/* Live Preview */}
                    <div className={`
                      mt-3 p-2 rounded text-sm flex items-center gap-2
                      ${isActive 
                        ? darkMode 
                          ? 'bg-green-900/30 text-green-300' 
                          : 'bg-green-50 text-green-700'
                        : darkMode 
                          ? 'bg-gray-700 text-gray-400' 
                          : 'bg-gray-50 text-gray-500'
                      }
                    `}>
                      {isActive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      <span className="font-medium">Preview: </span>
                      {feature.preview}
                    </div>
                  </div>
                </div>
                
                {/* Toggle Switch */}
                <button 
                  onClick={() => handleToggle(feature.key)}
                  className={`
                    w-14 h-7 rounded-full transition-all duration-300 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500
                    ${isActive ? 'bg-teal-600' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}
                  `}
                  aria-checked={isActive}
                  aria-label={`Toggle ${feature.title}`}
                  role="switch"
                >
                  <span className={`
                    block w-6 h-6 bg-white rounded-full shadow-md 
                    transition-transform duration-300
                    ${isActive ? 'translate-x-7' : 'translate-x-1'}
                  `} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Keyboard Shortcuts Info */}
      {settings.keyboardNavigation && (
        <div className={`mt-8 rounded-xl p-6 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <h3 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className={`flex justify-between items-center p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Toggle High Contrast</span>
              <kbd className={`px-2 py-1 border rounded font-mono text-xs ${darkMode ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-gray-100 border-gray-300'}`}>
                Alt + H
              </kbd>
            </div>
            <div className={`flex justify-between items-center p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Toggle Large Text</span>
              <kbd className={`px-2 py-1 border rounded font-mono text-xs ${darkMode ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-gray-100 border-gray-300'}`}>
                Alt + T
              </kbd>
            </div>
            <div className={`flex justify-between items-center p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Reduce Motion</span>
              <kbd className={`px-2 py-1 border rounded font-mono text-xs ${darkMode ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-gray-100 border-gray-300'}`}>
                Alt + M
              </kbd>
            </div>
            <div className={`flex justify-between items-center p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Reset All Settings</span>
              <kbd className={`px-2 py-1 border rounded font-mono text-xs ${darkMode ? 'bg-gray-600 border-gray-500 text-gray-200' : 'bg-gray-100 border-gray-300'}`}>
                Alt + R
              </kbd>
            </div>
          </div>
        </div>
      )}

      {/* Testing Area */}
      <div className={`mt-8 p-6 rounded-xl border ${darkMode ? 'bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border-teal-800' : 'bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200'}`}>
        <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Live Preview Area
        </h3>
        <p className={`mb-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          This area demonstrates how your accessibility settings affect content:
        </p>
        <div className="space-y-3">
          <button className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-teal-700 text-white hover:bg-teal-600' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>
            Sample Button
          </button>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            This is sample text that will resize when "Large Text" is enabled.
          </p>
          <div className={`h-2 w-32 rounded-full overflow-hidden ${darkMode ? 'bg-teal-800' : 'bg-teal-200'}`}>
            <div className="h-full w-2/3 bg-teal-600 rounded-full animate-pulse" 
                 style={{ animationPlayState: settings.reduceMotion ? 'paused' : 'running' }}>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
