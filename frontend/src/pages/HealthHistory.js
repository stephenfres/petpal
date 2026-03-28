import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useFetch, useMutation } from '../hooks/useFetch';
import { getHealthRecords, createHealthRecord, updateHealthRecord, deleteHealthRecord } from '../api/healthApi';
import { getPets } from '../api/petApi';
import { format } from 'date-fns';
import { Plus, Stethoscope, Calendar, FileText, X, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDarkMode } from '../context/DarkModeContext';

export const HealthHistory = () => {
  const { t } = useTranslation();
  const { darkMode } = useDarkMode();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [selectedPet, setSelectedPet] = useState(searchParams.get('petId') || '');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: pets } = useFetch(getPets);
  const { data: records, refetch } = useFetch(
    () => getHealthRecords(selectedPet),
    [selectedPet]
  );

  const { mutate: addRecord, loading: adding } = useMutation(createHealthRecord);
  const { mutate: updateRecord, loading: updating } = useMutation(updateHealthRecord);
  const { mutate: deleteRecord, loading: deleting } = useMutation(deleteHealthRecord);

  // Open add modal if navigated from dashboard
  useEffect(() => {
    if (location.state?.openAddModal) {
      setShowModal(true);
      // Clear the state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await addRecord({
        petId: selectedPet,
        type: formData.get('type'),
        symptoms: formData.get('symptoms').split(',').filter(s => s.trim()).map(s => s.trim()),
        diagnosis: formData.get('diagnosis') || null,
        treatment: formData.get('treatment') || null,
        vetName: formData.get('vetName') || null,
        clinicName: formData.get('clinicName') || null,
        date: formData.get('date'),
      });
      toast.success('Record added successfully');
      setShowModal(false);
      refetch();
    } catch (error) {
      toast.error('Failed to add record');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await updateRecord(selectedRecord.id, {
        type: formData.get('type'),
        symptoms: formData.get('symptoms').split(',').filter(s => s.trim()).map(s => s.trim()),
        diagnosis: formData.get('diagnosis') || null,
        treatment: formData.get('treatment') || null,
        vetName: formData.get('vetName') || null,
        clinicName: formData.get('clinicName') || null,
        date: formData.get('date'),
      });
      toast.success('Record updated successfully');
      setIsEditing(false);
      setShowDetailModal(false);
      setSelectedRecord(null);
      refetch();
    } catch (error) {
      toast.error('Failed to update record');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteRecord(selectedRecord.id);
      toast.success('Record deleted');
      setShowDetailModal(false);
      setSelectedRecord(null);
      refetch();
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  const openRecordDetail = (record) => {
    setSelectedRecord(record);
    setIsEditing(false);
    setShowDetailModal(true);
  };

  const openEditMode = () => {
    setIsEditing(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRecord(null);
    setIsEditing(false);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('health.records')}
        </h1>
        
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
              Add Record
            </button>
          )}
        </div>
      </div>

      {!selectedPet ? (
        <div className={`text-center py-12 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Stethoscope className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a pet to view health records
          </p>
        </div>
      ) : records?.length === 0 ? (
        <div className={`text-center py-12 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <FileText className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No health records yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {records?.map((record) => (
            <div 
              key={record.id} 
              onClick={() => openRecordDetail(record)}
              className={`rounded-xl shadow-md p-6 border-l-4 border-teal-500 cursor-pointer hover:shadow-lg transition-shadow ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block text-xs px-3 py-1 rounded-full uppercase font-semibold ${
                    darkMode ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {record.type}
                  </span>
                  <p className={`text-sm mt-2 flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openRecordDetail(record);
                    }}
                    className={`p-2 transition-colors ${darkMode ? 'text-gray-500 hover:text-teal-400' : 'text-gray-400 hover:text-teal-600'}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {record.symptoms?.length > 0 && (
                <div className="mb-3">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Symptoms:
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {record.symptoms.map((symptom, idx) => (
                      <span key={idx} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {record.diagnosis && (
                <div className="mb-3">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Diagnosis:
                  </p>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                    {record.diagnosis}
                  </p>
                </div>
              )}
              
              {record.treatment && (
                <div className="mb-3">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Treatment:
                  </p>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                    {record.treatment}
                  </p>
                </div>
              )}
              
              {record.vetName && (
                <p className={`text-sm mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Vet: {record.vetName}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : ''}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Add Health Record
              </h2>
              <button onClick={() => setShowModal(false)} className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type
                </label>
                <select name="type" className={`w-full px-4 py-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`} required>
                  <option value="checkup">Checkup</option>
                  <option value="illness">Illness</option>
                  <option value="injury">Injury</option>
                  <option value="surgery">Surgery</option>
                  <option value="dental">Dental</option>
                  <option value="grooming">Grooming</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date
                </label>
                <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} 
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`} required />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Symptoms (comma separated)
                </label>
                <input type="text" name="symptoms" placeholder="e.g., coughing, fever, lethargy" 
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`} />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Diagnosis
                </label>
                <textarea name="diagnosis" rows="2" 
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`} />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Treatment
                </label>
                <textarea name="treatment" rows="2" 
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`} />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Veterinarian
                </label>
                <input type="text" name="vetName" 
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
                <input type="text" name="clinicName" 
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
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
                  {adding ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Detail/Edit Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : ''}`}>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {isEditing ? 'Edit Health Record' : 'Health Record Details'}
              </h2>
              <div className="flex space-x-2">
                {!isEditing && (
                  <>
                    <button 
                      onClick={openEditMode}
                      className={`p-2 transition-colors ${darkMode ? 'text-gray-400 hover:text-teal-400' : 'text-gray-400 hover:text-teal-600'}`}
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={handleDelete}
                      disabled={deleting}
                      className={`p-2 transition-colors ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                )}
                <button onClick={closeDetailModal} className={`p-2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type
                  </label>
                  <select name="type" defaultValue={selectedRecord.type} className={`w-full px-4 py-2 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`} required>
                    <option value="checkup">Checkup</option>
                    <option value="illness">Illness</option>
                    <option value="injury">Injury</option>
                    <option value="surgery">Surgery</option>
                    <option value="dental">Dental</option>
                    <option value="grooming">Grooming</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date
                  </label>
                  <input type="date" name="date" 
                    defaultValue={new Date(selectedRecord.date).toISOString().split('T')[0]} 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} required />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Symptoms (comma separated)
                  </label>
                  <input type="text" name="symptoms" 
                    defaultValue={selectedRecord.symptoms?.join(', ')} 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Diagnosis
                  </label>
                  <textarea name="diagnosis" rows="2" 
                    defaultValue={selectedRecord.diagnosis || ''} 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Treatment
                  </label>
                  <textarea name="treatment" rows="2" 
                    defaultValue={selectedRecord.treatment || ''} 
                    className={`w-full px-4 py-2 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`} />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Veterinarian
                  </label>
                  <input type="text" name="vetName" 
                    defaultValue={selectedRecord.vetName || ''} 
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
                  <input type="text" name="clinicName" 
                    defaultValue={selectedRecord.clinicName || ''} 
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
                    {updating ? 'Updating...' : 'Update Record'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`inline-block text-xs px-3 py-1 rounded-full uppercase font-semibold ${
                    darkMode ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {selectedRecord.type}
                  </span>
                  <p className={`text-sm flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Calendar className="h-4 w-4 mr-1" />
                    {format(new Date(selectedRecord.date), 'MMM dd, yyyy')}
                  </p>
                </div>
                
                {selectedRecord.symptoms?.length > 0 && (
                  <div>
                    <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Symptoms:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.symptoms.map((symptom, idx) => (
                        <span key={idx} className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedRecord.diagnosis && (
                  <div>
                    <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Diagnosis:
                    </p>
                    <p className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                      {selectedRecord.diagnosis}
                    </p>
                  </div>
                )}
                
                {selectedRecord.treatment && (
                  <div>
                    <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Treatment:
                    </p>
                    <p className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                      {selectedRecord.treatment}
                    </p>
                  </div>
                )}
                
                {(selectedRecord.vetName || selectedRecord.clinicName) && (
                  <div className={`pt-4 mt-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
                    <p className={`text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Veterinarian:
                    </p>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {selectedRecord.vetName}
                      {selectedRecord.vetName && selectedRecord.clinicName && ' - '}
                      {selectedRecord.clinicName}
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