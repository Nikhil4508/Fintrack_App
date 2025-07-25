# Changelog

All notable changes to the Fintrack App project will be documented in this file.

## [2.0.0] - 2024 - Firebase Migration

### 🔥 Major Changes
- **BREAKING:** Migrated from Supabase to Firebase for authentication
- Complete rewrite of authentication system
- Updated all authentication flows and components

### ✨ Added
- Firebase SDK integration (`firebase@^12.7.0`)
- New Firebase client configuration (`src/lib/helper/firebaseClient.js`)
- Environment variable template (`.env.example`)
- Comprehensive documentation:
  - `FIREBASE_SETUP.md` - Step-by-step Firebase setup guide
  - `MIGRATION_GUIDE.md` - Detailed migration documentation
  - Updated `README.md` with Firebase instructions
  - `CHANGELOG.md` - This file

### 🔄 Changed
- **App.jsx**: 
  - Replaced Supabase auth state listener with Firebase `onAuthStateChanged`
  - Simplified authentication check logic
  - Removed async auth status check in favor of real-time listener

- **Login.jsx**: 
  - Replaced `supabase.auth.signInWithPassword()` with Firebase `signInWithEmailAndPassword()`
  - Changed error handling from object destructuring to try-catch blocks
  - Updated imports to use Firebase Auth methods

- **Register.jsx**: 
  - Replaced `supabase.auth.signUp()` with Firebase `createUserWithEmailAndPassword()`
  - Added `updateProfile()` for setting user display name
  - Changed success message (no email verification required by default)
  - Updated error handling to use try-catch blocks
  - Fixed demo registration to use proper Firebase import

- **package.json**:
  - Removed `@supabase/supabase-js@^2.50.3`
  - Added `firebase@^12.7.0`

- **README.md**:
  - Complete rewrite with Firebase-focused instructions
  - Added detailed setup steps
  - Added troubleshooting section
  - Added deployment guide
  - Added security notes

### 🗑️ Removed
- Supabase SDK dependency (`@supabase/supabase-js`)
- `src/lib/helper/supabaseClient.js`
- `src/supabaseClient.js` (if existed)
- All Supabase-specific environment variables

### 🔧 Environment Variables

#### Removed
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

#### Added
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### 🐛 Bug Fixes
- Fixed merge conflict in README.md
- Improved error handling consistency across authentication flows
- Fixed auth state persistence

### 📝 Documentation Improvements
- Added comprehensive Firebase setup guide
- Added migration guide for existing users
- Added troubleshooting section with common issues
- Added security best practices
- Added deployment instructions
- Created `.env.example` template

### 🔐 Security
- Environment variables properly configured in `.gitignore`
- Added security notes in documentation
- Documented Firebase security rules recommendations
- Documented API key restriction best practices

### 🎯 Developer Experience
- Simplified authentication code with try-catch error handling
- More intuitive API with Firebase methods
- Better error messages from Firebase
- Improved code consistency

### 📦 Dependencies Update Summary

**Removed:**
```json
"@supabase/supabase-js": "^2.50.3"
```

**Added:**
```json
"firebase": "^12.7.0"
```

### 🔀 API Changes

| Feature | Supabase | Firebase |
|---------|----------|----------|
| Sign Up | `supabase.auth.signUp()` | `createUserWithEmailAndPassword()` |
| Sign In | `supabase.auth.signInWithPassword()` | `signInWithEmailAndPassword()` |
| Sign Out | `supabase.auth.signOut()` | `signOut()` |
| Get User | `supabase.auth.getUser()` | `auth.currentUser` |
| Auth Listener | `supabase.auth.onAuthStateChange()` | `onAuthStateChanged()` |
| User Profile | User metadata in options | `updateProfile()` |

### ⚠️ Breaking Changes

1. **Authentication Required Setup**
   - Users must create a Firebase project
   - Must configure 6 environment variables (previously 2)
   - Must manually create demo user in Firebase Console

2. **No Automatic Email Verification**
   - Supabase had automatic email verification
   - Firebase requires manual implementation if needed

3. **User Profile Data**
   - User metadata structure changed
   - Profile updates use different method
   - Display name stored differently

4. **Error Handling**
   - Changed from `{ data, error }` pattern to try-catch
   - Different error codes and messages

### 📋 Migration Checklist

For users upgrading from Supabase version:

- [ ] Create Firebase project
- [ ] Enable Email/Password authentication in Firebase
- [ ] Create demo user (demo@demo.com)
- [ ] Copy Firebase configuration values
- [ ] Update `.env` file with new variables
- [ ] Remove old Supabase variables
- [ ] Update dependencies (`npm install`)
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test demo login
- [ ] Test logout
- [ ] Verify auth state persistence

### 🚀 What's Next

Potential future enhancements now available with Firebase:

- **Firestore Integration** - Real-time database for transactions and budgets
- **Cloud Storage** - File uploads for receipts and documents
- **Google Sign-In** - Social authentication
- **Phone Authentication** - SMS verification
- **Password Reset** - Email-based password recovery
- **Multi-factor Authentication** - Enhanced security
- **Cloud Functions** - Serverless backend logic
- **Firebase Analytics** - User behavior tracking
- **Remote Config** - Dynamic app configuration
- **Cloud Messaging** - Push notifications

### 🙏 Acknowledgments

This migration improves the app's authentication system by leveraging Firebase's robust and well-documented authentication service, providing a better foundation for future features and enhancements.

---

## Previous Versions

### [1.0.0] - Initial Release (Supabase Version)
- Initial release with Supabase authentication
- Basic transaction tracking
- Budget management
- Savings goals
- User settings
- Dark/Light theme support

---

For detailed migration instructions, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
For Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)