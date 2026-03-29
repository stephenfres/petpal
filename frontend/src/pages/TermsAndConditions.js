import React from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { Cat, CheckCircle, Shield, Heart, AlertCircle, Calendar, Users, Lock, FileText, Mail } from 'lucide-react';

export const TermsAndConditions = () => {
  const { darkMode } = useDarkMode();
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`min-h-screen py-12 px-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-teal-50 to-cyan-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`rounded-2xl shadow-xl overflow-hidden mb-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3">
                <Cat className="h-10 w-10 text-white" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Terms and Conditions
                </h1>
              </div>
              <div className="text-white/80 text-sm">
                Last Updated: {currentDate}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className={`text-xl font-bold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <FileText className={`h-5 w-5 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                1. Introduction
              </h2>
              <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Welcome to PetPal! By accessing or using our pet management platform, you agree to be bound by these Terms and Conditions. 
                PetPal is designed to help pet owners manage their pets' health, feeding schedules, vaccinations, and connect with veterinary services.
              </p>
            </section>

            {/* Definitions */}
            <section>
              <h2 className={`text-xl font-bold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Shield className={`h-5 w-5 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                2. Definitions
              </h2>
              <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li><strong>"PetPal"</strong> refers to the platform, website, and mobile application.</li>
                <li><strong>"User"</strong> refers to any person who registers an account on PetPal.</li>
                <li><strong>"Pet"</strong> refers to any animal registered on the platform by a user.</li>
                <li><strong>"Veterinarian"</strong> refers to licensed veterinary professionals.</li>
                <li><strong>"Services"</strong> include pet health tracking, reminders, reports, and veterinary connections.</li>
              </ul>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className={`text-xl font-bold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Users className={`h-5 w-5 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                3. Account Registration
              </h2>
              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>To use PetPal, you must:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Be at least 18 years old or have parental consent</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized account access</li>
                </ul>
                <div className={`p-4 rounded-lg mt-3 ${
                  darkMode ? 'bg-teal-900/30' : 'bg-teal-50'
                }`}>
                  <p className={`text-sm flex items-start ${darkMode ? 'text-teal-300' : 'text-teal-800'}`}>
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>By creating an account, you confirm that you are the legal owner or authorized caregiver of any pets you register.</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Pet Health Information */}
            <section>
              <h2 className={`text-xl font-bold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Heart className={`h-5 w-5 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                4. Medical Disclaimer
              </h2>
              <div className={`border-l-4 border-yellow-400 p-4 rounded-lg ${
                darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'
              }`}>
                <p className={`font-semibold mb-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                  ⚠️ IMPORTANT MEDICAL DISCLAIMER
                </p>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  PetPal provides tools for tracking and managing pet health information but does NOT provide veterinary medical advice. 
                  All health information and reminders are for informational purposes only. ALWAYS consult a licensed veterinarian for 
                  medical diagnoses, treatments, or emergency situations.
                </p>
              </div>
              <div className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>You agree that:</p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>PetPal is not liable for any health decisions made based on platform information</li>
                  <li>You will seek professional veterinary care for any health concerns</li>
                  <li>Emergency situations require immediate contact with a veterinarian</li>
                </ul>
              </div>
            </section>

            {/* Data Privacy */}
            <section>
              <h2 className={`text-xl font-bold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Lock className={`h-5 w-5 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                5. Data Collection & Privacy
              </h2>
              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>We collect and process the following information:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Personal information (name, email, phone number)</li>
                  <li>Pet information (names, species, medical history, vaccinations)</li>
                  <li>Location data for finding nearby veterinarians</li>
                  <li>Device information for push notifications</li>
                </ul>
                <p>We use your data to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide and improve our services</li>
                  <li>Send reminders and notifications</li>
                  <li>Generate health reports and insights</li>
                  <li>Connect you with veterinary services</li>
                </ul>
                <p className="text-sm">
                  For complete details, please review our <Link to="/privacy" className={`${darkMode ? 'text-teal-400' : 'text-teal-600'} hover:underline`}>Privacy Policy</Link>.
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className={`text-xl font-bold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <CheckCircle className={`h-5 w-5 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                6. User Responsibilities
              </h2>
              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>As a PetPal user, you agree to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide accurate and truthful information about your pets</li>
                  <li>Keep vaccination and medical records up to date</li>
                  <li>Not misuse the platform for illegal activities</li>
                  <li>Respect the privacy of other users and veterinarians</li>
                  <li>Not upload harmful or inappropriate content</li>
                  <li>Comply with all applicable local, state, and federal laws</li>
                </ul>
              </div>
            </section>

            {/* PetPal Services */}
            <section>
              <h2 className={`text-xl font-bold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Calendar className={`h-5 w-5 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                7. Services Provided
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`rounded-lg p-4 ${darkMode ? 'border border-gray-700' : 'border border-gray-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Included Features:
                  </h3>
                  <ul className={`list-disc list-inside text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>Pet profile management</li>
                    <li>Health record tracking</li>
                    <li>Vaccination reminders</li>
                    <li>Feeding schedules</li>
                    <li>Weekly health reports</li>
                    <li>Veterinarian locator</li>
                    <li>Push notifications</li>
                  </ul>
                </div>
                <div className={`rounded-lg p-4 ${darkMode ? 'border border-gray-700' : 'border border-gray-200'}`}>
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Limitations:
                  </h3>
                  <ul className={`list-disc list-inside text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>Not a substitute for veterinary care</li>
                    <li>Services may be modified or discontinued</li>
                    <li>No guarantee of veterinarian availability</li>
                    <li>Internet connection required</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Liability */}
            <section>
              <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                8. Limitation of Liability
              </h2>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  To the maximum extent permitted by law, PetPal and its affiliates shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, including but not limited to:
                </p>
                <ul className={`list-disc list-inside ml-4 mt-2 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <li>Health issues or injuries to pets</li>
                  <li>Missed vaccinations or treatments</li>
                  <li>Data loss or service interruptions</li>
                  <li>Third-party service provider issues</li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                9. Account Termination
              </h2>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                We reserve the right to suspend or terminate accounts that violate these terms, including:
              </p>
              <ul className={`list-disc list-inside ml-4 mt-2 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>Providing false information</li>
                <li>Misusing the platform</li>
                <li>Harassing other users or veterinarians</li>
                <li>Violating any applicable laws</li>
              </ul>
              <p className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                You may delete your account at any time by contacting support or through account settings.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                10. Changes to Terms
              </h2>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                PetPal reserves the right to modify these terms at any time. We will notify users of significant changes via:
              </p>
              <ul className={`list-disc list-inside ml-4 mt-2 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>Email notification</li>
                <li>In-app announcements</li>
                <li>Website updates</li>
              </ul>
              <p className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Continued use of PetPal after changes constitutes acceptance of modified terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className={`rounded-lg p-6 ${darkMode ? 'bg-teal-900/30' : 'bg-teal-50'}`}>
              <h2 className={`text-xl font-bold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                <Mail className={`h-5 w-5 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                11. Contact Information
              </h2>
              <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                For questions, concerns, or support requests:
              </p>
              <ul className={`space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li><strong>Email:</strong> support@petpal.com</li>
                <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                <li><strong>Address:</strong> 123 Pet Care Street, Nairobi, Kenya</li>
                <li><strong>Support Hours:</strong> Monday-Friday, 9AM-6PM EAT</li>
              </ul>
            </section>

            {/* Acceptance Footer */}
            <div className={`pt-6 text-center ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
              <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                By creating a PetPal account, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                I Agree to the Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
