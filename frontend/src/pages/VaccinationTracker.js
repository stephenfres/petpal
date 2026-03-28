import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useFetch, useMutation } from '../hooks/useFetch';
import { getVaccinations, createVaccination, updateVaccination, deleteVaccination } from '../api/vaccinationApi';
import { getPets } from '../api/petApi';
import { useDarkMode } from '../context/DarkModeContext';
import { format, isPast, isFuture, isToday } from 'date-fns';
import { Plus, Syringe, Calendar, AlertCircle, CheckCircle, X, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const VaccinationTracker = () => {
  const { t } = useTranslation();
  const { darkMode } = useDarkMode();
  const [searchParams] = useSearchParams();
  const [selectedPet, setSelectedPet] = useState(searchParams.get('petId') || '');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: pets } = useFetch(getPets);
  const { data: vaccinations, refetch } = useFetch(
    () => getVaccinations(selectedPet),
    [selectedPet]
  );

  const { mutate: addVaccination, loading: adding } = useMutation(createVaccination);
  const { mutate: updateVax, loading: updating } = useMutation(updateVaccination);
  const { mutate: deleteVax, loading: deleting } = useMutation(deleteVaccination);

  const getStatus = (nextDueDate) => {
    if (!nextDueDate) return 'completed';
    const due = new Date(nextDueDate);
    if (isPast(due) && !isToday(due)) return 'overdue';
    if (isToday(due)) return 'due-today';
    if (isFuture(due)) return 'upcoming';
    return 'completed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue': 
        return darkMode 
          ? 'bg-red-900/30 text-red-300 border-red-600' 
          : 'bg-red-100 text-red-700 border-red-500';
      case 'due-today': 
        return darkMode 
          ? 'bg-orange-900/30 text-orange-300 border-orange-600' 
          : 'bg-orange-100 text-orange-700 border-orange-500';
      case 'upcoming': 
        return darkMode 
          ? 'bg-blue-900/30 text-blue-300 border-blue-600' 
          : 'bg-blue-100 text-blue-700 border-blue-500';
      default: 
        return darkMode 
          ? 'bg-green-900/30 text-green-300 border-green-600' 
          : 'bg-green-100 text-green-700 border-green-500';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await addVaccination({
        petId: selectedPet,
        vaccineName: formData.get('vaccineName'),
        disease: formData.get('disease'),
        dateAdministered: formData.get('dateAdministered'),
        nextDueDate: formData.get('nextDueDate') || null,
        vetName: formData.get('vetName') || null,
        clinicName: formData.get('clinicName') || null,
        batchNumber: formData.get('batchNumber') || null,
        notes: formData.get('notes') || null,
      });
      toast.success('Vaccination recorded');
      setShowModal(false);
      refetch();
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await updateVax(selectedVaccination.id, {
        vaccineName: formData.get('vaccineName'),
        disease: formData.get('disease'),
        dateAdministered: formData.get('dateAdministered'),
        nextDueDate: formData.get('nextDueDate') || null,
        vetName: formData.get('vetName') || null,
        clinicName: formData.get('clinicName') || null,
        batchNumber: formData.get('batchNumber') || null,
        notes: formData.get('notes') || null,
      });
      toast.success('Vaccination updated');
      setIsEditing(false);
      setShowDetailModal(false);
      setSelectedVaccination(null);
      refetch();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this vaccination record?')) return;
    try {
      await deleteVax(selectedVaccination.id);
      toast.success('Vaccination deleted');
      setShowDetailModal(false);
      setSelectedVaccination(null);
      refetch();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const openDetail = (vax) => {
    setSelectedVaccination(vax);
    setIsEditing(false);
    setShowDetailModal(true);
  };

  const closeDetail = () => {
    setShowDetailModal(false);
    setSelectedVaccination(null);
    setIsEditing(false);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center">
          <Syringe className={`h-8 w-8 mr-3 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Vaccination Tracker
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
              Add Vaccination
            </button>
          )}
        </div>
      </div>

      {!selectedPet ? (
        <div className={`text-center py-12 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Syringe className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a pet to view vaccinations
          </p>
        </div>
      ) : vaccinations?.length === 0 ? (
        <div className={`text-center py-12 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <AlertCircle className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No vaccination records
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="text-teal-600 font-semibold hover:underline"
          >
            Record first vaccination
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {vaccinations?.map((vax) => {
            const status = getStatus(vax.nextDueDate);
            const statusColor = getStatusColor(status);
            return (
              <div 
                key={vax.id}
                onClick={() => openDetail(vax)}
                className={`rounded-xl shadow-md p-6 border-l-4 cursor-pointer hover:shadow-lg transition-shadow ${statusColor} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {vax.vaccineName}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor}`}>
                        {status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Protects against: {vax.disease}
                    </p>
                    <div className="flex items-center gap-4 text-sm mt-3">
                      <span className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Calendar className="h-4 w-4 mr-1" />
                        Given: {format(new Date(vax.dateAdministered), 'MMM dd, yyyy')}
                      </span>
                      {vax.nextDueDate && (
                        <span className={`flex items-center font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Next: {format(new Date(vax.nextDueDate), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                  {status === 'completed' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertCircle className={`h-6 w-6 ${darkMode ? 'text-gray-500' : ''}`} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : ''}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Add Vaccination
              </h2>
              <button onClick={() => setShowModal(false)} className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Vaccine Name *
                </label>
                <input name="vaccineName" required 
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Rabies Vaccine" />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Disease Protected Against *
                </label>
                <input name="disease" required 
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="e.g., Rabies" />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date Administered *
                </label>
                <input type="date" name="dateAdministered" required 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`} />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Next Due Date
                </label>
                <input type="date" name="nextDueDate" 
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`} />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Veterinarian
                </label>
                <input name="vetName" 
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`} />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Clinic Name
                </label>
                <input name="clinicName" 
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`} />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Batch Number
                </label>
                <input name="batchNumber" 
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`} />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Notes
                </label>
                <textarea name="notes" rows="2" 
                  className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`} />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} 
                  className={`px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border hover:bg-gray-50 text-gray-700'
                  }`}>
                  Cancel
                </button>
                <button type="submit" disabled={adding} 
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50 hover:bg-teal-700">
                  {adding ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail/Edit Modal */}
      {showDetailModal && selectedVaccination && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : ''}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {isEditing ? 'Edit Vaccination' : 'Vaccination Details'}
              </h2>
              <div className="flex space-x-2">
                {!isEditing && (
                  <>
                    <button onClick={() => setIsEditing(true)} className={`p-2 ${darkMode ? 'text-gray-400 hover:text-teal-400' : 'text-gray-400 hover:text-teal-600'}`}>
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button onClick={handleDelete} disabled={deleting} className={`p-2 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                )}
                <button onClick={closeDetail} className={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Vaccine Name
                  </label>
                  <input name="vaccineName" defaultValue={selectedVaccination.vaccineName} required 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Disease
                  </label>
                  <input name="disease" defaultValue={selectedVaccination.disease} required 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date Administered
                  </label>
                  <input type="date" name="dateAdministered" 
                    defaultValue={selectedVaccination.dateAdministered} required 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Next Due Date
                  </label>
                  <input type="date" name="nextDueDate" 
                    defaultValue={selectedVaccination.nextDueDate || ''} 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Veterinarian
                  </label>
                  <input name="vetName" defaultValue={selectedVaccination.vetName || ''} 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Clinic Name
                  </label>
                  <input name="clinicName" defaultValue={selectedVaccination.clinicName || ''} 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Batch Number
                  </label>
                  <input name="batchNumber" defaultValue={selectedVaccination.batchNumber || ''} 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Notes
                  </label>
                  <textarea name="notes" defaultValue={selectedVaccination.notes || ''} rows="2" 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setIsEditing(false)} 
                    className={`px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border hover:bg-gray-50 text-gray-700'
                    }`}>
                    Cancel
                  </button>
                  <button type="submit" disabled={updating} 
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50 hover:bg-teal-700">
                    {updating ? 'Updating...' : 'Update'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {selectedVaccination.vaccineName}
                  </h3>
                  <span className={`text-xs px-3 py-1 rounded-full uppercase font-semibold ${getStatusColor(getStatus(selectedVaccination.nextDueDate))}`}>
                    {getStatus(selectedVaccination.nextDueDate).replace('-', ' ')}
                  </span>
                </div>
                
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Protects against: <span className="font-semibold">{selectedVaccination.disease}</span>
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date Given</p>
                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {format(new Date(selectedVaccination.dateAdministered), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  {selectedVaccination.nextDueDate && (
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                      <p className={`mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Next Due</p>
                      <p className={`font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                        {format(new Date(selectedVaccination.nextDueDate), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
                
                {selectedVaccination.vetName && (
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Veterinarian</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedVaccination.vetName}
                    </p>
                  </div>
                )}
                
                {selectedVaccination.clinicName && (
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Clinic</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedVaccination.clinicName}
                    </p>
                  </div>
                )}
                
                {selectedVaccination.batchNumber && (
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Batch Number</p>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedVaccination.batchNumber}
                    </p>
                  </div>
                )}
                
                {selectedVaccination.notes && (
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
                    <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Notes</p>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-900'}>
                      {selectedVaccination.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};