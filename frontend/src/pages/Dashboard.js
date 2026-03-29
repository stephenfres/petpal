import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetch } from '../hooks/useFetch';
import { getPets, deletePet } from '../api/petApi';
import { getHealthRecords } from '../api/healthApi';
import { getUpcomingVaccinations } from '../api/vaccinationApi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDarkMode } from '../context/DarkModeContext';
import { 
  Cat, 
  Heart, 
  Calendar, 
  Activity, 
  TrendingUp,
  Plus,
  Syringe,
  AlertCircle,
  Bot,
  Utensils,
  MapPin,
  Settings,
  X,
  Check
} from 'lucide-react';
import { PetCard } from '../components/PetCard';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  
  // All available actions
  const allActions = [
    { id: 'addPet', label: t('dashboard.addPet', 'Add Pet'), icon: Plus, default: true, path: '/pets/new' },
    { id: 'logHealth', label: t('dashboard.logHealth', 'Log Health'), icon: Activity, default: true, path: '/health', state: { openAddModal: true } },
    { id: 'vaccines', label: t('dashboard.vaccines', 'Vaccines'), icon: Calendar, default: true, path: '/vaccinations' },
    { id: 'aiAssistant', label: t('dashboard.aiAssistant', 'AI Assistant'), icon: Bot, default: true, path: '/ai-helper' },
    { id: 'feeding', label: t('nav.feeding', 'Feeding'), icon: Utensils, default: false, path: '/feeding' },
    { id: 'vetFinder', label: t('nav.findVet', 'Find Vet'), icon: MapPin, default: false, path: '/vet-finder' },
  ];

  // Load user's selected actions from localStorage
  const [selectedActions, setSelectedActions] = useState(() => {
    const saved = localStorage.getItem(`quickActions_${user?.id}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return allActions.filter(action => action.default).map(a => a.id);
  });

  // Save selected actions to localStorage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`quickActions_${user.id}`, JSON.stringify(selectedActions));
    }
  }, [selectedActions, user]);

  const quickActions = allActions.filter(action => selectedActions.includes(action.id));

  // Fetch data
  const { data: pets, loading: petsLoading, refetch: refetchPets } = useFetch(getPets);
  const { data: healthRecords, loading: healthLoading } = useFetch(getHealthRecords);
  const { data: upcomingVaccines, loading: vaccinesLoading } = useFetch(getUpcomingVaccinations);
  
  const loading = petsLoading || healthLoading || vaccinesLoading;

  // Calculate stats
  const totalPets = pets?.length || 0;
  const totalHealthRecords = healthRecords?.length || 0;
  const totalVaccines = upcomingVaccines?.total || 0;
  const completedVaccines = upcomingVaccines?.completed || 0;
  const vaccinationRate = totalVaccines > 0 ? Math.round((completedVaccines / totalVaccines) * 100) : 0;
  const dueVaccinations = upcomingVaccines?.due || [];
  const urgentVaccinations = dueVaccinations.filter(v => v.daysUntil <= 3);
  const weeklyActivity = Math.min(Math.round((totalHealthRecords / 30) * 100), 100) || 0;

  const stats = [
    { 
      label: t('dashboard.totalPets', 'Total Pets'), 
      value: totalPets, 
      icon: Cat, 
      bgColor: darkMode ? 'bg-blue-900/30' : 'bg-blue-100',
      textColor: darkMode ? 'text-blue-400' : 'text-blue-600'
    },
    { 
      label: t('dashboard.healthRecords', 'Health Records'), 
      value: totalHealthRecords, 
      icon: Heart, 
      bgColor: darkMode ? 'bg-red-900/30' : 'bg-red-100',
      textColor: darkMode ? 'text-red-400' : 'text-red-600'
    },
    { 
      label: t('dashboard.vaccinationRate', 'Vaccination Rate'), 
      value: `${vaccinationRate}%`, 
      icon: Syringe, 
      bgColor: darkMode ? 'bg-green-900/30' : 'bg-green-100',
      textColor: darkMode ? 'text-green-400' : 'text-green-600',
      subtext: `${completedVaccines}/${totalVaccines} ${t('common.completed', 'completed')}`
    },
    { 
      label: t('dashboard.weeklyActivity', 'Weekly Activity'), 
      value: `${weeklyActivity}%`, 
      icon: TrendingUp, 
      bgColor: darkMode ? 'bg-purple-900/30' : 'bg-purple-100',
      textColor: darkMode ? 'text-purple-400' : 'text-purple-600'
    },
  ];

  // Handlers
  const handleQuickAction = (action) => {
    if (action.state) {
      navigate(action.path, { state: action.state });
    } else {
      navigate(action.path);
    }
  };

  const handleEditPet = (pet) => {
    navigate(`/pets/${pet.id}`);
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm(t('common.confirmDelete', 'Are you sure you want to delete this pet?'))) return;
    try {
      await deletePet(petId);
      toast.success(t('common.deleteSuccess', 'Pet deleted successfully'));
      refetchPets();
    } catch (error) {
      toast.error(t('common.deleteError', 'Failed to delete pet'));
    }
  };

  const toggleAction = (actionId) => {
    setSelectedActions(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      } else {
        return [...prev, actionId];
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('dashboard.welcome', 'Welcome back')}
          {user?.username 
            ? `, @${user.username}` 
            : user?.name 
              ? `, ${user.name}` 
              : ''}! 👋
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {t('dashboard.subtitle', "Here's what's happening with your pets today.")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
            {stat.subtext && (
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.subtext}</p>
            )}
          </div>
        ))}
      </div>

      {/* Urgent Alerts */}
      {urgentVaccinations.length > 0 && (
        <div className={`border-l-4 border-red-500 rounded-lg p-4 mb-8 ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-red-400' : 'text-red-800'}`}>
                {t('dashboard.urgentVaccinations', 'Urgent Vaccinations Due')}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                {urgentVaccinations.length} {t('dashboard.vaccinesDue', 'vaccine(s) due within 3 days')}
              </p>
              <Link 
                to="/vaccinations" 
                className={`text-sm font-semibold hover:underline mt-2 inline-block ${darkMode ? 'text-red-400' : 'text-red-600'}`}
              >
                {t('dashboard.viewDetails', 'View details')} →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('dashboard.quickActions', 'Quick Actions')}</h2>
          <button
            onClick={() => setShowCustomizeModal(true)}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-sm flex items-center transition-colors"
          >
            <Settings className="h-4 w-4 mr-1" />
            {t('dashboard.customize', 'Customize')}
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center transition-colors"
              >
                <Icon className="h-4 w-4 mr-2" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* My Pets */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('pets.myPets', 'My Pets')}
          </h2>
          <Link
            to="/pets"
            className="text-teal-600 font-semibold hover:underline"
          >
            {t('dashboard.viewAll', 'View All')} ({totalPets})
          </Link>
        </div>

        {totalPets === 0 ? (
          <div className={`text-center py-12 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Cat className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('dashboard.noPets', 'No pets added yet')}
            </p>
            <Link
              to="/pets/new"
              className="inline-flex items-center bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              {t('dashboard.addFirstPet', 'Add Your First Pet')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets?.slice(0, 3).map((pet) => (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                onEdit={handleEditPet}
                onDelete={handleDeletePet}
              />
            ))}
          </div>
        )}
      </div>

      {/* Customize Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : ''}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('dashboard.customizeActions', 'Customize Quick Actions')}
              </h2>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
            
            <div className="p-6">
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('dashboard.selectActions', 'Select which actions appear in your Quick Actions bar:')}
              </p>
              
              <div className="space-y-3">
                {allActions.map((action) => {
                  const Icon = action.icon;
                  const isSelected = selectedActions.includes(action.id);
                  
                  return (
                    <button
                      key={action.id}
                      onClick={() => toggleAction(action.id)}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-lg border transition-all
                        ${isSelected 
                          ? darkMode 
                            ? 'border-teal-500 bg-teal-900/30' 
                            : 'border-teal-500 bg-teal-50'
                          : darkMode 
                            ? 'border-gray-700 hover:border-gray-600' 
                            : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? (darkMode ? 'bg-teal-900/50' : 'bg-teal-100') : (darkMode ? 'bg-gray-700' : 'bg-gray-100')}`}>
                          <Icon className={`h-5 w-5 ${isSelected ? (darkMode ? 'text-teal-400' : 'text-teal-600') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                        </div>
                        <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {action.label}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? 'border-teal-500 bg-teal-500' : (darkMode ? 'border-gray-600' : 'border-gray-300')}`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className={`p-6 border-t flex justify-end ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50'}`}>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                {t('common.done', 'Done')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
