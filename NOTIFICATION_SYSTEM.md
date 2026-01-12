# Notification System Documentation

## Overview
The FinTrack app now includes a fully functional notification system that allows users to control their notification preferences and receive alerts about budget usage, savings goals, and payment reminders.

## Features

### 1. Notification Settings (Settings > Notifications Tab)
Users can control the following notification preferences:

#### Notification Channels
- **Email Notifications**: Enable/disable email notifications
- **Push Notifications**: Enable/disable browser push notifications

#### Notification Types
- **Budget Alerts**: Get notified when approaching or exceeding budget limits
  - 75% warning
  - 90% warning
  - 100% exceeded alert
- **Payment Reminders**: Receive reminders for upcoming payments
- **Savings Goals Updates**: Get notified on savings milestones
  - 25% milestone
  - 50% milestone (Halfway!)
  - 75% milestone (Almost there!)
  - 100% goal achieved

### 2. Storage
All notification preferences are stored in localStorage under the key `fintrack_notifications`.

Default preferences (all enabled):
```json
{
  "emailNotifications": true,
  "pushNotifications": true,
  "budgetAlerts": true,
  "paymentReminders": true,
  "savingsGoalsUpdates": true
}
```

### 3. Notification Triggers

#### Budget Alerts
Triggered automatically when:
- User updates budget spending
- Spending reaches 75%, 90%, or 100% of budget
- Location: `Budgets.jsx` → `handleUpdateBudget()` function

#### Savings Goals Updates
Triggered automatically when:
- User adds funds to a savings goal
- Progress reaches 25%, 50%, 75%, or 100% milestones
- Location: `SavingsGoals.jsx` → `handleUpdateGoal()` function

#### Payment Reminders
Can be triggered programmatically for upcoming payments
- Location: Available via `showPaymentReminder()` utility function

## Files Structure

### Core Files
```
src/
├── lib/
│   └── notificationPreferences.js    # Main notification utility functions
├── components/
│   ├── Settings.jsx                  # Notification preferences UI
│   ├── Budgets.jsx                   # Budget alert triggers
│   └── SavingsGoals.jsx             # Savings goal notification triggers
└── App.jsx                           # Request notification permission on login
```

## API Reference

### Utility Functions (`notificationPreferences.js`)

#### `getNotificationPreferences()`
Returns all notification preferences from localStorage.
```javascript
const preferences = getNotificationPreferences();
// Returns: { emailNotifications: true, pushNotifications: true, ... }
```

#### `isNotificationEnabled(notificationType)`
Check if a specific notification type is enabled.
```javascript
if (isNotificationEnabled('budgetAlerts')) {
  // Show notification
}
```

#### `showBudgetAlert(category, spent, budget, percentage)`
Display budget alert notification.
```javascript
showBudgetAlert('Groceries', 450, 500, 90);
// Shows: "⚠️ Budget Warning - You've used 90% of your Groceries budget"
```

#### `showSavingsGoalUpdate(goalName, current, target, percentage)`
Display savings goal milestone notification.
```javascript
showSavingsGoalUpdate('Emergency Fund', 2500, 5000, 50);
// Shows: "💪 Halfway There! - You've saved 50% toward your Emergency Fund goal!"
```

#### `showPaymentReminder(description, amount, dueDate)`
Display payment reminder notification.
```javascript
showPaymentReminder('Electric Bill', 120.50, 'Jan 15, 2025');
// Shows: "💳 Payment Reminder - Electric Bill payment of $120.50 is due on Jan 15, 2025"
```

#### `requestNotificationPermission()`
Request browser notification permission from user.
```javascript
const permission = await requestNotificationPermission();
// Returns: 'granted', 'denied', or 'unsupported'
```

## User Experience

### Setup Flow
1. User logs in to the app
2. Browser requests notification permission (automatic)
3. User can customize preferences in Settings > Notifications
4. Notifications are shown based on user preferences

### Notification Appearance
- **Browser notifications**: Native browser notifications with icon and badge
- **In-app messages**: Success messages when preferences are saved
- **Smart triggering**: Only shows relevant notifications based on thresholds

## Browser Compatibility
- Modern browsers that support the Notification API
- Gracefully degrades if notifications are not supported
- Permission state persists across sessions

## Testing

### Test Budget Alerts
1. Go to Budgets section
2. Create or select a budget category
3. Click "Add Fund" to add spending
4. When spending reaches 75%, 90%, or 100%, notification should appear

### Test Savings Goals
1. Go to Savings Goals section
2. Create or select a savings goal
3. Click "Add Funds" to add money
4. When reaching 25%, 50%, 75%, or 100%, notification should appear

### Test Notification Settings
1. Go to Settings > Notifications tab
2. Toggle any notification switch
3. Click "Save Preferences"
4. Success message should appear
5. Settings persist after page reload

## Privacy & Security
- All preferences stored locally in browser
- No data sent to external servers
- User has full control over notification types
- Can be disabled at any time

## Future Enhancements
- Email notification integration (backend required)
- Scheduled payment reminders
- Recurring transaction alerts
- Monthly budget summary notifications
- Custom notification sounds
- Notification history log
- Snooze/dismiss options
- Rich notifications with action buttons

## Troubleshooting

### Notifications not appearing?
1. Check browser notification permissions in browser settings
2. Verify notification type is enabled in Settings > Notifications
3. Check if Push Notifications toggle is ON
4. Ensure browser supports Notification API

### Preferences not saving?
1. Check browser localStorage is enabled
2. Clear cache and try again
3. Check browser console for errors

### Browser permission denied?
1. Clear site permissions in browser settings
2. Refresh the page
3. Allow notifications when prompted

## Code Examples

### Adding a new notification type

1. Update the default preferences in `notificationPreferences.js`:
```javascript
export const getDefaultNotificationPreferences = () => {
  return {
    // ... existing preferences
    customNotification: true, // Add new type
  };
};
```

2. Add UI toggle in `Settings.jsx`:
```javascript
<div className="flex items-center justify-between">
  <label>Custom Notifications</label>
  <button onClick={() => toggleNotification("customNotification")}>
    {/* Toggle switch */}
  </button>
</div>
```

3. Create trigger function:
```javascript
export const showCustomNotification = (data) => {
  if (!isNotificationEnabled("customNotification")) return;
  showNotification("customNotification", "Title", "Message");
};
```

## Support
For issues or questions about the notification system, please refer to:
- Main documentation: `README.md`
- Firebase setup: `FIREBASE_SETUP.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`

---

**Last Updated**: 2025
**Version**: 1.0.0