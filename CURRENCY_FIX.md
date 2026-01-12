# Currency Symbol Dynamic Update Fix

## Issue Description
The dollar sign icon ($) was not changing dynamically when users changed their currency preferences in the Settings. This issue affected three main sections:
1. **Transactions** - All transaction amounts displayed with hardcoded "$"
2. **Budgets** - Budget amounts, modal inputs, and update modal used hardcoded "$"
3. **Savings Goals** - Savings goal amounts, modal inputs, and update modal used hardcoded "$"

## Root Cause
The components were not:
1. Importing the currency preference utilities (`formatCurrency`, `getCurrencySymbol`)
2. Managing currency symbol state
3. Listening for preference change events
4. Updating stored data when currency preferences changed

## Changes Made

### 1. Transactions Component (`src/components/Transactions.jsx`)

#### Added Imports
```javascript
import { formatCurrency, getCurrencySymbol } from "../lib/userPreferences";
```

#### Added Currency Symbol State
```javascript
const [currencySymbol, setCurrencySymbol] = useState(() => {
  const prefs = localStorage.getItem("fintrack_preferences");
  const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
  return getCurrencySymbol(currency);
});
```

#### Added Preference Change Listener
```javascript
useEffect(() => {
  const handlePreferenceChange = () => {
    const prefs = localStorage.getItem("fintrack_preferences");
    const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
    setCurrencySymbol(getCurrencySymbol(currency));
  };

  window.addEventListener("preferencesChanged", handlePreferenceChange);
  return () => {
    window.removeEventListener("preferencesChanged", handlePreferenceChange);
  };
}, []);
```

#### Updated Transaction Loading
Modified the transaction loading logic to update currency symbols in stored amounts:
- Extracts numeric values from transaction amounts
- Reformats with current currency symbol
- Applies to both loaded and demo data

#### Added Dynamic Currency Update for Existing Transactions
```javascript
useEffect(() => {
  const handlePreferenceChange = () => {
    const prefs = localStorage.getItem("fintrack_preferences");
    const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
    const symbol = getCurrencySymbol(currency);

    setTransactions((prev) =>
      prev.map((tx) => {
        const isNegative = tx.amt.startsWith("-");
        const numericValue = parseFloat(tx.amt.replace(/[^0-9.-]/g, ""));
        if (isNaN(numericValue)) return tx;
        const formatted = numericValue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        return {
          ...tx,
          amt: `${isNegative ? "-" : "+"}${symbol}${formatted}`,
        };
      }),
    );
  };

  window.addEventListener("preferencesChanged", handlePreferenceChange);
  return () => {
    window.removeEventListener("preferencesChanged", handlePreferenceChange);
  };
}, []);
```

### 2. Transaction Modal (`src/components/Transactionmodal.jsx`)

#### Added Import
```javascript
import { getCurrencySymbol } from "../lib/userPreferences";
```

#### Added Currency Symbol State
```javascript
const [currencySymbol, setCurrencySymbol] = useState(() => {
  const prefs = localStorage.getItem("fintrack_preferences");
  const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
  return getCurrencySymbol(currency);
});
```

#### Updated Amount Input Display
Changed hardcoded `$` to dynamic `{currencySymbol}`:
```jsx
<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#7e7d7d]">
  {currencySymbol}
</span>
```

#### Updated Amount Formatting in handleSubmit
```javascript
const formattedAmt = `${amtPrefix}${currencySymbol}${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
```

#### Removed Incorrect Dollar Sign from Description Field
Removed the erroneous `$` icon from the description input field (this was a bug).

### 3. Budget Modal (`src/components/Budgetmodal.jsx`)

#### Added Import
```javascript
import { getCurrencySymbol } from "../lib/userPreferences";
```

#### Added Currency Symbol State
```javascript
const [currencySymbol, setCurrencySymbol] = useState(() => {
  const prefs = localStorage.getItem("fintrack_preferences");
  const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
  return getCurrencySymbol(currency);
});
```

#### Updated Budget Amount Input Display
Changed hardcoded `$` to dynamic `{currencySymbol}`:
```jsx
<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--sub-heading-text)]">
  {currencySymbol}
</span>
```

### 4. Savings Modal (`src/components/Savingmodal.jsx`)

#### Added Import
```javascript
import { getCurrencySymbol } from "../lib/userPreferences";
```

#### Added Currency Symbol State
```javascript
const [currencySymbol, setCurrencySymbol] = useState(() => {
  const prefs = localStorage.getItem("fintrack_preferences");
  const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
  return getCurrencySymbol(currency);
});
```

#### Updated Input Fields
Changed hardcoded `$` to dynamic `{currencySymbol}` in both:
- Target Amount input
- Initial Amount input

## How It Works

### Currency Preference Flow
1. User changes currency in Settings
2. Settings component saves preference and triggers `preferencesChanged` event
3. All listening components receive the event
4. Components update their currency symbol state
5. UI re-renders with new currency symbol

### Supported Currencies
The system supports the following currencies (defined in `src/lib/userPreferences.js`):
- USD - US Dollar ($)
- EUR - Euro (€)
- GBP - British Pound (£)
- JPY - Japanese Yen (¥)
- CAD - Canadian Dollar (C$)
- AUD - Australian Dollar (A$)
- INR - Indian Rupee (₹)

## Testing

To verify the fix:
1. Open the application
2. Navigate to Settings
3. Change the currency preference (e.g., from USD to EUR)
4. Check the following sections:
   - **Transactions**: 
     - All existing transaction amounts should display with new currency symbol
     - Click "Add Transaction" - input field should show new currency symbol
   - **Budgets**: 
     - Monthly Overview and Remaining Budget cards should display with new currency symbol (e.g., €1,824.00 / €3,000.00)
     - Category budget amounts should display with new currency symbol (e.g., €350.00 / €500.00)
     - Click "Add Budgets" - input field should show new currency symbol
     - Click "Add Fund" on any category - input field should show new currency symbol
   - **Savings Goals**: 
     - All savings goal amounts should display with new currency symbol (e.g., €1,500.00 / €3,000.00)
     - Click to add new goal - input fields should show new currency symbol
     - Click "Add Fund" on any goal - input field should show new currency symbol
5. Refresh the page - all amounts should maintain the selected currency
6. Change to another currency (e.g., GBP) - all amounts update to £

## Notes

- The fix maintains backward compatibility with existing data
- Numeric values are preserved; only the display symbol changes
- The fix uses the existing `preferencesChanged` event system
- All modals now properly display the user's selected currency
- All components now update existing data when currency preference changes
- Parsing logic uses regex `/[^\d.-]/g` to extract numeric values, making it currency-agnostic
- The `formatCurrency` utility from `userPreferences.js` is now consistently used throughout the app

## Additional Updates

### 5. Budgets Component (`src/components/Budgets.jsx`)

#### Updated addCategoryBudget Function
Changed to use `formatCurrency` when creating new budgets:
```javascript
const addCategoryBudget = (newBudget) => {
  const formattedAmount = formatCurrency(parseFloat(newBudget.amount));
  setCategoryBudgetCards((prev) => [
    ...prev,
    {
      ...newBudget,
      icon: CATEGORY_ICONS[newBudget.title] || ShoppingCart,
      used: "0%",
      remain: formattedAmount,
      amt: `${formatCurrency(0)} / ${formattedAmount}`,
      color: "red",
      period: newBudget.period || "Monthly",
    },
  ]);
  setShowModal(false);
};
```

#### Added Currency Update for Existing Budgets
```javascript
useEffect(() => {
  const handlePreferenceChange = () => {
    const prefs = localStorage.getItem("fintrack_preferences");
    const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
    const symbol = getCurrencySymbol(currency);
    setCurrencySymbol(symbol);

    // Update all budget amounts with new currency symbol
    setCategoryBudgetCards((prev) =>
      prev.map((budget) => {
        const [spentStr, totalStr] = budget.amt
          .split("/")
          .map((s) => s.trim().replace(/[^\d.-]/g, ""));
        const spent = parseFloat(spentStr) || 0;
        const total = parseFloat(totalStr) || 0;
        const remaining = total - spent;

        return {
          ...budget,
          amt: `${formatCurrency(spent)} / ${formatCurrency(total)}`,
          remain: formatCurrency(remaining),
        };
      }),
    );
  };

  window.addEventListener("preferencesChanged", handlePreferenceChange);
  return () => {
    window.removeEventListener("preferencesChanged", handlePreferenceChange);
  };
}, []);
```

### 6. Budget Update Modal (`src/components/BudgetUpdateModal.jsx`)

#### Added Imports
```javascript
import { getCurrencySymbol, formatCurrency } from "../lib/userPreferences";
```

#### Added Currency Symbol State
```javascript
const [currencySymbol, setCurrencySymbol] = useState(() => {
  const prefs = localStorage.getItem("fintrack_preferences");
  const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
  return getCurrencySymbol(currency);
});
```

#### Updated Parsing Logic
Changed from hardcoded `$` to dynamic parsing:
```javascript
const [spentStr, totalStr] = budget.amt
  .split("/")
  .map((s) => s.trim().replace(/[^\d.-]/g, ""));
const spent = parseFloat(spentStr) || 0;
const total = parseFloat(totalStr) || 0;
```

#### Updated Display and Form Submission
- Changed all hardcoded `$` displays to use `formatCurrency()`
- Updated input field to show `{currencySymbol}`
- Updated `handleSubmit` to use `formatCurrency()` when saving

### 7. Savings Goals Component (`src/components/SavingsGoals.jsx`)

#### Updated handleAddGoal Function
Removed local `formatCurrency` function and now uses imported utility:
```javascript
const handleAddGoal = (goalData) => {
  const { goalName, targetAmount, initialAmount, date } = goalData;
  const usedPercent =
    targetAmount > 0 ? Math.round((initialAmount / targetAmount) * 100) : 0;
  const remainAmount = targetAmount - initialAmount;
  const iconKey = ICON_MAP[goalName] || "Tag";
  const icon = ICON_COMPONENTS[iconKey] ? iconKey : "Tag";

  setSavingBudgetCards((prev) => [
    ...prev,
    {
      title: goalName,
      used: `${usedPercent}%`,
      remain: formatCurrency(remainAmount),
      amt: `${formatCurrency(initialAmount)} / ${formatCurrency(targetAmount)}`,
      icon,
      date: date ? ... : "N/A",
    },
  ]);
};
```

#### Added Currency Update for Existing Savings Goals
```javascript
useEffect(() => {
  const handlePreferenceChange = () => {
    setSavingBudgetCards((prev) =>
      prev.map((goal) => {
        const [savedStr, targetStr] = goal.amt
          .split("/")
          .map((s) => s.trim().replace(/[^\d.-]/g, ""));
        const saved = parseFloat(savedStr) || 0;
        const target = parseFloat(targetStr) || 0;
        const remaining = target - saved;

        return {
          ...goal,
          amt: `${formatCurrency(saved)} / ${formatCurrency(target)}`,
          remain: formatCurrency(remaining),
        };
      }),
    );
  };

  window.addEventListener("preferencesChanged", handlePreferenceChange);
  return () => {
    window.removeEventListener("preferencesChanged", handlePreferenceChange);
  };
}, []);
```

### 8. Savings Goal Update Modal (`src/components/SavingsGoalUpdateModal.jsx`)

#### Added Imports
```javascript
import {
  getCurrencySymbol,
  formatCurrency as formatCurrencyUtil,
} from "../lib/userPreferences";
```

#### Added Currency Symbol State
```javascript
const [currencySymbol, setCurrencySymbol] = useState(() => {
  const prefs = localStorage.getItem("fintrack_preferences");
  const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
  return getCurrencySymbol(currency);
});
```

#### Updated Parsing Logic
Changed from regex with `$` to dynamic parsing:
```javascript
const parseAmounts = (amtStr) => {
  if (!amtStr) return [0, 0];
  const parts = amtStr
    .split("/")
    .map((s) => s.trim().replace(/[^\d.-]/g, ""));
  if (parts.length === 2) {
    const saved = parseFloat(parts[0]) || 0;
    const target = parseFloat(parts[1]) || 0;
    return [saved, target];
  }
  return [0, 0];
};
```

#### Updated Currency Formatting
Changed local function to use imported utility:
```javascript
const formatCurrency = (amt) => formatCurrencyUtil(amt);
```

## Critical Fixes: Parsing Functions

### Issue with parseAmt and parseAmount Functions
The original parsing functions used hardcoded `$` regex patterns that failed when currency changed:

**Before (BROKEN):**
```javascript
// Budgets.jsx - parseAmt function
function parseAmt(amtStr) {
  if (!amtStr) return [0, 0];
  const match = amtStr.match(/\$([\d,]+\.\d{2})\s*\/\s*\$([\d,]+\.\d{2})/);
  if (match) {
    const spent = parseFloat(match[1].replace(/,/g, ""));
    const total = parseFloat(match[2].replace(/,/g, ""));
    return [spent, total];
  }
  return [0, 0];
}
```

**After (FIXED):**
```javascript
// Currency-agnostic parsing
function parseAmt(amtStr) {
  if (!amtStr) return [0, 0];
  const parts = amtStr.split("/").map((s) => s.trim().replace(/[^\d.-]/g, ""));
  if (parts.length === 2) {
    const spent = parseFloat(parts[0]) || 0;
    const total = parseFloat(parts[1]) || 0;
    return [spent, total];
  }
  return [0, 0];
}
```

### Dashboard.jsx - parseSavingsAmt Function

**Before (BROKEN):**
```javascript
const parseSavingsAmt = (amtStr) => {
  if (!amtStr) return 0;
  const match = amtStr.match(/\$([\d,]+\.\d{2})/);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ""));
  }
  return 0;
};
```

**After (FIXED):**
```javascript
const parseSavingsAmt = (amtStr) => {
  if (!amtStr) return 0;
  // Currency-agnostic: extract first number from any currency format
  const cleaned = amtStr.replace(/[^\d.-]/g, "");
  return parseFloat(cleaned) || 0;
};
```

### Initial Data Conversion
Both Budgets and SavingsGoals components now convert stored/demo data to current currency on initial load:

```javascript
// Helper to update currency symbols in stored data
const updateCurrencyInData = (data) => {
  return data.map((item) => {
    // Parse amounts and reformat with current currency
    const [savedStr, targetStr] = item.amt
      .split("/")
      .map((s) => s.trim().replace(/[^\d.-]/g, ""));
    const saved = parseFloat(savedStr) || 0;
    const target = parseFloat(targetStr) || 0;
    const remaining = target - saved;

    return {
      ...item,
      amt: `${formatCurrency(saved)} / ${formatCurrency(target)}`,
      remain: formatCurrency(remaining),
    };
  });
};
```

This ensures that even if data is stored with `$` symbols, it will be displayed with the current currency preference when loaded.

## Related Files

- `src/lib/userPreferences.js` - Currency utilities and preference management
- `src/components/Transactions.jsx` - Main transactions display (UPDATED)
- `src/components/Transactionmodal.jsx` - Add transaction dialog (UPDATED)
- `src/components/Budgets.jsx` - Main budgets display + parseAmt fix + initial data conversion (UPDATED)
- `src/components/Budgetmodal.jsx` - Add budget dialog (UPDATED)
- `src/components/BudgetUpdateModal.jsx` - Update budget dialog (UPDATED)
- `src/components/SavingsGoals.jsx` - Main savings goals display + parseAmount fix + initial data conversion (UPDATED)
- `src/components/Savingmodal.jsx` - Add savings goal dialog (UPDATED)
- `src/components/SavingsGoalUpdateModal.jsx` - Update savings goal dialog (UPDATED)
- `src/components/Dashboard.jsx` - Dashboard display + parseSavingsAmt fix (UPDATED)
- `src/data/initialBudgets.jsx` - Initial budget data (has $ symbols, converted on load)
- `src/data/initialSavingsGoals.jsx` - Initial savings data (has $ symbols, converted on load)

## Future Enhancements

Consider implementing:
1. Currency conversion when switching currencies (optional feature)
2. Multi-currency support (tracking different currencies simultaneously)
3. Historical exchange rate tracking
4. Currency-specific formatting rules (e.g., comma vs period for decimals)