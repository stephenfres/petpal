const { sequelize } = require('../config/db');
const DataTypes = require('sequelize').DataTypes;

const HealthRecord = require('../models/HealthRecord')(sequelize, DataTypes);
const Pet = require('../models/Pet')(sequelize, DataTypes);

exports.getHealthRecords = async (req, res, next) => {
  try {
    const { petId } = req.query;
    
    // Verify pet exists and belongs to user
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

    // Get health records for this pet
    const records = await HealthRecord.findAll({
      where: { petId: petId },
      order: [['date', 'DESC']],
    });

    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

exports.createHealthRecord = async (req, res, next) => {
  try {
    const { petId } = req.body;
    
    // Verify pet exists and belongs to user
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

    const recordData = {
      petId: parseInt(petId),
      date: req.body.date || new Date(),
      type: req.body.type,
      description: req.body.description,
      symptoms: req.body.symptoms || null,
      diagnosis: req.body.diagnosis || null,
      treatment: req.body.treatment || null,
      prescribedMedication: req.body.prescribedMedication || null,
      vetName: req.body.vetName || null,
      vetContact: req.body.vetContact || null,
      notes: req.body.notes || null,
    };

    const record = await HealthRecord.create(recordData);

    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error('CREATE HEALTH RECORD ERROR:', error);
    next(error);
  }
};

exports.updateHealthRecord = async (req, res, next) => {
  try {
    // Find the record
    const record = await HealthRecord.findOne({
      where: { id: req.params.id }
    });
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Verify pet belongs to user
    const pet = await Pet.findOne({
      where: { id: record.petId, ownerId: req.user.id }
    });
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    const updateData = {
      date: req.body.date,
      type: req.body.type,
      description: req.body.description,
      symptoms: req.body.symptoms,
      diagnosis: req.body.diagnosis,
      treatment: req.body.treatment,
      prescribedMedication: req.body.prescribedMedication,
      vetName: req.body.vetName,
      vetContact: req.body.vetContact,
      notes: req.body.notes,
    };

    await record.update(updateData);

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteHealthRecord = async (req, res, next) => {
  try {
    // Find the record
    const record = await HealthRecord.findOne({
      where: { id: req.params.id }
    });
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    // Verify pet belongs to user
    const pet = await Pet.findOne({
      where: { id: record.petId, ownerId: req.user.id }
    });
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
      });
    }

    await record.destroy();

    res.json({
      success: true,
      message: 'Record deleted',
    });
  } catch (error) {
    next(error);
  }
};