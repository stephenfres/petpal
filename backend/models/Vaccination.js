module.exports = (sequelize, DataTypes) => {
  const Vaccination = sequelize.define('Vaccination', {
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
    vaccineName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disease: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateAdministered: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    nextDueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    vetName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clinicName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    batchNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'vaccinations',
    timestamps: true,
  });

  return Vaccination;
};