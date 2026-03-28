const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash'; // Using the model you have access to

const getAIResponse = async (prompt, petContext = null) => {
  try {
    if (!GEMINI_API_KEY) {
      console.log('❌ No API key found');
      return "I'm here to help with your pet care questions! Please check the API configuration. 🐾";
    }

    console.log('🤖 Sending request to Gemini...');
    
    // Build the prompt with context
    let fullPrompt = `You are PetPal AI, a friendly, knowledgeable pet care assistant.

Guidelines:
- Be helpful, warm, and encouraging
- Use emojis occasionally to be friendly 🐾
- Keep responses detailed but not too long
- Always include a disclaimer for medical advice
- If unsure, suggest consulting a veterinarian

${petContext ? `Context about the pet: ${petContext}\n\n` : ''}
User: ${prompt}

PetPal AI:`;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.95,
          topK: 40,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    const result = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Gemini response received');
    return result;
    
  } catch (error) {
    console.error('❌ Gemini API error:', error.response?.data?.error?.message || error.message);
    
    // Return a helpful error message
    if (error.response?.data?.error?.message?.includes('API key')) {
      return "⚠️ The Gemini API key is not working. Please check your API key configuration.";
    }
    
    return "I'm having trouble connecting right now. Please try again in a moment. 🐾";
  }
};

const analyzeSymptoms = async (symptoms, petContext = null) => {
  try {
    if (!GEMINI_API_KEY) {
      return "Please configure your Gemini API key to use symptom analysis. 🏥";
    }
    
    const fullPrompt = `You are a veterinary assistant. Analyze these symptoms for a pet:
${petContext ? `Pet: ${petContext}\n` : ''}
Symptoms: ${symptoms}

Provide a helpful response with:
1. Possible causes (brief)
2. Home care recommendations
3. Red flags (when to see a vet immediately)

End with: "⚠️ This is AI advice. Always consult a veterinarian for professional medical care."`;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 600 }
      }
    );
    
    return response.data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error('Gemini analyze error:', error.message);
    return "I'm having trouble analyzing symptoms right now. Please try again or consult your veterinarian directly. 🏥";
  }
};

const getNutritionAdvice = async (petType, petName, age, weight) => {
  try {
    if (!GEMINI_API_KEY) {
      return "Please configure your Gemini API key to get nutrition advice. 🍽️";
    }
    
    const fullPrompt = `Provide friendly nutrition advice for a ${petType} named ${petName}:
Age: ${age || 'unknown'}
Weight: ${weight || 'unknown'}

Include:
- General feeding guidelines
- Healthy food options
- Foods to avoid
- Hydration tips

Make it helpful and encouraging. End with a note to consult vet for specific dietary needs.`;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
      }
    );
    
    return response.data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error('Gemini nutrition error:', error.message);
    return "I'm having trouble getting nutrition advice right now. Please try again. 🍽️";
  }
};

const getReportInsights = async (petName, feedingConsistency, healthIncidents, vaccinationsDue) => {
  try {
    if (!GEMINI_API_KEY) {
      return getFallbackReportResponse(petName, feedingConsistency, healthIncidents, vaccinationsDue);
    }
    
    const fullPrompt = `Generate a friendly weekly pet health report summary for ${petName}:
- Feeding consistency: ${feedingConsistency}%
- Health incidents this week: ${healthIncidents}
- Vaccinations due soon: ${vaccinationsDue}

Write a warm, encouraging summary. Use emojis. Keep it concise (2-3 sentences).`;
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 200 }
      }
    );
    
    return response.data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error('Gemini report error:', error.message);
    return getFallbackReportResponse(petName, feedingConsistency, healthIncidents, vaccinationsDue);
  }
};

// Fallback report response
const getFallbackReportResponse = (petName, feedingConsistency, healthIncidents, vaccinationsDue) => {
  let report = `📊 **Weekly Report for ${petName}**\n\n`;
  
  if (feedingConsistency >= 90) {
    report += `🐾 Great job! ${petName} had ${feedingConsistency}% feeding consistency this week. Keep up the excellent routine!\n\n`;
  } else if (feedingConsistency >= 70) {
    report += `🍽️ ${petName} had ${feedingConsistency}% feeding consistency. Try to stick to regular meal times for better digestion.\n\n`;
  } else {
    report += `⚠️ Feeding consistency was at ${feedingConsistency}%. Consider setting reminders for meal times.\n\n`;
  }
  
  if (healthIncidents === 0) {
    report += `❤️ Great news! No health incidents were recorded this week. ${petName} is doing well!\n\n`;
  } else {
    report += `🏥 There were ${healthIncidents} health incident(s) this week. Monitor ${petName} closely.\n\n`;
  }
  
  if (vaccinationsDue > 0) {
    report += `💉 Reminder: ${petName} has ${vaccinationsDue} vaccination(s) due soon.\n\n`;
  }
  
  report += `🌟 Keep up the great care! 🐾`;
  
  return report;
};

module.exports = {
  getAIResponse,
  analyzeSymptoms,
  getNutritionAdvice,
  getReportInsights,
};