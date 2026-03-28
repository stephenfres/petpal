// Get sequelize instance
const { sequelize } = require('../config/db');
const DataTypes = require('sequelize').DataTypes;

// Lazy load models to avoid circular dependency issues
const getModels = () => {
  const FeedingSchedule = require('../models/FeedingSchedule')(sequelize, DataTypes);
  const Pet = require('../models/Pet')(sequelize, DataTypes);
  return { FeedingSchedule, Pet };
};

exports.getSchedules = async (req, res, next) => {
  try {
    const { FeedingSchedule, Pet } = getModels();
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

    const schedules = await FeedingSchedule.findAll({ 
      where: { 
        petId: petId, 
        isActive: true 
      } 
    });

    res.json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

exports.createSchedule = async (req, res, next) => {
  try {
    const { FeedingSchedule, Pet } = getModels();
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

    const scheduleData = {
      petId: parseInt(petId),
      mealName: req.body.mealName,
      foodType: req.body.foodType,
      amountValue: req.body.amount?.value ? parseFloat(req.body.amount.value) : null,
      amountUnit: req.body.amount?.unit || 'cups',
      scheduleTime: req.body.scheduleTime,
      frequency: req.body.frequency || 'daily',
      instructions: req.body.instructions || null,
      isActive: true,
    };

    const schedule = await FeedingSchedule.create(scheduleData);

    res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error('CREATE SCHEDULE ERROR:', error);
    next(error);
  }
};

exports.updateSchedule = async (req, res, next) => {
  try {
    const { FeedingSchedule, Pet } = getModels();
    const schedule = await FeedingSchedule.findOne({
      where: { id: req.params.id }
    });
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    const pet = await Pet.findOne({
      where: { id: schedule.petId, ownerId: req.user.id }
    });
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    const updateData = {
      mealName: req.body.mealName,
      foodType: req.body.foodType,
      amountValue: req.body.amount?.value ? parseFloat(req.body.amount.value) : schedule.amountValue,
      amountUnit: req.body.amount?.unit || schedule.amountUnit,
      scheduleTime: req.body.scheduleTime,
      frequency: req.body.frequency,
      instructions: req.body.instructions,
    };

    await schedule.update(updateData);

    res.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteSchedule = async (req, res, next) => {
  try {
    const { FeedingSchedule, Pet } = getModels();
    const schedule = await FeedingSchedule.findOne({
      where: { id: req.params.id }
    });
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    const pet = await Pet.findOne({
      where: { id: schedule.petId, ownerId: req.user.id }
    });
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    schedule.isActive = false;
    await schedule.save();

    res.json({
      success: true,
      message: 'Schedule deleted',
    });
  } catch (error) {
    next(error);
  }
};

exports.markAsFed = async (req, res, next) => {
  try {
    const { FeedingSchedule, Pet } = getModels();
    const schedule = await FeedingSchedule.findOne({
      where: { id: req.params.id }
    });
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    const pet = await Pet.findOne({
      where: { id: schedule.petId, ownerId: req.user.id }
    });
    
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    schedule.lastFed = new Date();
    await schedule.save();

    res.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};