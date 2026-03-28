const Pet = require('../models/Pet')(require('../config/db').sequelize, require('sequelize').DataTypes);

exports.getAllPets = async (req, res, next) => {
  try {
    const pets = await Pet.findAll({ 
      where: { 
        ownerId: req.user.id,
        isActive: true 
      } 
    });
    res.json({
      success: true,
      count: pets.length,
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPet = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    res.json({
      success: true,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

exports.createPet = async (req, res, next) => {
  try {
    console.log('=== CREATE PET ===');
    console.log('User:', req.user?.id);
    console.log('Body:', req.body);
    
    // Clean up empty strings and invalid dates to null
    const cleanData = {
      ...req.body,
      ownerId: req.user.id,
      name: req.body.name?.trim(),
      type: req.body.type,
      breed: req.body.breed?.trim() || null,
      // Handle invalid dates
      dateOfBirth: req.body.dateOfBirth && req.body.dateOfBirth !== 'Invalid date' 
        ? new Date(req.body.dateOfBirth) 
        : null,
      gender: req.body.gender || 'unknown',
      // Parse weight as float
      weightValue: req.body.weightValue && !isNaN(req.body.weightValue) 
        ? parseFloat(req.body.weightValue) 
        : null,
      weightUnit: req.body.weightUnit || 'kg',
      color: req.body.color?.trim() || null,
      microchipId: req.body.microchipId?.trim() || null,
      medicalNotes: req.body.medicalNotes?.trim() || null,
      imageUrl: req.body.imageUrl?.trim() || null,
    };

    // Validate required fields
    if (!cleanData.name || !cleanData.type) {
      return res.status(400).json({
        success: false,
        message: 'Name and type are required',
      });
    }
    
    const pet = await Pet.create(cleanData);
    console.log('Pet created:', pet.id);

    res.status(201).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    console.error('CREATE PET ERROR:', error);
    next(error);
  }
};

exports.updatePet = async (req, res, next) => {
  try {
    let pet = await Pet.findOne({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    await pet.update(req.body);

    res.json({
      success: true,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findOne({
      where: {
        id: req.params.id,
        ownerId: req.user.id,
      },
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    pet.isActive = false;
    await pet.save();

    res.json({
      success: true,
      message: 'Pet removed',
    });
  } catch (error) {
    next(error);
  }
};