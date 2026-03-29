import React, { useState, useRef, useEffect } from 'react';
import { getAdvice, analyzeSymptoms, getNutritionAdvice } from '../api/aiApi';
import { getPets } from '../api/petApi';
import { useFetch } from '../hooks/useFetch';
import { useDarkMode } from '../context/DarkModeContext';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Stethoscope, 
  Utensils, 
  HelpCircle,
  Trash2,
  AlertCircle,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const quickPrompts = [
  { icon: Stethoscope, label: 'Analyze Symptoms', prompt: 'My pet is showing these symptoms: ', mode: 'symptoms' },
  { icon: Utensils, label: 'Nutrition Advice', prompt: 'What should I feed my pet? ', mode: 'nutrition' },
  { icon: HelpCircle, label: 'General Question', prompt: '', mode: 'chat' },
];

export const AIHelper = () => {
  const { darkMode } = useDarkMode();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi there! 👋 I'm PetPal AI, your intelligent pet care assistant. I can help you with pet health questions, nutrition advice, and symptom analysis. Powered by advanced AI technology, I'm here to support you and your furry friends! How can I help you today? 🐾",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState('');
  const [mode, setMode] = useState('chat');
  const messagesEndRef = useRef(null);

  const { data: pets } = useFetch(getPets);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let response;
      
      if (mode === 'symptoms') {
        response = await analyzeSymptoms(input, selectedPet);
      } else if (mode === 'nutrition' && selectedPet) {
        response = await getNutritionAdvice(selectedPet);
      } else {
        response = await getAdvice(input, selectedPet);
      }

      const aiMessage = {
        role: 'assistant',
        content: response.data.advice || response.data.analysis || response.data.data?.advice || response.data.data?.analysis,
        disclaimer: mode === 'symptoms',
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Sorry, I had trouble responding. Please try again!');
      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: "I'm having a little trouble connecting right now. Could you please try asking again? I'm here to help when you're ready! 🐾" 
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt.prompt);
    setMode(prompt.mode);
    if (prompt.mode === 'nutrition' && !selectedPet) {
      toast.error('Please select a pet first for personalized nutrition advice!');
      setMode('chat');
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared! 👋 I'm still here whenever you need me. Got any questions about your pet? I'm ready to help! 🐕🐈",
      },
    ]);
    toast.success('Chat cleared');
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-8rem)] flex flex-col ${darkMode ? 'dark' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-xl mr-4">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              PetPal AI Assistant
            </h1>
            <div className="flex items-center gap-2">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Your intelligent pet care companion
              </p>
              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="h-3 w-3" />
                AI Powered
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Select a pet (optional)</option>
            {pets?.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name} ({pet.type})
              </option>
            ))}
          </select>
          
          <button
            onClick={clearChat}
            className={`p-2 transition-colors ${darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
            title="Clear chat"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mode Indicator */}
      {mode !== 'chat' && (
        <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
          mode === 'symptoms' 
            ? darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-50 text-red-700'
            : darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-50 text-green-700'
        }`}>
          <div className="flex items-center gap-2">
            {mode === 'symptoms' ? <Stethoscope className="h-4 w-4" /> : <Utensils className="h-4 w-4" />}
            <span className="text-sm font-medium">
              {mode === 'symptoms' ? '🔍 Symptom Analysis Mode' : '🍎 Nutrition Advice Mode'}
            </span>
          </div>
          <button
            onClick={() => setMode('chat')}
            className="text-xs underline hover:no-underline"
          >
            Switch to General Chat
          </button>
        </div>
      )}

      {/* Chat Container */}
      <div className={`flex-1 rounded-2xl shadow-lg overflow-hidden flex flex-col ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Messages */}
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${darkMode ? 'bg-gray-800' : ''}`}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : darkMode
                      ? 'bg-gray-700 text-gray-100 rounded-bl-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <div className="flex items-center mb-2">
                  {message.role === 'assistant' ? (
                    <Bot className={`h-4 w-4 mr-2 ${darkMode ? 'text-teal-400' : 'text-teal-600'}`} />
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  <span className="text-xs font-medium opacity-75">
                    {message.role === 'assistant' ? 'PetPal AI' : 'You'}
                  </span>
                </div>
                
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                
                {message.disclaimer && (
                  <div className={`mt-3 pt-3 ${darkMode ? 'border-gray-600' : 'border-gray-200'} border-t`}>
                    <p className="text-xs text-red-500 dark:text-red-400 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      This is AI-generated advice. Please consult a veterinarian for professional medical advice.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className={`rounded-2xl rounded-bl-none p-4 flex items-center gap-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>PetPal AI is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className={`px-6 py-3 border-t flex gap-2 overflow-x-auto ${
          darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt)}
              className={`flex items-center px-3 py-2 rounded-full text-sm transition-colors whitespace-nowrap ${
                darkMode 
                  ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-teal-600' 
                  : 'bg-white border text-gray-700 hover:bg-teal-50 hover:border-teal-300'
              }`}
            >
              <prompt.icon className="h-4 w-4 mr-2" />
              {prompt.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className={`p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                mode === 'symptoms' 
                  ? "Describe your pet's symptoms... (e.g., coughing, lethargy, loss of appetite)"
                  : mode === 'nutrition'
                    ? "Ask about nutrition for your pet..."
                    : "Ask PetPal AI anything about pet care..."
              }
              className={`flex-1 px-4 py-3 rounded-xl resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              rows="2"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className={`text-xs text-center mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Press Enter to send, Shift+Enter for new line | Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
};
