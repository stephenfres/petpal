// Free Mock AI Service - No OpenAI API key needed!
// Returns helpful pre-written responses based on keywords

const mockResponses = {
  // General health advice
  health: {
    en: {
      dog: "For your dog: Ensure regular exercise, balanced nutrition, and annual vet checkups. Watch for changes in appetite or behavior. Keep vaccinations up to date.",
      cat: "For your cat: Provide fresh water daily, clean litter box, and regular grooming. Cats hide illness well - watch for eating changes or lethargy.",
      bird: "For your bird: Maintain clean cage, fresh water, and varied diet. Ensure social interaction and mental stimulation with toys.",
      rabbit: "For your rabbit: Unlimited hay, fresh vegetables, and clean water. Rabbits need space to hop and hide. Watch for dental issues.",
      fish: "For your fish: Regular water changes, proper filtration, and don't overfeed. Monitor water temperature and pH levels.",
      general: "General pet care tips: Regular vet checkups, balanced diet, clean water, exercise, and lots of love! Watch for any behavior changes."
    },
    sw: {
      dog: "Kwa mbwa wako: Hakikisha mazoezi ya kawaida, lishe iliyolingana, na ukaguzi wa daktari wa mifugo kila mwaka.",
      cat: "Kwa paka wako: Toa maji safi kila siku, sanduku la choo safi, na kunyoa mara kwa mara.",
      general: "Vidokezo vya uangalizi wa mnyama: Ukaguzi wa daktari, lishe sawa, maji safi, mazoezi, na upendo!"
    },
    fr: {
      dog: "Pour votre chien: Exercice régulier, nutrition équilibrée et visites vétérinaires annuelles.",
      cat: "Pour votre chat: Eau fraîche quotidienne, litière propre et toilettage régulier.",
      general: "Conseils généraux: Visites vétérinaires régulières, alimentation équilibrée, eau propre et exercice!"
    }
  },
  
  // Nutrition advice
  nutrition: {
    en: {
      dog: "Feed high-quality dog food appropriate for age and size. Puppies need 3-4 meals/day, adults 2 meals. Avoid chocolate, grapes, onions, and xylitol.",
      cat: "Cats need high-protein, meat-based diet. Feed wet and dry food. Never feed dog food to cats - they need taurine.",
      bird: "Offer varied diet: quality pellets, fresh fruits, vegetables, and occasional seeds. Avoid avocado and chocolate.",
      rabbit: "80% hay, 15% fresh vegetables, 5% pellets. Unlimited fresh water. Introduce new foods slowly.",
      fish: "Feed small amounts 2-3 times daily. Only give what they can eat in 2-3 minutes. Remove uneaten food.",
      general: "Provide species-appropriate diet, fresh water always, and avoid overfeeding. Consult vet for specific dietary needs."
    }
  },

  // Symptom analysis (mock)
  symptoms: {
    en: {
      vomiting: "VOMITING: If occasional and pet seems normal, may be minor. If frequent, with blood, or with lethargy - SEE VET IMMEDIATELY. Remove food for 12 hours, offer small amounts of water.",
      diarrhea: "DIARRHEA: Ensure hydration. Bland diet (boiled chicken + rice) for 24 hours. If persists >24h, has blood, or with vomiting - SEE VET.",
      coughing: "COUGHING: May indicate kennel cough, heart issues, or allergies. If persistent, with fever, or breathing difficulty - SEE VET.",
      lethargy: "LETHARGY: If pet is unusually tired, not eating, or hiding - this is serious. SEE VET TODAY.",
      limping: "LIMPING: Check paw for injuries or foreign objects. Rest for 24-48 hours. If swelling, pain, or not improving - SEE VET.",
      scratching: "SCRATCHING: Check for fleas, ticks, or skin irritation. May need allergy treatment or parasite control.",
      general: "SYMPTOMS: Monitor your pet closely. If symptoms persist more than 24 hours, worsen, or include fever, vomiting, or lethargy - CONSULT VET IMMEDIATELY."
    }
  }
};

const getPetAdvice = async (prompt, language = 'en') => {
  console.log('🤖 Mock AI Request:', { prompt: prompt.substring(0, 50) + '...', language });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lowerPrompt = prompt.toLowerCase();
  let response = '';
  
  // Determine pet type from prompt
  let petType = 'general';
  if (lowerPrompt.includes('dog')) petType = 'dog';
  else if (lowerPrompt.includes('cat')) petType = 'cat';
  else if (lowerPrompt.includes('bird')) petType = 'bird';
  else if (lowerPrompt.includes('rabbit')) petType = 'rabbit';
  else if (lowerPrompt.includes('fish')) petType = 'fish';
  
  // Check for symptoms in prompt
  if (lowerPrompt.includes('symptom') || lowerPrompt.includes('sick') || lowerPrompt.includes('not feeling')) {
    if (lowerPrompt.includes('vomit')) response = mockResponses.symptoms.en.vomiting;
    else if (lowerPrompt.includes('diarrhea') || lowerPrompt.includes('poop')) response = mockResponses.symptoms.en.diarrhea;
    else if (lowerPrompt.includes('cough')) response = mockResponses.symptoms.en.coughing;
    else if (lowerPrompt.includes('tired') || lowerPrompt.includes('lazy') || lowerPrompt.includes('sleepy')) response = mockResponses.symptoms.en.lethargy;
    else if (lowerPrompt.includes('limping') || lowerPrompt.includes('leg') || lowerPrompt.includes('walk')) response = mockResponses.symptoms.en.limping;
    else if (lowerPrompt.includes('scratch') || lowerPrompt.includes('itch')) response = mockResponses.symptoms.en.scratching;
    else response = mockResponses.symptoms.en.general;
  }
  // Check for nutrition/food questions
  else if (lowerPrompt.includes('food') || lowerPrompt.includes('feed') || lowerPrompt.includes('eat') || lowerPrompt.includes('diet') || lowerPrompt.includes('nutrition')) {
    const langResponses = mockResponses.nutrition[language] || mockResponses.nutrition.en;
    response = langResponses[petType] || langResponses.general;
  }
  // Default health advice
  else {
    const langResponses = mockResponses.health[language] || mockResponses.health.en;
    response = langResponses[petType] || langResponses.general;
  }
  
  // Add personalized touch
  const greetings = {
    en: "Here's my advice for you:\n\n",
    sw: "Hapa ni ushauri wangu:\n\n",
    fr: "Voici mes conseils:\n\n"
  };
  
  console.log('✅ Mock AI Response generated');
  return (greetings[language] || greetings.en) + response + "\n\n💡 Remember: I'm an AI assistant. For serious concerns, always consult a real veterinarian!";
};

const analyzePetSymptoms = async (symptoms, petType, language = 'en') => {
  const prompt = `Pet Type: ${petType}\nSymptoms: ${symptoms}`;
  return await getPetAdvice(prompt, language);
};

module.exports = { getPetAdvice, analyzePetSymptoms };