# Migration Guide: Supabase to Firebase

This document outlines the changes made during the migration from Supabase to Firebase authentication.

## Overview

The Fintrack App has been migrated from Supabase to Firebase for authentication services. This migration affects authentication flows, user management, and configuration.

## What Changed

### 1. Dependencies

**Removed:**
- `@supabase/supabase-js`

**Added:**
- `firebase` (includes Firebase Auth, Firestore, Storage, etc.)

### 2. Configuration Files

**Deleted:**
- `src/lib/helper/supabaseClient.js`
- `src/supabaseClient.js`

**Created:**
- `src/lib/helper/firebaseClient.js` - Firebase initialization and configuration
- `.env.example` - Template for Firebase environment variables

### 3. Environment Variables

**Old (Supabase):**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**New (Firebase):**
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Code Changes

### Authentication Methods Mapping

| Function | Supabase | Firebase |
|----------|----------|----------|
| Sign Up | `supabase.auth.signUp()` | `createUserWithEmailAndPassword()` |
| Sign In | `supabase.auth.signInWithPassword()` | `signInWithEmailAndPassword()` |
| Sign Out | `supabase.auth.signOut()` | `signOut()` |
| Get User | `supabase.auth.getUser()` | `auth.currentUser` or `onAuthStateChanged()` |
| Auth State | `supabase.auth.onAuthStateChange()` | `onAuthStateChanged()` |
| Update Profile | User metadata in signUp options | `updateProfile()` |

### File-by-File Changes

#### 1. `src/App.jsx`

**Before (Supabase):**
```javascript
import supabase from './lib/helper/supabaseClient';

useEffect(() => {
  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };
  checkAuthStatus();
  
  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    setIsAuthenticated(!!session?.user);
  });
  
  return () => {
    authListener?.unsubscribe();
  };
}, []);
```

**After (Firebase):**
```javascript
import { auth } from './lib/helper/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setIsAuthenticated(!!user);
  });
  
  return () => {
    unsubscribe();
  };
}, []);
```

#### 2. `src/components/Login.jsx`

**Before (Supabase):**
```javascript
import supabase from '../lib/helper/supabaseClient';

const handleLogin = async (e) => {
  e.preventDefault();
  const { error } = await supabase.auth.signInWithPassword({email, password});
  if (error) {
    setError(error.message);
  } else {
    navigate("/dashboard");
  }
};
```

**After (Firebase):**
```javascript
import { auth } from '../lib/helper/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/dashboard");
  } catch (error) {
    setError(error.message);
  }
};
```

#### 3. `src/components/Register.jsx`

**Before (Supabase):**
```javascript
import supabase from '../lib/helper/supabaseClient';

const handleRegister = async (e) => {
  e.preventDefault();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name }
    }
  });
  
  if (error) {
    setError(error.message);
  } else {
    setSuccess('Registration successful! Please check your email.');
  }
};
```

**After (Firebase):**
```javascript
import { auth } from '../lib/helper/firebaseClient';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name
    });
    setSuccess('Registration successful! Redirecting...');
    setTimeout(() => navigate('/dashboard'), 2000);
  } catch (error) {
    setError(error.message);
  }
};
```

## Key Differences

### 1. Error Handling

**Supabase:**
- Returns `{ data, error }` object
- Check for `error` property

**Firebase:**
- Throws exceptions
- Use try-catch blocks

### 2. User Profile

**Supabase:**
- User metadata stored in `options.data` during sign up
- Accessible via `user.user_metadata`

**Firebase:**
- Use `updateProfile()` after user creation
- Accessible via `user.displayName`, `user.photoURL`, etc.

### 3. Email Verification

**Supabase:**
- Automatic email verification by default
- Users must verify email before logging in (configurable)

**Firebase:**
- Manual email verification using `sendEmailVerification()`
- Optional - not enforced by default

### 4. Auth State Listener

**Supabase:**
- Returns subscription object with `unsubscribe()` method
- Access via `data.subscription`

**Firebase:**
- Returns unsubscribe function directly
- Call function to unsubscribe

## Migration Steps for Existing Projects

If you're migrating an existing Fintrack installation:

### Step 1: Backup Data
- Export user data from Supabase (if needed)
- Keep a backup of your `.env` file

### Step 2: Update Dependencies
```bash
npm uninstall @supabase/supabase-js
npm install firebase
```

### Step 3: Create Firebase Project
1. Go to Firebase Console
2. Create new project
3. Enable Email/Password authentication
4. Get configuration values

### Step 4: Update Environment Variables
- Delete Supabase variables from `.env`
- Add Firebase variables (see above)

### Step 5: Update Code
- Replace all Supabase imports with Firebase imports
- Update authentication methods (see mapping table above)
- Update error handling (switch to try-catch)

### Step 6: Migrate Users
Firebase doesn't automatically import Supabase users. You have two options:

**Option A: Manual Migration**
- Export users from Supabase
- Use Firebase Admin SDK to import users
- Users will need to reset passwords

**Option B: Fresh Start**
- Users create new accounts
- Previous data can be migrated separately if needed

### Step 7: Test Authentication
- Test registration flow
- Test login flow
- Test demo login
- Test auth state persistence
- Test logout functionality

## Firebase Admin SDK (Optional)

For backend operations like user management, you may want to set up Firebase Admin:

```bash
npm install firebase-admin
```

**Note:** Admin SDK requires server-side execution and service account credentials.

## Future Enhancements

With Firebase, you can now easily add:

- **Google Sign-In**: One-click authentication
- **Phone Authentication**: SMS verification
- **Password Reset**: Built-in email flow
- **Multi-factor Authentication**: Extra security layer
- **Firestore Database**: Real-time NoSQL database
- **Cloud Storage**: File uploads and storage
- **Cloud Functions**: Serverless backend logic
- **Analytics**: User behavior tracking

## Rollback Procedure

If you need to rollback to Supabase:

1. Reinstall Supabase:
   ```bash
   npm install @supabase/supabase-js
   npm uninstall firebase
   ```

2. Restore `supabaseClient.js` from git history:
   ```bash
   git checkout <commit-hash> -- src/lib/helper/supabaseClient.js
   ```

3. Revert component changes:
   ```bash
   git checkout <commit-hash> -- src/components/Login.jsx
   git checkout <commit-hash> -- src/components/Register.jsx
   git checkout <commit-hash> -- src/App.jsx
   ```

4. Update `.env` with Supabase credentials

## Support and Resources

### Firebase Documentation
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase JavaScript SDK](https://firebase.google.com/docs/web/setup)

### Migration Resources
- [Firebase vs Supabase Comparison](https://firebase.google.com/docs)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Firebase Support](https://firebase.google.com/support)

## Troubleshooting

### Common Issues

**Issue: "Firebase: Error (auth/invalid-api-key)"**
- Solution: Check `.env` file has correct Firebase API key
- Ensure all variables start with `VITE_`

**Issue: "Firebase: Error (auth/configuration-not-found)"**
- Solution: Verify Firebase project is properly configured
- Check Auth is enabled in Firebase Console

**Issue: Demo login not working**
- Solution: Create demo user in Firebase Console
- Email: demo@demo.com, Password: demopassword

**Issue: Environment variables not loading**
- Solution: Restart development server after changing `.env`
- Ensure variables are prefixed with `VITE_`

## Conclusion

The migration from Supabase to Firebase provides:
- ✅ Simplified authentication flow
- ✅ Better error handling with try-catch
- ✅ More flexible user profile management
- ✅ Easier integration with other Firebase services
- ✅ Consistent error messages
- ✅ Better documentation and community support

The authentication functionality remains the same from a user perspective, but the underlying implementation is now more robust and extensible.