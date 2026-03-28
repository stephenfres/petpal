module.exports = (sequelize, DataTypes) => {
  const WeeklyReport = sequelize.define('WeeklyReport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    petId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'pets',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    weekStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    weekEnd: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    summary: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {
        feedingConsistency: 0,
        healthIncidents: 0,
        vaccinationsDue: 0,
        medicationsGiven: 0,
      },
    },
    aiInsights: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    generatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'weekly_reports',
    timestamps: true,
  });

  WeeklyReport.associate = (models) => {
    WeeklyReport.belongsTo(models.User, { foreignKey: 'userId' });
    WeeklyReport.belongsTo(models.Pet, { foreignKey: 'petId' });
  };

  return WeeklyReport;
};