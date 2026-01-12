// Notification Preferences Utility
// Helper functions to manage and check notification settings across the app

/**
 * Get all notification preferences from localStorage
 * @returns {Object} notification preferences object
 */
export const getNotificationPreferences = () => {
  const saved = localStorage.getItem("fintrack_notifications");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Error parsing notification preferences:", error);
      return getDefaultNotificationPreferences();
    }
  }
  return getDefaultNotificationPreferences();
};

/**
 * Get default notification preferences
 * @returns {Object} default notification settings
 */
export const getDefaultNotificationPreferences = () => {
  return {
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    paymentReminders: true,
    savingsGoalsUpdates: true,
  };
};

/**
 * Check if a specific notification type is enabled
 * @param {string} notificationType - Type of notification to check
 * @returns {boolean} true if enabled, false otherwise
 */
export const isNotificationEnabled = (notificationType) => {
  const preferences = getNotificationPreferences();
  return preferences[notificationType] === true;
};

/**
 * Save notification preferences to localStorage
 * @param {Object} preferences - Notification preferences object
 * @returns {boolean} true if saved successfully, false otherwise
 */
export const saveNotificationPreferences = (preferences) => {
  try {
    localStorage.setItem("fintrack_notifications", JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error("Error saving notification preferences:", error);
    return false;
  }
};

/**
 * Show notification based on user preferences
 * @param {string} type - Type of notification (budgetAlerts, paymentReminders, savingsGoalsUpdates)
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {Object} options - Additional notification options
 */
export const showNotification = (type, title, message, options = {}) => {
  // Check if notifications are enabled
  if (!isNotificationEnabled("pushNotifications")) {
    console.log("Push notifications are disabled");
    return;
  }

  // Check if specific notification type is enabled
  if (!isNotificationEnabled(type)) {
    console.log(`${type} notifications are disabled`);
    return;
  }

  // Check if browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return;
  }

  // Check notification permission
  if (Notification.permission === "granted") {
    // Create notification
    new Notification(title, {
      body: message,
      icon: "/logo.png", // Update with your app icon path
      badge: "/badge.png", // Update with your badge icon path
      ...options,
    });
  } else if (Notification.permission !== "denied") {
    // Request permission
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, {
          body: message,
          icon: "/logo.png",
          badge: "/badge.png",
          ...options,
        });
      }
    });
  }
};

/**
 * Show budget alert notification
 * @param {string} category - Budget category
 * @param {number} spent - Amount spent
 * @param {number} budget - Budget limit
 * @param {number} percentage - Percentage used
 */
export const showBudgetAlert = (category, spent, budget, percentage) => {
  if (!isNotificationEnabled("budgetAlerts")) return;

  let title = "Budget Alert";
  let message = "";

  if (percentage >= 100) {
    title = "⚠️ Budget Exceeded!";
    message = `You've exceeded your ${category} budget! Spent $${spent.toFixed(2)} of $${budget.toFixed(2)}`;
  } else if (percentage >= 90) {
    title = "⚠️ Budget Warning";
    message = `You've used ${percentage}% of your ${category} budget ($${spent.toFixed(2)} of $${budget.toFixed(2)})`;
  } else if (percentage >= 75) {
    title = "📊 Budget Notice";
    message = `You've used ${percentage}% of your ${category} budget`;
  }

  if (message) {
    showNotification("budgetAlerts", title, message, {
      tag: `budget-${category}`,
      requireInteraction: percentage >= 100,
    });
  }
};

/**
 * Show savings goal update notification
 * @param {string} goalName - Name of the savings goal
 * @param {number} current - Current saved amount
 * @param {number} target - Target amount
 * @param {number} percentage - Percentage completed
 */
export const showSavingsGoalUpdate = (goalName, current, target, percentage) => {
  if (!isNotificationEnabled("savingsGoalsUpdates")) return;

  let title = "";
  let message = "";

  if (percentage >= 100) {
    title = "🎉 Goal Achieved!";
    message = `Congratulations! You've reached your ${goalName} goal of $${target.toFixed(2)}!`;
  } else if (percentage >= 75) {
    title = "🎯 Almost There!";
    message = `You're ${percentage}% of the way to your ${goalName} goal! $${(target - current).toFixed(2)} to go!`;
  } else if (percentage >= 50) {
    title = "💪 Halfway There!";
    message = `You've saved 50% toward your ${goalName} goal!`;
  } else if (percentage >= 25) {
    title = "📈 Great Progress!";
    message = `You've reached ${percentage}% of your ${goalName} goal!`;
  }

  if (message) {
    showNotification("savingsGoalsUpdates", title, message, {
      tag: `savings-${goalName}`,
    });
  }
};

/**
 * Show payment reminder notification
 * @param {string} description - Payment description
 * @param {number} amount - Payment amount
 * @param {string} dueDate - Due date
 */
export const showPaymentReminder = (description, amount, dueDate) => {
  if (!isNotificationEnabled("paymentReminders")) return;

  const title = "💳 Payment Reminder";
  const message = `${description} payment of $${amount.toFixed(2)} is due on ${dueDate}`;

  showNotification("paymentReminders", title, message, {
    tag: `payment-${description}`,
    requireInteraction: true,
  });
};

/**
 * Request notification permission from user
 * @returns {Promise<string>} Permission status
 */
export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};
