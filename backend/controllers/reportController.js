const { WeeklyReport, Pet, User, FeedingSchedule, HealthRecord, Vaccination } = require('../models');
const { Op } = require('sequelize');
const { getReportInsights } = require('../services/aiService');

// Generate a new weekly report
exports.generateReport = async (req, res, next) => {
  try {
    const { petId } = req.body;
    const userId = req.user.id;

    console.log('Generating report for pet:', petId, 'user:', userId);

    // Verify pet belongs to user
    const pet = await Pet.findOne({
      where: { id: petId, ownerId: userId },
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    // Calculate week start and end (current week)
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
    weekEnd.setHours(23, 59, 59, 999);

    console.log('Week range:', weekStart, 'to', weekEnd);

    // Check if report already exists for this week
    const existingReport = await WeeklyReport.findOne({
      where: {
        petId,
        weekStart: {
          [Op.between]: [weekStart, weekEnd],
        },
      },
    });

    if (existingReport) {
      return res.json({
        success: true,
        message: 'Report already exists for this week',
        data: existingReport,
      });
    }

    // Fetch data for summary
    const feedingSchedules = await FeedingSchedule.findAll({
      where: {
        petId,
        createdAt: {
          [Op.between]: [weekStart, weekEnd],
        },
      },
    });

    const healthRecords = await HealthRecord.findAll({
      where: {
        petId,
        date: {
          [Op.between]: [weekStart, weekEnd],
        },
      },
    });

    const vaccinations = await Vaccination.findAll({
      where: {
        petId,
        nextDueDate: {
          [Op.between]: [weekStart, weekEnd],
        },
      },
    });

    console.log('Feeding schedules:', feedingSchedules.length);
    console.log('Health records:', healthRecords.length);
    console.log('Vaccinations:', vaccinations.length);

    // Calculate summary
    const totalFeedings = feedingSchedules.length;
    const completedFeedings = feedingSchedules.filter(f => f.completed).length;
    const feedingConsistency = totalFeedings > 0 ? Math.round((completedFeedings / totalFeedings) * 100) : 100;

    const healthIncidents = healthRecords.length;
    const vaccinationsDue = vaccinations.length;
    const medicationsGiven = 0; // You can calculate from medication records if you have them

    // Generate AI insights using Gemini
    const aiInsights = await getReportInsights(pet.name, feedingConsistency, healthIncidents, vaccinationsDue);

    // Create report
    const report = await WeeklyReport.create({
      userId,
      petId,
      weekStart,
      weekEnd,
      summary: {
        feedingConsistency,
        healthIncidents,
        vaccinationsDue,
        medicationsGiven,
      },
      aiInsights,
      generatedAt: new Date(),
    });

    console.log('Report created successfully:', report.id);

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Generate report error:', error);
    next(error);
  }
};

// Get all reports for a pet
exports.getReports = async (req, res, next) => {
  try {
    const { petId } = req.query;
    const userId = req.user.id;

    if (!petId) {
      return res.status(400).json({
        success: false,
        message: 'Pet ID is required',
      });
    }

    // Verify pet belongs to user
    const pet = await Pet.findOne({
      where: { id: petId, ownerId: userId },
    });

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    const reports = await WeeklyReport.findAll({
      where: { petId },
      order: [['weekStart', 'DESC']],
    });

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error('Get reports error:', error);
    next(error);
  }
};

// Get a single report by ID
exports.getReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const report = await WeeklyReport.findOne({
      where: { id },
      include: [
        { model: Pet, as: 'pet', attributes: ['name', 'type', 'breed'] },
      ],
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // Verify report belongs to user
    if (report.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Get report error:', error);
    next(error);
  }
};

// Delete a report
exports.deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const report = await WeeklyReport.findOne({
      where: { id },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    if (report.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await report.destroy();

    res.json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error) {
    console.error('Delete report error:', error);
    next(error);
  }
};