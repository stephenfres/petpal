import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useFetch, useMutation } from '../hooks/useFetch';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '../api/feedingApi';
import { getPets } from '../api/petApi';
import { ScheduleCard } from '../components/ScheduleCard';
import { Plus, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDarkMode } from '../context/DarkModeContext';

export const FeedingSchedule = () => {
  const { t } = useTranslation();
  const { darkMode } = useDarkMode();
  const [searchParams] = useSearchParams();
  const [selectedPet, setSelectedPet] = useState(searchParams.get('petId') || '');
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const { data: pets } = useFetch(getPets);
  const { data: schedules, refetch } = useFetch(
    () => getSchedules(selectedPet),
    [selectedPet]
  );

  const { mutate: saveSchedule } = useMutation(
    editingSchedule 
      ? (data) => updateSchedule(editingSchedule.id, data)
      : createSchedule
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await saveSchedule({
        petId: selectedPet,
        mealName: formData.get('mealName'),
        foodType: formData.get('foodType'),
        amount: {
          value: parseFloat(formData.get('amount')),
          unit: formData.get('unit'),
        },
        scheduleTime: formData.get('scheduleTime'),
        frequency: formData.get('frequency'),
        instructions: formData.get('instructions'),
      });
      
      toast.success(editingSchedule ? 'Schedule updated!' : 'Schedule created!');
      setShowModal(false);
      setEditingSchedule(null);
      refetch();
    } catch (error) {
      toast.error('Failed to save schedule');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this schedule?')) return;
    try {
      await deleteSchedule(id);
      toast.success('Schedule deleted');
      refetch();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleMarkFed = async (id) => {
    toast.success('Marked as fed!');
    refetch();
  };

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSchedule(null);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-teal-600 mr-3" />
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('feeding.schedule')}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            className={`px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Select a pet</option>
            {pets?.map((pet) => (
              <option key={pet.id} value={pet.id}>{pet.name}</option>
            ))}
          </select>
          
          {selectedPet && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Schedule
            </button>
          )}
        </div>
      </div>

      {!selectedPet ? (
        <div className={`text-center py-12 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Clock className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a pet to manage feeding schedules
          </p>
        </div>
      ) : schedules?.length === 0 ? (
        <div className={`text-center py-12 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No feeding schedules yet
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="text-teal-600 font-semibold hover:underline"
          >
            Create your first schedule
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schedules?.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onMarkFed={handleMarkFed}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal with Native Time Picker */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl max-w-md w-full ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : ''}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {editingSchedule ? 'Edit Schedule' : 'Add Feeding Schedule'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Meal Name
                </label>
                <input
                  name="mealName"
                  defaultValue={editingSchedule?.mealName || ''}
                  placeholder="e.g., Breakfast"
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Food Type
                </label>
                <input
                  name="foodType"
                  defaultValue={editingSchedule?.foodType || ''}
                  placeholder="e.g., Dry Kibble"
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="amount"
                    defaultValue={editingSchedule?.amount?.value || ''}
                    className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Unit
                  </label>
                  <select
                    name="unit"
                    defaultValue={editingSchedule?.amount?.unit || 'cups'}
                    className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="cups">cups</option>
                    <option value="grams">grams</option>
                    <option value="oz">oz</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>
              
              {/* Native Time Picker */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Time
                </label>
                <input
                  type="time"
                  name="scheduleTime"
                  defaultValue={editingSchedule?.scheduleTime || '08:00'}
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  style={{ 
                    appearance: 'textfield',
                    WebkitAppearance: 'textfield'
                  }}
                  required
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Click to open native time picker
                </p>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Frequency
                </label>
                <select
                  name="frequency"
                  defaultValue={editingSchedule?.frequency || 'daily'}
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="daily">Daily</option>
                  <option value="twice_daily">Twice Daily</option>
                  <option value="three_times">Three Times</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Instructions
                </label>
                <textarea
                  name="instructions"
                  defaultValue={editingSchedule?.instructions || ''}
                  placeholder="Special instructions..."
                  rows="2"
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  {editingSchedule ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};