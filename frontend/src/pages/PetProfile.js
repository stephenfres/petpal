import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { getPet, createPet, updatePet, deletePet } from '../api/petApi';
import { useMutation } from '../hooks/useFetch';
import { useDarkMode } from '../context/DarkModeContext';
import toast from 'react-hot-toast';
import { ArrowLeft, Camera, Trash2, Save } from 'lucide-react';

const petTypes = [
  { value: 'dog', label: '🐕 Dog' },
  { value: 'cat', label: '🐈 Cat' },
  { value: 'bird', label: '🐦 Bird' },
  { value: 'rabbit', label: '🐰 Rabbit' },
  { value: 'hamster', label: '🐹 Hamster' },
  { value: 'fish', label: '🐠 Fish' },
  { value: 'reptile', label: '🦎 Reptile' },
  { value: 'other', label: '🐾 Other' },
];

export const PetProfile = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const isNew = id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      type: 'dog',
      breed: '',
      dateOfBirth: '',
      gender: 'unknown',
      weight: { value: '', unit: 'kg' },
      color: '',
      microchipId: '',
      medicalNotes: '',
    },
  });

  const fetchPet = useCallback(async () => {
    try {
      const response = await getPet(id);
      const pet = response.data.data;
      reset(pet);
      if (pet.imageUrl) setImagePreview(pet.imageUrl);
    } catch (error) {
      toast.error('Failed to load pet');
      navigate('/pets');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, reset]);

  useEffect(() => {
    if (!isNew && id) {
      fetchPet();
    }
  }, [fetchPet, id, isNew]);

  const { mutate: savePet, loading: saving } = useMutation(
    isNew ? createPet : (data) => updatePet(id, data)
  );

  const onSubmit = async (data) => {
    try {
      await savePet(data);
      toast.success(isNew ? 'Pet created successfully!' : 'Pet updated successfully!');
      navigate('/pets');
    } catch (error) {
      toast.error('Failed to save pet');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;
    
    try {
      await deletePet(id);
      toast.success('Pet deleted successfully');
      navigate('/pets');
    } catch (error) {
      toast.error('Failed to delete pet');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 ${darkMode ? 'dark' : ''}`}>
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center mb-6 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
          <h1 className="text-3xl font-bold">
            {isNew ? t('pets.addPet') : t('pets.editPet')}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 shadow-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-200 border-white'
              }`}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className={`h-12 w-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-teal-600 text-white p-2 rounded-full cursor-pointer hover:bg-teal-700 transition-colors shadow-md">
                <Camera className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pets.name')} *
              </label>
              <input
                {...register('name', { required: true })}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Pet's name"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pets.type')} *
              </label>
              <select
                {...register('type')}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {petTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pets.breed')}
              </label>
              <input
                {...register('breed')}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="e.g., Golden Retriever"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pets.birthDate')}
              </label>
              <input
                type="date"
                {...register('dateOfBirth')}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pets.gender')}
              </label>
              <select
                {...register('gender')}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="unknown">Unknown</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('pets.weight')}
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.1"
                  {...register('weight.value')}
                  className={`flex-1 px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="0.0"
                />
                <select
                  {...register('weight.unit')}
                  className={`w-24 px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Color
              </label>
              <input
                {...register('color')}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="e.g., Brown & White"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Microchip ID
              </label>
              <input
                {...register('microchipId')}
                className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="e.g., 985112345678910"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Medical Notes
            </label>
            <textarea
              {...register('medicalNotes')}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Any allergies, conditions, or special needs..."
            />
          </div>

          <div className={`flex justify-between pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete
              </button>
            )}
            <div className="flex space-x-3 ml-auto">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  darkMode 
                    ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Saving...' : t('common.save')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
