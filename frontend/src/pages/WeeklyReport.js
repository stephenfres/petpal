import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useFetch, useMutation } from '../hooks/useFetch';
import { getReports, generateReport } from '../api/reportApi';
import { getPets } from '../api/petApi';
import { useDarkMode } from '../context/DarkModeContext';
import { format } from 'date-fns';
import { FileText, Download, RefreshCw, TrendingUp, Activity, Utensils, Syringe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export const WeeklyReport = () => {
  const { t } = useTranslation();
  const { darkMode } = useDarkMode();
  const [searchParams] = useSearchParams();
  const [selectedPet, setSelectedPet] = useState(searchParams.get('petId') || '');
  const [generating, setGenerating] = useState(false);

  const { data: pets } = useFetch(getPets);
  const { data: reports, refetch } = useFetch(
    () => getReports(selectedPet),
    [selectedPet]
  );

  const handleGenerate = async () => {
    if (!selectedPet) {
      toast.error('Please select a pet first');
      return;
    }
    
    setGenerating(true);
    try {
      await generateReport(selectedPet);
      toast.success('Report generated successfully!');
      refetch();
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (report) => {
    toast.success('Downloading report...');
  };

  const getTrendData = (report) => [
    { name: 'Feeding', value: report.summary.feedingConsistency, fill: '#14b8a6' },
    { name: 'Health', value: 100 - (report.summary.healthIncidents * 10), fill: '#ef4444' },
    { name: 'Vaccines', value: report.summary.vaccinationsDue === 0 ? 100 : 50, fill: '#f59e0b' },
  ];

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center">
          <FileText className={`h-8 w-8 mr-3 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {t('nav.reports')}
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
          
          <button
            onClick={handleGenerate}
            disabled={generating || !selectedPet}
            className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${generating ? 'animate-spin' : ''}`} />
            Generate New
          </button>
        </div>
      </div>

      {!selectedPet ? (
        <div className={`text-center py-12 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <FileText className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a pet to view weekly reports
          </p>
        </div>
      ) : reports?.length === 0 ? (
        <div className={`text-center py-12 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <TrendingUp className={`h-16 w-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No reports generated yet
          </p>
          <button
            onClick={handleGenerate}
            className="text-teal-600 font-semibold hover:underline"
          >
            Generate your first report
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reports?.map((report) => (
            <div key={report.id} className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Week of {format(new Date(report.weekStart), 'MMM dd')} - {format(new Date(report.weekEnd), 'MMM dd, yyyy')}
                    </h2>
                    <p className="text-teal-100 mt-1">
                      Generated on {format(new Date(report.generatedAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(report)}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-teal-900/30' : 'bg-teal-50'}`}>
                    <Utensils className={`h-8 w-8 mx-auto mb-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                    <p className={`text-2xl font-bold ${darkMode ? 'text-teal-400' : 'text-teal-700'}`}>
                      {report.summary.feedingConsistency}%
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Feeding Consistency
                    </p>
                  </div>
                  
                  <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                    <Activity className={`h-8 w-8 mx-auto mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                    <p className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                      {report.summary.healthIncidents}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Health Incidents
                    </p>
                  </div>
                  
                  <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'}`}>
                    <Syringe className={`h-8 w-8 mx-auto mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <p className={`text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                      {report.summary.vaccinationsDue}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Vaccinations Due
                    </p>
                  </div>
                  
                  <div className={`rounded-xl p-4 text-center ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                      {report.summary.medicationsGiven}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Medications
                    </p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Weekly Overview
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getTrendData(report)}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <YAxis domain={[0, 100]} stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: darkMode ? '#1f2937' : '#fff',
                            borderColor: darkMode ? '#374151' : '#e5e7eb',
                            color: darkMode ? '#fff' : '#000'
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {report.aiInsights && (
                  <div className={`rounded-xl p-6 border ${darkMode ? 'bg-purple-900/30 border-purple-800' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100'}`}>
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-2">🤖</span>
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>
                        AI Insights
                      </h3>
                    </div>
                    <p className={`leading-relaxed whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {report.aiInsights}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};