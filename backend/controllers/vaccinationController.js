const { sequelize } = require('../config/db');
const { Op } = require('sequelize');
const DataTypes = require('sequelize').DataTypes;

const Vaccination = require('../models/Vaccination')(sequelize, DataTypes);
const Pet = require('../models/Pet')(sequelize, DataTypes);

exports.getVaccinations = async (req, res, next) => {
  try {
    const { petId } = req.query;
    
    const pet = await Pet.findOne({ 
      where: { 
        id: petId, 
        ownerId: req.user.id 
      } 
    });
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    const vaccinations = await Vaccination.findAll({
      where: { petId: petId, isActive: true },
      order: [['nextDueDate', 'ASC']],
    });

    res.json({
      success: true,
      count: vaccinations.length,
      data: vaccinations,
    });
  } catch (error) {
    next(error);
  }
};

// Get upcoming vaccinations for dashboard
exports.getUpcomingVaccinations = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);
    
    // Get all pets owned by user
    const pets = await Pet.findAll({
      where: { ownerId: userId, isActive: true },
      attributes: ['id', 'name'],
    });
    
    const petIds = pets.map(pet => pet.id);
    
    if (petIds.length === 0) {
      return res.json({
        success: true,
        data: {
          total: 0,
          completed: 0,
          due: [],
        },
      });
    }
    
    // Get all vaccinations for user's pets
    const allVaccinations = await Vaccination.findAll({
      where: { 
        petId: { [Op.in]: petIds },
        isActive: true,
      },
      include: [{ model: Pet, attributes: ['name'] }],
    });
    
    const total = allVaccinations.length;
    const completed = allVaccinations.filter(v => v.status === 'completed').length;
    
    // Get upcoming vaccinations (due in next 30 days)
    const upcomingVaccinations = allVaccinations.filter(v => {
      if (v.status === 'completed') return false;
      if (!v.nextDueDate) return false;
      const dueDate = new Date(v.nextDueDate);
      return dueDate >= today && dueDate <= nextMonth;
    });
    
    const due = upcomingVaccinations.map(v => ({
      id: v.id,
      petName: v.Pet?.name || 'Unknown Pet',
      vaccineName: v.vaccineName,
      dueDate: v.nextDueDate,
      daysUntil: Math.ceil((new Date(v.nextDueDate) - today) / (1000 * 60 * 60 * 24)),
    })).sort((a, b) => a.daysUntil - b.daysUntil);
    
    res.json({
      success: true,
      data: {
        total,
        completed,
        due,
      },
    });
  } catch (error) {
    console.error('Get upcoming vaccinations error:', error);
    next(error);
  }
};

exports.createVaccination = async (req, res, next) => {
  try {
    const { petId } = req.body;
    
    const pet = await Pet.findOne({ 
      where: { 
        id: parseInt(petId), 
        ownerId: req.user.id 
      } 
    });
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    const vaccinationData = {
      petId: parseInt(petId),
      vaccineName: req.body.vaccineName,
      disease: req.body.disease,
      dateAdministered: req.body.dateAdministered,
      nextDueDate: req.body.nextDueDate || null,
      vetName: req.body.vetName || null,
      clinicName: req.body.clinicName || null,
      batchNumber: req.body.batchNumber || null,
      notes: req.body.notes || null,
      status: req.body.status || 'scheduled',
      isActive: true,
    };

    const vaccination = await Vaccination.create(vaccinationData);

    res.status(201).json({
      success: true,
      data: vaccination,
    });
  } catch (error) {
    console.error('CREATE VACCINATION ERROR:', error);
    next(error);
  }
};

exports.updateVaccination = async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findOne({
      where: { id: req.params.id }
    });
    
    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination not found',
      });
    }

    const pet = await Pet.findOne({
      where: { id: vaccination.petId, ownerId: req.user.id }
    });
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination not found',
      });
    }

    const updateData = {
      vaccineName: req.body.vaccineName,
      disease: req.body.disease,
      dateAdministered: req.body.dateAdministered,
      nextDueDate: req.body.nextDueDate,
      vetName: req.body.vetName,
      clinicName: req.body.clinicName,
      batchNumber: req.body.batchNumber,
      notes: req.body.notes,
      status: req.body.status,
    };

    await vaccination.update(updateData);

    res.json({
      success: true,
      data: vaccination,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteVaccination = async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findOne({
      where: { id: req.params.id }
    });
    
    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination not found',
      });
    }

    const pet = await Pet.findOne({
      where: { id: vaccination.petId, ownerId: req.user.id }
    });
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination not found',
      });
    }

    vaccination.isActive = false;
    await vaccination.save();

    res.json({
      success: true,
      message: 'Vaccination deleted',
    });
  } catch (error) {
    next(error);
  }
};