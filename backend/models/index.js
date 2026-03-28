const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

// Import all models
const User = require('./User')(sequelize, DataTypes);
const Pet = require('./Pet')(sequelize, DataTypes);
const HealthRecord = require('./HealthRecord')(sequelize, DataTypes);
const FeedingSchedule = require('./FeedingSchedule')(sequelize, DataTypes);
const Vaccination = require('./Vaccination')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);
const WeeklyReport = require('./WeeklyReport')(sequelize, DataTypes);
const VetLocation = require('./VetLocation')(sequelize, DataTypes);

// Define associations
User.hasMany(Pet, { foreignKey: 'ownerId', as: 'pets' });
Pet.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Pet.hasMany(HealthRecord, { foreignKey: 'petId', as: 'healthRecords' });
HealthRecord.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

Pet.hasMany(FeedingSchedule, { foreignKey: 'petId', as: 'feedingSchedules' });
FeedingSchedule.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

Pet.hasMany(Vaccination, { foreignKey: 'petId', as: 'vaccinations' });
Vaccination.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Notification.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

User.hasMany(WeeklyReport, { foreignKey: 'userId', as: 'weeklyReports' });
WeeklyReport.belongsTo(User, { foreignKey: 'userId', as: 'user' });
WeeklyReport.belongsTo(Pet, { foreignKey: 'petId', as: 'pet' });

// VetLocation associations (if needed)
// VetLocation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// User.hasMany(VetLocation, { foreignKey: 'userId', as: 'vetLocations' });

module.exports = {
  sequelize,
  User,
  Pet,
  HealthRecord,
  FeedingSchedule,
  Vaccination,
  Notification,
  WeeklyReport,
  VetLocation,
};