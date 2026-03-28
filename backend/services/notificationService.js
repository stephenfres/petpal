const { Notification, User, Pet } = require('../models');
const { sendPushNotification, sendEmailNotification } = require('../utils/notificationSender');

class NotificationService {
  // Create a new notification
  static async createNotification(data) {
    try {
      const notification = await Notification.create({
        userId: data.userId,
        petId: data.petId || null,
        type: data.type,
        title: data.title,
        message: data.message,
        scheduledFor: data.scheduledFor || null,
        actionUrl: data.actionUrl || null,
        metadata: data.metadata || {},
      });
      
      // If no scheduled date, send immediately
      if (!data.scheduledFor) {
        await this.sendNotification(notification);
      }
      
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
  
  // Send a notification (push or email based on user preference)
  static async sendNotification(notification) {
    try {
      const user = await User.findByPk(notification.userId);
      if (!user) return;
      
      // Get user's notification preference from settings
      const notificationMethod = user.notificationMethod || 'push'; // push, email, both
      
      let success = false;
      
      // Send based on user preference
      if (notificationMethod === 'push' || notificationMethod === 'both') {
        if (user.fcmToken) {
          success = await sendPushNotification(user.fcmToken, {
            title: notification.title,
            body: notification.message,
            data: {
              type: notification.type,
              notificationId: notification.id,
              actionUrl: notification.actionUrl || '',
              petId: notification.petId || '',
            },
          });
        }
      }
      
      if (notificationMethod === 'email' || notificationMethod === 'both') {
        if (user.email) {
          success = await sendEmailNotification(user.email, {
            subject: notification.title,
            message: notification.message,
            actionUrl: notification.actionUrl,
          });
        }
      }
      
      // Update notification status
      await notification.update({
        isSent: true,
        sentAt: new Date(),
      });
      
      return success;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }
  
  // Get user's notifications
  static async getUserNotifications(userId, limit = 50, offset = 0) {
    try {
      const { rows, count } = await Notification.findAndCountAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });
      
      return {
        notifications: rows,
        total: count,
        unreadCount: rows.filter(n => !n.isRead).length,
      };
    } catch (error) {
      console.error('Error getting notifications:', error);
      throw error;
    }
  }
  
  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, userId },
      });
      
      if (notification && !notification.isRead) {
        await notification.update({
          isRead: true,
          readAt: new Date(),
        });
      }
      
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
  
  // Mark all as read
  static async markAllAsRead(userId) {
    try {
      await Notification.update(
        { isRead: true, readAt: new Date() },
        { where: { userId, isRead: false } }
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }
  
  // Delete notification
  static async deleteNotification(notificationId, userId) {
    try {
      const deleted = await Notification.destroy({
        where: { id: notificationId, userId },
      });
      return deleted > 0;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
  
  // Send scheduled notifications (run by cron job)
  static async sendScheduledNotifications() {
    try {
      const now = new Date();
      const notifications = await Notification.findAll({
        where: {
          scheduledFor: { [Op.lte]: now },
          isSent: false,
        },
        include: [{ model: User }],
      });
      
      for (const notification of notifications) {
        await this.sendNotification(notification);
      }
      
      return notifications.length;
    } catch (error) {
      console.error('Error sending scheduled notifications:', error);
      throw error;
    }
  }
  
  // Create vaccination reminder
  static async createVaccinationReminder(userId, petId, petName, vaccineName, dueDate) {
    const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
    let message = '';
    
    if (daysUntil === 7) {
      message = `Reminder: ${petName}'s ${vaccineName} vaccine is due in 7 days. Schedule with your vet!`;
    } else if (daysUntil === 3) {
      message = `⚠️ ${petName}'s ${vaccineName} vaccine is due in 3 days. Don't forget to book an appointment!`;
    } else if (daysUntil === 1) {
      message = `🔔 URGENT: ${petName}'s ${vaccineName} vaccine is due TOMORROW! Please schedule immediately.`;
    } else if (daysUntil === 0) {
      message = `🚨 ${petName}'s ${vaccineName} vaccine is due TODAY! Please visit your vet.`;
    } else {
      return;
    }
    
    await this.createNotification({
      userId,
      petId,
      type: 'vaccination_reminder',
      title: `💉 Vaccination Reminder: ${petName}`,
      message,
      actionUrl: `/vaccinations/${petId}`,
      metadata: { vaccineName, dueDate },
    });
  }
  
  // Create feeding reminder
  static async createFeedingReminder(userId, petId, petName, mealTime) {
    await this.createNotification({
      userId,
      petId,
      type: 'feeding_reminder',
      title: `🍽️ Time to Feed ${petName}!`,
      message: `It's ${mealTime} - time to feed ${petName}. Don't forget!`,
      actionUrl: `/feeding/${petId}`,
      metadata: { mealTime },
    });
  }
  
  // Create weekly report
  static async createWeeklyReport(userId, reportData) {
    await this.createNotification({
      userId,
      type: 'weekly_report',
      title: '📊 Your Weekly Pet Health Report',
      message: `Your weekly report is ready! ${reportData.summary}`,
      actionUrl: '/reports',
      metadata: reportData,
    });
  }
}

module.exports = NotificationService;