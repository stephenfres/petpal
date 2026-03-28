module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
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
      allowNull: true,
      references: {
        model: 'pets',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM(
        'vaccination_reminder',
        'feeding_reminder',
        'vet_appointment',
        'health_alert',
        'weekly_report',
        'medication_reminder',
        'general'
      ),
      defaultValue: 'general',
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    scheduledFor: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actionUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    tableName: 'notifications',
    timestamps: true,
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId' });
    Notification.belongsTo(models.Pet, { foreignKey: 'petId' });
  };

  return Notification;
};