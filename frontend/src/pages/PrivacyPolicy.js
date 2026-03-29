import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';
import { Shield, Lock, Database, Eye } from 'lucide-react';

export const PrivacyPolicy = () => {
  const { darkMode } = useDarkMode();

  return (
    <div className={`min-h-screen py-12 px-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-teal-50 to-cyan-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-2xl shadow-xl overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
              <Shield className="h-8 w-8 mr-3" />
              Privacy Policy
            </h1>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Last Updated: {new Date().toLocaleDateString()}
            </p>
            
            <section>
              <h2 className={`text-xl font-bold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Database className={`h-5 w-5 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                Information We Collect
              </h2>
              <ul className={`list-disc list-inside space-y-1 ml-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <li>Personal information (name, email, phone)</li>
                <li>Pet health records and medical history</li>
                <li>Location data (with your consent)</li>
                <li>Device information and push tokens</li>
                <li>Usage analytics</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Lock className={`h-5 w-5 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                How We Protect Your Data
              </h2>
              <ul className={`list-disc list-inside space-y-1 ml-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure servers with regular backups</li>
                <li>Strict access controls and authentication</li>
                <li>Regular security audits</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-xl font-bold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Eye className={`h-5 w-5 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                Your Rights
              </h2>
              <ul className={`list-disc list-inside space-y-1 ml-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your pet health data</li>
              </ul>
            </section>

            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-teal-900/30' : 'bg-teal-50'
            }`}>
              <p className={`text-center ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                For privacy concerns or data requests, contact us at <strong className={darkMode ? 'text-teal-400' : 'text-teal-600'}>privacy@petpal.com</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
