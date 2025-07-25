# Firestore Setup and Usage Guide

This guide explains how to set up and use Firebase Firestore in your Fintrack App.

## 🔥 What is Firestore?

Cloud Firestore is a flexible, scalable database for mobile, web, and server development from Firebase. It stores your app's data in the cloud, allowing:

- ✅ Real-time synchronization across devices
- ✅ Offline data persistence
- ✅ Automatic scaling
- ✅ User-specific data storage
- ✅ Secure access with Firebase Security Rules

---

## 📋 Setup Instructions

### Step 1: Enable Firestore in Firebase Console

1. **Open Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: fintrack-87f0d
3. **Click "Firestore Database"** in the left sidebar (under "Build")
4. **Click "Create database"**
5. **Choose "Start in test mode"** (for development)
   - Test mode allows read/write access for 30 days
   - We'll secure it later with proper rules
6. **Click "Next"**
7. **Select location**: Choose closest to your users
   - Example: `us-central1` (US), `asia-south1` (India), `europe-west1` (Europe)
   - ⚠️ **Important**: Location cannot be changed later!
8. **Click "Enable"**
9. **Wait** for Firestore to be provisioned (30-60 seconds)

### Step 2: Verify Firestore is Enabled

You should see the Firestore Database page with:
- A "Start collection" button
- Empty database (no data yet)
- Rules tab
- Indexes tab
- Usage tab

---

## 📊 Database Structure

Your Fintrack app uses the following Firestore structure:

```
users (collection)
  └── {userId} (document)
       ├── email: string
       ├── displayName: string
       ├── createdAt: timestamp
       ├── updatedAt: timestamp
       │
       ├── transactions (subcollection)
       │    └── {transactionId} (document)
       │         ├── description: string
       │         ├── amount: number
       │         ├── category: string
       │         ├── type: string ("income" or "expense")
       │         ├── date: string
       │         ├── createdAt: timestamp
       │         └── updatedAt: timestamp
       │
       ├── budgets (subcollection)
       │    └── {budgetId} (document)
       │         ├── title: string
       │         ├── amount: number
       │         ├── used: string
       │         ├── remain: string
       │         ├── amt: string
       │         ├── icon: string
       │         ├── color: string
       │         ├── createdAt: timestamp
       │         └── updatedAt: timestamp
       │
       └── savingsGoals (subcollection)
            └── {goalId} (document)
                 ├── title: string
                 ├── targetAmount: number
                 ├── currentAmount: number
                 ├── used: string
                 ├── remain: string
                 ├── amt: string
                 ├── icon: string
                 ├── date: string
                 ├── createdAt: timestamp
                 └── updatedAt: timestamp
```

### Why Subcollections?

- Each user's data is isolated in their own subcollections
- Better security (users can only access their own data)
- Scalable (no limit on user count or data per user)
- Easy to query and manage

---

## 🔧 How to Use in Your App

The Firestore integration is already set up! You can use it through the `useUserData` hook.

### Example: Using Data in Components

```jsx
import { useUserData } from '../context/UserDataContext';

function MyComponent() {
  const {
    user,
    loading,
    transactions,
    budgets,
    savingsGoals,
    addNewTransaction,
    addNewBudget,
    addNewSavingsGoal,
  } = useUserData();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome {user.displayName}</h1>
      <p>You have {transactions.length} transactions</p>
      <p>You have {budgets.length} budgets</p>
      <p>You have {savingsGoals.length} savings goals</p>
    </div>
  );
}
```

### Available Methods

#### Transactions
- `addNewTransaction(transactionData)` - Add a transaction
- `updateExistingTransaction(id, data)` - Update a transaction
- `removeTransaction(id)` - Delete a transaction

#### Budgets
- `addNewBudget(budgetData)` - Add a budget
- `updateExistingBudget(id, data)` - Update a budget
- `removeBudget(id)` - Delete a budget

#### Savings Goals
- `addNewSavingsGoal(goalData)` - Add a savings goal
- `updateExistingSavingsGoal(id, data)` - Update a savings goal
- `removeSavingsGoal(id)` - Delete a savings goal

#### Other
- `refreshUserData()` - Reload all data from Firestore

---

## 🧪 Testing Firestore

### Test 1: Register and Check Firestore

1. **Register a new user** in your app
2. **Go to Firebase Console** → Firestore Database
3. **You should see**:
   - A `users` collection
   - A document with your user ID
   - The document contains email and displayName

### Test 2: Add a Transaction

1. **Login to your app**
2. **Go to Transactions** page
3. **Add a new transaction**
4. **Check Firebase Console**:
   - Navigate to: `users/{yourUserId}/transactions`
   - You should see your new transaction document

### Test 3: Add a Budget

1. **Go to Budgets** page
2. **Create a new budget**
3. **Check Firebase Console**:
   - Navigate to: `users/{yourUserId}/budgets`
   - You should see your new budget document

### Test 4: Multiple Users

1. **Logout** and **register another user**
2. **Add data** for the second user
3. **Check Firebase Console**:
   - You should see two separate user documents
   - Each user has their own subcollections
   - Data is completely isolated

---

## 🔒 Security Rules (Important!)

### Current Rules (Test Mode)

Your Firestore is currently in **test mode**, which means:
- ⚠️ **Anyone can read/write your database**
- ⚠️ **Only safe for development**
- ⚠️ **Expires in 30 days**

### Production-Ready Rules

Before deploying, update your Firestore Security Rules:

1. **Go to Firebase Console** → Firestore Database → **Rules** tab
2. **Replace with these secure rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only access their own data
    match /users/{userId} {
      // Allow read/write to user's own profile
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow read/write to user's own transactions
      match /transactions/{transactionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Allow read/write to user's own budgets
      match /budgets/{budgetId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Allow read/write to user's own savings goals
      match /savingsGoals/{goalId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. **Click "Publish"**

### What These Rules Do:

- ✅ Users must be authenticated (logged in)
- ✅ Users can ONLY access their own data
- ✅ Users CANNOT read other users' data
- ✅ Users CANNOT modify other users' data
- ✅ Unauthenticated users have NO access

---

## 📈 Firestore Limits (Free Tier)

Firebase Spark (Free) Plan includes:

| Resource | Limit |
|----------|-------|
| Stored data | 1 GiB |
| Document reads | 50,000 / day |
| Document writes | 20,000 / day |
| Document deletes | 20,000 / day |
| Network egress | 10 GiB / month |

### This is enough for:
- ✅ ~1,000 active users per day
- ✅ ~50 transactions per user per day
- ✅ Personal or small business use
- ✅ Development and testing

### If you exceed limits:
- Upgrade to **Blaze (Pay as you go)** plan
- You only pay for what you use beyond free tier
- Very affordable for most apps

---

## 🐛 Troubleshooting

### Error: "Missing or insufficient permissions"

**Cause**: Security rules are blocking access

**Fix**:
1. Make sure you're logged in
2. Check Firestore rules in Firebase Console
3. For testing, use test mode rules (see above)

### Error: "7 PERMISSION_DENIED: Missing or insufficient permissions"

**Cause**: Trying to access another user's data

**Fix**:
- Make sure you're passing the correct userId
- Check that auth.currentUser exists

### Data not showing up in app

**Cause**: Data not syncing or loading error

**Fix**:
1. Check browser console for errors
2. Try refreshing the page
3. Call `refreshUserData()` to reload
4. Check Firebase Console to verify data exists

### Firestore Console shows no data

**Cause**: No data has been created yet

**Fix**:
1. Make sure you've created transactions/budgets/goals in the app
2. Check browser console for errors
3. Verify you're logged in as the correct user

---

## 💡 Best Practices

### 1. Always Check User Authentication

```javascript
if (!user) {
  // Redirect to login or show error
  return;
}
```

### 2. Handle Loading States

```javascript
if (loading) {
  return <LoadingSpinner />;
}
```

### 3. Handle Errors Gracefully

```javascript
try {
  await addNewTransaction(data);
  showSuccess('Transaction added!');
} catch (error) {
  console.error(error);
  showError('Failed to add transaction');
}
```

### 4. Use Optimistic Updates (Optional)

Update UI immediately, then sync with Firestore:

```javascript
// Add to local state first
setTransactions([newTransaction, ...transactions]);

// Then save to Firestore
try {
  await addNewTransaction(newTransaction);
} catch (error) {
  // Rollback on error
  setTransactions(transactions);
}
```

### 5. Batch Operations (Advanced)

For multiple writes, use Firestore batch operations:

```javascript
import { writeBatch, doc } from 'firebase/firestore';
import { db } from '../lib/helper/firebaseClient';

const batch = writeBatch(db);
batch.set(doc(db, 'users', userId, 'transactions', id1), data1);
batch.set(doc(db, 'users', userId, 'transactions', id2), data2);
await batch.commit();
```

---

## 🚀 Advanced Features

### Real-time Updates (Coming Soon)

Firestore supports real-time listeners that automatically update your UI when data changes:

```javascript
import { onSnapshot } from 'firebase/firestore';

// Listen for real-time updates
const unsubscribe = onSnapshot(
  collection(db, 'users', userId, 'transactions'),
  (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setTransactions(transactions);
  }
);
```

### Queries and Filtering

Filter data before fetching:

```javascript
import { query, where, orderBy, limit } from 'firebase/firestore';

// Get only expense transactions from last month
const q = query(
  collection(db, 'users', userId, 'transactions'),
  where('type', '==', 'expense'),
  where('date', '>=', lastMonthStart),
  orderBy('date', 'desc'),
  limit(20)
);
```

### Pagination

Load data in chunks:

```javascript
import { startAfter, getDocs } from 'firebase/firestore';

// Get first page
const first = query(collection(db, 'users', userId, 'transactions'), limit(25));
const firstSnapshot = await getDocs(first);

// Get next page
const lastVisible = firstSnapshot.docs[firstSnapshot.docs.length - 1];
const next = query(
  collection(db, 'users', userId, 'transactions'),
  startAfter(lastVisible),
  limit(25)
);
```

---

## 📚 Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Firestore Pricing](https://firebase.google.com/pricing)
- [Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

## ✅ Quick Checklist

Before going to production:

- [ ] Firestore Database enabled
- [ ] Security Rules updated (not in test mode)
- [ ] User authentication working
- [ ] Data saving correctly to Firestore
- [ ] Data loading correctly from Firestore
- [ ] Multiple users tested (data isolation verified)
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Offline persistence configured (if needed)
- [ ] Quota monitoring set up in Firebase Console

---

**🎉 Congratulations!** Your Fintrack app now uses Firestore for user-specific data storage!

Each user's data is private, secure, and synced to the cloud automatically.