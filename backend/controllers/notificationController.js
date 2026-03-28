const NotificationService = require('../services/notificationService');

// Get user's notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const notifications = await NotificationService.getUserNotifications(
      req.user.id,
      parseInt(limit),
      parseInt(offset)
    );
    
    res.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await NotificationService.markAsRead(
      req.params.id,
      req.user.id
    );
    
    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
  try {
    await NotificationService.markAllAsRead(req.user.id);
    
    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const deleted = await NotificationService.deleteNotification(
      req.params.id,
      req.user.id
    );
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    next(error);
  }
};