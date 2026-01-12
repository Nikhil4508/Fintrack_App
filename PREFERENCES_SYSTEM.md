# Preferences System Documentation

## Overview
The FinTrack app now includes a fully functional preferences system that allows users to customize their dashboard experience including currency, date format, week start day, and transaction categorization settings.

## Features

### 1. User Preferences (Settings > Preferences Tab)
Users can customize the following preferences:

#### Currency Selection
- **USD - US Dollar** ($)
- **EUR - Euro** (€)
- **GBP - British Pound** (£)
- **JPY - Japanese Yen** (¥)
- **CAD - Canadian Dollar** (C$)
- **AUD - Australian Dollar** (A$)
- **INR - Indian Rupee** (₹)

#### Date Format Options
- **MM/DD/YYYY** - US format (e.g., 12/25/2024)
- **DD/MM/YYYY** - European format (e.g., 25/12/2024)
- **YYYY-MM-DD** - ISO format (e.g., 2024-12-25)
- **DD-MM-YYYY** - Alternative format (e.g., 25-12-2024)

#### Week Start Day
- **Sunday** - Traditional week start
- **Monday** - ISO week start

#### Auto-Categorize Transactions
- Toggle to automatically categorize transactions based on previous patterns
- Helps maintain consistency in transaction categorization
- Can be disabled for manual categorization preference

### 2. Storage
All user preferences are stored in localStorage under the key `fintrack_preferences`.

Default preferences:
```json
{
  "currency": "USD - US Dollar",
  "dateFormat": "MM/DD/YYYY",
  "startWeekOn": "Sunday",
  "autoCategorize": true
}
```

### 3. How It Works

#### Preferences UI
- **Dropdown menus** for currency, date format, and week start selection
- **Toggle switch** for auto-categorize feature
- **Save button** to persist changes
- **Success message** confirmation when saved
- **Real-time updates** - changes reflect immediately after saving

#### Persistence
- Settings are saved to browser localStorage
- Preferences persist across sessions
- Automatically loaded on app startup
- Can be reset to defaults if needed

## Files Structure

### Core Files
```
src/
├── lib/
│   └── userPreferences.js           # Preference utility functions
├── components/
│   └── Settings.jsx                  # Preferences UI and management
└── PREFERENCES_SYSTEM.md            # This documentation
```

## API Reference

### Utility Functions (`userPreferences.js`)

#### `getUserPreferences()`
Get all user preferences from localStorage.
```javascript
const preferences = getUserPreferences();
// Returns: { currency: "USD - US Dollar", dateFormat: "MM/DD/YYYY", ... }
```

#### `getPreference(key)`
Get a specific preference value.
```javascript
const currency = getPreference('currency');
// Returns: "USD - US Dollar"
```

#### `saveUserPreferences(preferences)`
Save preferences to localStorage.
```javascript
const saved = saveUserPreferences({
  currency: "EUR - Euro",
  dateFormat: "DD/MM/YYYY",
  startWeekOn: "Monday",
  autoCategorize: true
});
// Returns: true if successful
```

#### `updatePreference(key, value)`
Update a single preference.
```javascript
updatePreference('currency', 'GBP - British Pound');
```

#### `getCurrencySymbol(currency)`
Get currency symbol from currency string.
```javascript
const symbol = getCurrencySymbol('USD - US Dollar');
// Returns: "$"
```

#### `getCurrencyCode(currency)`
Get currency code from currency string.
```javascript
const code = getCurrencyCode('USD - US Dollar');
// Returns: "USD"
```

#### `formatCurrency(amount, showSymbol)`
Format amount with user's preferred currency.
```javascript
formatCurrency(1234.56);
// Returns: "$1,234.56" (based on user's currency preference)

formatCurrency(1234.56, false);
// Returns: "1,234.56 USD"
```

#### `formatDate(date)`
Format date according to user's preferred format.
```javascript
formatDate(new Date('2024-12-25'));
// Returns: "12/25/2024" (if format is MM/DD/YYYY)
// Returns: "25/12/2024" (if format is DD/MM/YYYY)
```

#### `parseDate(dateString)`
Parse date string to Date object based on user's format.
```javascript
const date = parseDate('12/25/2024');
// Parses according to user's date format preference
```

#### `getStartOfWeekDay()`
Get start of week day number (0 = Sunday, 1 = Monday).
```javascript
const startDay = getStartOfWeekDay();
// Returns: 0 (Sunday) or 1 (Monday)
```

#### `isAutoCategorizeEnabled()`
Check if auto-categorize is enabled.
```javascript
if (isAutoCategorizeEnabled()) {
  // Auto-categorize new transactions
}
```

#### `getWeekStart(date)`
Get week start date based on user preference.
```javascript
const weekStart = getWeekStart(new Date());
// Returns: Date object for start of week
```

#### `getWeekEnd(date)`
Get week end date based on user preference.
```javascript
const weekEnd = getWeekEnd(new Date());
// Returns: Date object for end of week
```

#### `getDateFormatPlaceholder()`
Get date format placeholder based on user preference.
```javascript
const placeholder = getDateFormatPlaceholder();
// Returns: "MM/DD/YYYY" (based on user's preference)
```

#### `resetPreferences()`
Reset all preferences to defaults.
```javascript
resetPreferences();
```

#### `exportPreferences()`
Export preferences as JSON string.
```javascript
const json = exportPreferences();
// Returns: JSON string of preferences
```

#### `importPreferences(jsonString)`
Import preferences from JSON string.
```javascript
const success = importPreferences(jsonString);
// Returns: true if imported successfully
```

## Usage Examples

### Using Currency Formatting
```javascript
import { formatCurrency } from '../lib/userPreferences';

// In your component
const amount = 1234.56;
const formatted = formatCurrency(amount);
// Output: "$1,234.56" (or other currency based on user preference)

// Display in JSX
<span>{formatCurrency(transaction.amount)}</span>
```

### Using Date Formatting
```javascript
import { formatDate } from '../lib/userPreferences';

// Format a date
const date = new Date('2024-12-25');
const formatted = formatDate(date);
// Output: "12/25/2024" or "25/12/2024" based on preference

// In JSX
<span>{formatDate(transaction.date)}</span>
```

### Checking Auto-Categorize
```javascript
import { isAutoCategorizeEnabled } from '../lib/userPreferences';

const addTransaction = (transaction) => {
  if (isAutoCategorizeEnabled() && !transaction.category) {
    transaction.category = suggestCategory(transaction.description);
  }
  // Save transaction...
};
```

### Week Calculations
```javascript
import { getWeekStart, getWeekEnd } from '../lib/userPreferences';

// Get transactions for current week
const weekStart = getWeekStart();
const weekEnd = getWeekEnd();
const weekTransactions = transactions.filter(tx => 
  tx.date >= weekStart && tx.date <= weekEnd
);
```

## Integration Points

### Where Preferences Are Used

1. **Currency Display**
   - All monetary values throughout the app
   - Transaction amounts
   - Budget totals
   - Savings goal amounts
   - Dashboard summaries

2. **Date Display**
   - Transaction dates
   - Budget periods
   - Savings goal target dates
   - Reports and analytics

3. **Week Calculations**
   - Weekly budget tracking
   - Weekly spending reports
   - Calendar views
   - Date range filters

4. **Transaction Categorization**
   - Automatic category suggestions
   - Smart categorization based on history
   - Manual override always available

## User Experience

### Setup Flow
1. User navigates to Settings
2. Clicks on Preferences tab
3. Selects desired preferences from dropdowns
4. Toggles auto-categorize if needed
5. Clicks "Save Preferences"
6. Success message confirms save
7. Changes apply immediately across the app

### Preference Changes
- Currency change updates all monetary displays
- Date format change updates all date displays
- Week start change affects weekly calculations
- Auto-categorize affects new transactions only

## Browser Compatibility
- Works in all modern browsers supporting localStorage
- No server communication required
- All processing done client-side
- Instant updates without page reload

## Testing

### Test Currency Selection
1. Go to Settings > Preferences
2. Click Currency dropdown
3. Select different currency (e.g., EUR - Euro)
4. Click "Save Preferences"
5. Navigate to Dashboard
6. Verify all amounts show with € symbol

### Test Date Format
1. Go to Settings > Preferences
2. Click Date Format dropdown
3. Select different format (e.g., DD/MM/YYYY)
4. Click "Save Preferences"
5. Navigate to Transactions
6. Verify dates display in new format

### Test Week Start
1. Go to Settings > Preferences
2. Change Start Week On to Monday
3. Click "Save Preferences"
4. Check weekly reports/filters
5. Verify week starts on Monday

### Test Auto-Categorize
1. Go to Settings > Preferences
2. Toggle Auto-Categorize switch
3. Click "Save Preferences"
4. Add a new transaction
5. Verify categorization behavior matches setting

### Test Persistence
1. Change multiple preferences
2. Click "Save Preferences"
3. Refresh the page
4. Go back to Settings > Preferences
5. Verify all settings are retained

## Privacy & Security
- All preferences stored locally in browser
- No data sent to external servers
- User has full control over all settings
- Can be cleared by clearing browser data
- No personal information stored

## Best Practices

### For Developers

1. **Always use utility functions** for formatting
   ```javascript
   // Good
   formatCurrency(amount)
   
   // Bad
   `$${amount.toFixed(2)}`
   ```

2. **Check preferences before applying logic**
   ```javascript
   if (isAutoCategorizeEnabled()) {
     // Apply auto-categorization
   }
   ```

3. **Use preference-aware date functions**
   ```javascript
   const weekStart = getWeekStart();
   // Instead of hardcoding Sunday as start
   ```

4. **Provide fallbacks**
   ```javascript
   const currency = getPreference('currency') || 'USD - US Dollar';
   ```

### For Users

1. **Save preferences immediately** after changes
2. **Test changes** in different sections of the app
3. **Use consistent date format** across devices
4. **Enable auto-categorize** to save time
5. **Review settings** periodically

## Future Enhancements

### Potential Features
- [ ] More currency options
- [ ] Custom currency symbol
- [ ] Time format preferences (12h/24h)
- [ ] Number format (comma vs period decimal)
- [ ] Language/locale settings
- [ ] Theme preferences (dark/light/auto)
- [ ] Custom date format builder
- [ ] Fiscal year start date
- [ ] Custom week start (any day)
- [ ] Export/import preferences
- [ ] Sync across devices (cloud storage)
- [ ] Preference profiles
- [ ] Advanced categorization rules
- [ ] Keyboard shortcuts preferences

## Troubleshooting

### Preferences not saving?
1. Check browser localStorage is enabled
2. Clear cache and try again
3. Check browser console for errors
4. Verify you clicked "Save Preferences"

### Currency not displaying correctly?
1. Verify currency preference is saved
2. Refresh the page
3. Check if amounts are using formatCurrency()
4. Clear localStorage and set preferences again

### Date format not working?
1. Confirm date format preference is saved
2. Check if dates are using formatDate()
3. Verify date strings are valid
4. Try different format and save again

### Auto-categorize not working?
1. Ensure toggle is ON and saved
2. Check if enough transaction history exists
3. Verify similar transactions were categorized before
4. Try manual categorization first to build patterns

## Migration Guide

### From Hardcoded Values
If you have hardcoded currency or date formats:

**Before:**
```javascript
const formatted = `$${amount.toFixed(2)}`;
const dateStr = `${month}/${day}/${year}`;
```

**After:**
```javascript
import { formatCurrency, formatDate } from '../lib/userPreferences';

const formatted = formatCurrency(amount);
const dateStr = formatDate(date);
```

### Adding New Preferences
To add a new preference:

1. Update default preferences in `userPreferences.js`
2. Add UI control in Settings.jsx
3. Add getter/setter functions if needed
4. Update documentation
5. Test thoroughly

## Support
For issues or questions about the preferences system, please refer to:
- Main documentation: `README.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Notification system: `NOTIFICATION_SYSTEM.md`

---

**Last Updated**: 2025
**Version**: 1.0.0
**Status**: ✅ Fully Functional