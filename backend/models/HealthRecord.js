module.exports = (sequelize, DataTypes) => {
  const HealthRecord = sequelize.define('HealthRecord', {
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
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    type: {
      type: DataTypes.ENUM('checkup', 'illness', 'injury', 'surgery', 'dental', 'grooming', 'other'),
      allowNull: false,
    },
    symptoms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    diagnosis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    treatment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    medications: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    vetName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clinicName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    followUpDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  }, {
    tableName: 'health_records',
    timestamps: true,
  });

  return HealthRecord;
};