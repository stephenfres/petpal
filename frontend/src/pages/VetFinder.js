import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Globe, Navigation, Search, Star, Heart } from 'lucide-react';
import { getNearbyVets, getAllVets } from '../api/vetApi';
import { useDarkMode } from '../context/DarkModeContext';
import toast from 'react-hot-toast';

export const VetFinder = () => {
  const { darkMode } = useDarkMode();
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVet, setSelectedVet] = useState(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Location error:', error);
          toast.error('Please enable location access to find nearby vets');
        }
      );
    }
  }, []);

  // Fetch nearby vets when location changes
  useEffect(() => {
    if (userLocation) {
      fetchNearbyVets();
    } else {
      fetchAllVets();
    }
  }, [userLocation, searchRadius]);

  const fetchNearbyVets = async () => {
    setLoading(true);
    try {
      const response = await getNearbyVets(userLocation.lat, userLocation.lng, searchRadius);
      setVets(response.data.data);
    } catch (error) {
      toast.error('Failed to find nearby vets');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVets = async () => {
    setLoading(true);
    try {
      const response = await getAllVets();
      setVets(response.data.data);
    } catch (error) {
      toast.error('Failed to load vets');
    } finally {
      setLoading(false);
    }
  };

  const handleGetDirections = (vet) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${vet.latitude},${vet.longitude}`;
    window.open(url, '_blank');
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const filteredVets = vets.filter(vet => 
    vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vet.services?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`max-w-6xl mx-auto px-4 py-8 ${darkMode ? 'dark' : ''}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Find a Veterinarian
        </h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Locate trusted vets near you
        </p>
      </div>

      {/* Search and Filter */}
      <div className={`rounded-xl shadow-md p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search by name, location, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          
          {userLocation && (
            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Within:</span>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className={`px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
                <option value={200}>200 km</option>
              </select>
            </div>
          )}
          
          <button
            onClick={userLocation ? fetchNearbyVets : fetchAllVets}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
          >
            <MapPin className="h-5 w-5 mr-2" />
            {userLocation ? 'Find Nearby' : 'Show All'}
          </button>
        </div>
        
        {userLocation && (
          <p className={`text-sm mt-3 flex items-center ${darkMode ? 'text-teal-400' : 'text-green-600'}`}>
            <MapPin className="h-4 w-4 mr-1" />
            Using your current location
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
        </div>
      ) : filteredVets.length === 0 ? (
        <div className={`text-center py-12 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Heart className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No veterinarians found</p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Try increasing the search radius or search by name
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVets.map((vet) => (
            <div 
              key={vet.id} 
              className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {vet.name}
                    </h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {vet.address}
                    </p>
                  </div>
                  {vet.isEmergency && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                      24/7 Emergency
                    </span>
                  )}
                </div>
                
                {vet.distance && (
                  <p className="text-teal-600 font-medium mb-3 flex items-center">
                    <Navigation className="h-4 w-4 mr-1" />
                    {vet.distance} km away
                  </p>
                )}
                
                {vet.services && vet.services.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vet.services.slice(0, 3).map((service, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded text-xs ${
                        darkMode 
                          ? 'bg-teal-900/50 text-teal-300' 
                          : 'bg-teal-50 text-teal-700'
                      }`}>
                        {service}
                      </span>
                    ))}
                    {vet.services.length > 3 && (
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        +{vet.services.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                
                <div className={`space-y-2 text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {vet.phone && (
                    <p className="flex items-center">
                      <Phone className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      {vet.phone}
                    </p>
                  )}
                  {vet.hours && (
                    <p className="flex items-center">
                      <Clock className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      {vet.hours.open} - {vet.hours.close}
                    </p>
                  )}
                  {vet.website && (
                    <p className="flex items-center">
                      <Globe className={`h-4 w-4 mr-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <a href={vet.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
                        Visit Website
                      </a>
                    </p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleGetDirections(vet)}
                    className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Directions
                  </button>
                  {vet.phone && (
                    <button
                      onClick={() => handleCall(vet.phone)}
                      className={`flex-1 py-2 rounded-lg transition-colors flex items-center justify-center ${
                        darkMode 
                          ? 'border border-teal-600 text-teal-400 hover:bg-teal-900/30' 
                          : 'border border-teal-600 text-teal-600 hover:bg-teal-50'
                      }`}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};