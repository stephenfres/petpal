module.exports = (sequelize, DataTypes) => {
  const Pet = sequelize.define('Pet', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish', 'reptile', 'other'),
      allowNull: false,
    },
    breed: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'unknown'),
      defaultValue: 'unknown',
    },
    weightValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    weightUnit: {
      type: DataTypes.ENUM('kg', 'lbs'),
      defaultValue: 'kg',
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    microchipId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    medicalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'pets',
    timestamps: true,
  });

  // Virtual field for age
  Pet.prototype.getAge = function() {
    if (!this.dateOfBirth) return null;
    const diff = Date.now() - new Date(this.dateOfBirth).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  return Pet;
};