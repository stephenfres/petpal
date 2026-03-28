module.exports = (sequelize, DataTypes) => {
  const FeedingSchedule = sequelize.define('FeedingSchedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    petId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pets',
        key: 'id',
      },
    },
    mealName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foodType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amountValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    amountUnit: {
      type: DataTypes.STRING,
      defaultValue: 'cups',
    },
    scheduleTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    frequency: {
      type: DataTypes.ENUM('daily', 'twice_daily', 'three_times', 'weekly'),
      defaultValue: 'daily',
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lastFed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'feeding_schedules',
    timestamps: true,
  });

  return FeedingSchedule;
};