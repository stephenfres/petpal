const WeeklyReport = require('../models/WeeklyReport');
const FeedingSchedule = require('../models/FeedingSchedule');
const HealthRecord = require('../models/HealthRecord');
const Vaccination = require('../models/Vaccination');
const { getWeekBounds } = require('../utils/dateHelpers');
const { generateWeeklyInsights } = require('./aiService');

const generateWeeklyReport = async (userId, petId, language = 'en') => {
  const { weekStart, weekEnd } = getWeekBounds();

  const feedingSchedules = await FeedingSchedule.find({ pet: petId });
  const healthRecords = await HealthRecord.find({
    pet: petId,
    date: { $gte: weekStart, $lte: weekEnd },
  });
  
  const vaccinationsDue = await Vaccination.find({
    pet: petId,
    nextDueDate: { $lte: weekEnd },
  });

  const mealsLogged = feedingSchedules.reduce((acc, schedule) => {
    return acc + (schedule.lastFed && schedule.lastFed >= weekStart ? 1 : 0);
  }, 0);

  const totalMeals = feedingSchedules.length * 7;

  const petData = {
    feedingSchedules: feedingSchedules.length,
    mealsLogged,
    totalMeals,
  };

  const healthData = healthRecords.map(record => ({
    type: record.type,
    date: record.date,
  }));

  const aiInsights = await generateWeeklyInsights(petData, healthData, language);

  const report = await WeeklyReport.create({
    user: userId,
    pet: petId,
    weekStart,
    weekEnd,
    summary: {
      feedingConsistency: Math.round((mealsLogged / totalMeals) * 100) || 0,
      healthIncidents: healthRecords.length,
      vaccinationsDue: vaccinationsDue.length,
      medicationsGiven: healthRecords.filter(r => r.medications?.length > 0).length,
    },
    details: {
      mealsLogged,
      totalMeals,
      healthRecords: healthRecords.map(r => r._id),
      notes: '',
    },
    aiInsights,
  });

  return report;
};

module.exports = {
  generateWeeklyReport,
};