import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Cat, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/pets', label: 'My Pets', icon: '🐾' },
    { to: '/health', label: 'Health', icon: '🏥' },
    { to: '/feeding', label: 'Feeding', icon: '🍖' },
    { to: '/vaccinations', label: 'Vaccinations', icon: '💉' },
    { to: '/reports', label: 'Reports', icon: '📊' },
    { to: '/vet-finder', label: 'Find Vet', icon: '🗺️' },
    { to: '/ai-helper', label: 'AI Helper', icon: '🤖' },
  ];

  return (
    <nav className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Cat className="h-8 w-8" />
            <span className="font-bold text-xl">PetPal</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:bg-white/20 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <span className="mr-1">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-teal-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className="block hover:bg-white/20 px-3 py-2 rounded-md text-base font-medium"
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
