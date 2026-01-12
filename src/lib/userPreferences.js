// User Preferences Utility
// Helper functions to manage and access user preferences across the app

/**
 * Get all user preferences from localStorage
 * @returns {Object} preferences object
 */
export const getUserPreferences = () => {
  const saved = localStorage.getItem("fintrack_preferences");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.error("Error parsing user preferences:", error);
      return getDefaultPreferences();
    }
  }
  return getDefaultPreferences();
};

/**
 * Get default user preferences
 * @returns {Object} default preferences
 */
export const getDefaultPreferences = () => {
  return {
    currency: "USD - US Dollar",
    dateFormat: "MM/DD/YYYY",
    startWeekOn: "Sunday",
    autoCategorize: true,
  };
};

/**
 * Get a specific preference value
 * @param {string} key - Preference key
 * @returns {any} preference value
 */
export const getPreference = (key) => {
  const preferences = getUserPreferences();
  return preferences[key];
};

/**
 * Save user preferences to localStorage
 * @param {Object} preferences - Preferences object
 * @returns {boolean} true if saved successfully
 */
export const saveUserPreferences = (preferences) => {
  try {
    localStorage.setItem("fintrack_preferences", JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error("Error saving user preferences:", error);
    return false;
  }
};

/**
 * Update a specific preference
 * @param {string} key - Preference key
 * @param {any} value - New value
 * @returns {boolean} true if saved successfully
 */
export const updatePreference = (key, value) => {
  const preferences = getUserPreferences();
  preferences[key] = value;
  return saveUserPreferences(preferences);
};

/**
 * Get currency symbol from currency string
 * @param {string} currency - Currency string (e.g., "USD - US Dollar")
 * @returns {string} currency symbol
 */
export const getCurrencySymbol = (currency) => {
  const currencyMap = {
    "USD - US Dollar": "$",
    "EUR - Euro": "€",
    "GBP - British Pound": "£",
    "JPY - Japanese Yen": "¥",
    "CAD - Canadian Dollar": "C$",
    "AUD - Australian Dollar": "A$",
    "INR - Indian Rupee": "₹",
  };
  return currencyMap[currency] || "$";
};

/**
 * Get currency code from currency string
 * @param {string} currency - Currency string (e.g., "USD - US Dollar")
 * @returns {string} currency code
 */
export const getCurrencyCode = (currency) => {
  if (!currency) return "USD";
  return currency.split(" - ")[0];
};

/**
 * Format amount with user's preferred currency
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show currency symbol
 * @returns {string} formatted amount
 */
export const formatCurrency = (amount, showSymbol = true) => {
  const preferences = getUserPreferences();
  const currency = preferences.currency || "USD - US Dollar";
  const symbol = getCurrencySymbol(currency);
  const code = getCurrencyCode(currency);

  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  if (showSymbol) {
    return `${amount < 0 ? "-" : ""}${symbol}${formatted}`;
  } else {
    return `${amount < 0 ? "-" : ""}${formatted} ${code}`;
  }
};

/**
 * Format date according to user's preferred format
 * @param {Date|string} date - Date to format
 * @returns {string} formatted date
 */
export const formatDate = (date) => {
  const preferences = getUserPreferences();
  const format = preferences.dateFormat || "MM/DD/YYYY";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  switch (format) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD-MM-YYYY":
      return `${day}-${month}-${year}`;
    default:
      return `${month}/${day}/${year}`;
  }
};

/**
 * Get start of week day number (0 = Sunday, 1 = Monday)
 * @returns {number} day number
 */
export const getStartOfWeekDay = () => {
  const preferences = getUserPreferences();
  const startDay = preferences.startWeekOn || "Sunday";
  return startDay === "Sunday" ? 0 : 1;
};

/**
 * Check if auto-categorize is enabled
 * @returns {boolean} true if enabled
 */
export const isAutoCategorizeEnabled = () => {
  const preferences = getUserPreferences();
  return preferences.autoCategorize !== false;
};

/**
 * Get week start date based on user preference
 * @param {Date} date - Reference date
 * @returns {Date} start of week
 */
export const getWeekStart = (date = new Date()) => {
  const startDayNum = getStartOfWeekDay();
  const currentDay = date.getDay();
  const distance = (currentDay + 7 - startDayNum) % 7;
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - distance);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

/**
 * Get week end date based on user preference
 * @param {Date} date - Reference date
 * @returns {Date} end of week
 */
export const getWeekEnd = (date = new Date()) => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
};

/**
 * Parse date string to Date object based on user's date format
 * @param {string} dateString - Date string to parse
 * @returns {Date} parsed date
 */
export const parseDate = (dateString) => {
  const preferences = getUserPreferences();
  const format = preferences.dateFormat || "MM/DD/YYYY";

  const parts = dateString.split(/[-/]/);

  let day, month, year;

  switch (format) {
    case "MM/DD/YYYY":
      month = parseInt(parts[0], 10) - 1;
      day = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
      break;
    case "DD/MM/YYYY":
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
      break;
    case "YYYY-MM-DD":
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
      break;
    case "DD-MM-YYYY":
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
      break;
    default:
      month = parseInt(parts[0], 10) - 1;
      day = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
  }

  return new Date(year, month, day);
};

/**
 * Get date format placeholder based on user preference
 * @returns {string} placeholder text
 */
export const getDateFormatPlaceholder = () => {
  const preferences = getUserPreferences();
  return preferences.dateFormat || "MM/DD/YYYY";
};

/**
 * Reset preferences to defaults
 * @returns {boolean} true if reset successfully
 */
export const resetPreferences = () => {
  const defaults = getDefaultPreferences();
  return saveUserPreferences(defaults);
};

/**
 * Export preferences as JSON
 * @returns {string} JSON string of preferences
 */
export const exportPreferences = () => {
  const preferences = getUserPreferences();
  return JSON.stringify(preferences, null, 2);
};

/**
 * Import preferences from JSON
 * @param {string} jsonString - JSON string of preferences
 * @returns {boolean} true if imported successfully
 */
export const importPreferences = (jsonString) => {
  try {
    const preferences = JSON.parse(jsonString);
    return saveUserPreferences(preferences);
  } catch (error) {
    console.error("Error importing preferences:", error);
    return false;
  }
};

/**
 * Custom hook to get currency preference with reactivity
 * @returns {Object} { currencySymbol, currencyCode, currency, formatAmount }
 */
export const useCurrency = () => {
  const preferences = getUserPreferences();
  const currency = preferences.currency || "USD - US Dollar";
  const currencySymbol = getCurrencySymbol(currency);
  const currencyCode = getCurrencyCode(currency);

  const formatAmount = (amount, showSymbol = true) => {
    return formatCurrency(amount, showSymbol);
  };

  return {
    currencySymbol,
    currencyCode,
    currency,
    formatAmount,
  };
};

/**
 * Dispatch custom event when preferences change
 * This allows components to listen for preference updates
 */
export const notifyPreferencesChanged = () => {
  window.dispatchEvent(new CustomEvent("preferencesChanged"));
};

/**
 * Update preferences and notify listeners
 * @param {Object} preferences - New preferences
 * @returns {boolean} true if saved successfully
 */
export const saveAndNotifyPreferences = (preferences) => {
  const success = saveUserPreferences(preferences);
  if (success) {
    notifyPreferencesChanged();
  }
  return success;
};
