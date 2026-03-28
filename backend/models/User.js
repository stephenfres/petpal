const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
        isAlphanumericWithUnderscore(value) {
          if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            throw new Error('Username can only contain letters, numbers, and underscores');
          }
        },
      },
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [12, 255],
        isComplex(value) {
          if (!/[A-Z]/.test(value)) {
            throw new Error('Password must contain at least one uppercase letter');
          }
          if (!/[a-z]/.test(value)) {
            throw new Error('Password must contain at least one lowercase letter');
          }
          if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
            throw new Error('Password must contain at least one special character');
          }
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preferredLanguage: {
      type: DataTypes.ENUM('en', 'sw', 'fr'),
      defaultValue: 'en',
    },
    fcmToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notificationMethod: {
      type: DataTypes.ENUM('push', 'email', 'both', 'none'),
      defaultValue: 'push',
    },
    locationLongitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    locationLatitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    acceptTerms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    termsAcceptedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
        if (user.acceptTerms) {
          user.termsAcceptedAt = new Date();
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  });

  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  return User;
};