const { getAIResponse, analyzeSymptoms, getNutritionAdvice } = require('../services/aiService');
const { Pet } = require('../models');

// Get AI advice
exports.getAdvice = async (req, res, next) => {
  try {
    const { question, petId } = req.body;
    let petContext = null;
    
    if (petId) {
      const pet = await Pet.findByPk(petId);
      if (pet) {
        petContext = `${pet.name} (${pet.type})`;
        if (pet.age) petContext += `, ${pet.age} years old`;
        if (pet.weight?.value) petContext += `, ${pet.weight.value}${pet.weight.unit}`;
      }
    }
    
    const advice = await getAIResponse(question, petContext);
    
    res.json({
      success: true,
      data: { advice },
    });
  } catch (error) {
    console.error('Get advice error:', error);
    next(error);
  }
};

// Analyze symptoms
exports.analyzeSymptoms = async (req, res, next) => {
  try {
    const { symptoms, petId } = req.body;
    let petContext = null;
    
    if (petId) {
      const pet = await Pet.findByPk(petId);
      if (pet) {
        petContext = `${pet.name} (${pet.type})`;
      }
    }
    
    const analysis = await analyzeSymptoms(symptoms, petContext);
    
    res.json({
      success: true,
      data: { analysis },
    });
  } catch (error) {
    console.error('Analyze symptoms error:', error);
    next(error);
  }
};

// Get nutrition advice
exports.getNutritionAdvice = async (req, res, next) => {
  try {
    const { petId } = req.body;
    
    if (!petId) {
      return res.status(400).json({
        success: false,
        message: 'Pet ID is required',
      });
    }
    
    const pet = await Pet.findByPk(petId);
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }
    
    const advice = await getNutritionAdvice(
      pet.type,
      pet.name,
      pet.age,
      pet.weight?.value
    );
    
    res.json({
      success: true,
      data: { advice },
    });
  } catch (error) {
    console.error('Nutrition advice error:', error);
    next(error);
  }
};