# Firebase Setup Guide for Fintrack App

This guide will help you set up Firebase for the Fintrack App step-by-step.

## Prerequisites

- A Google account
- Node.js and npm installed
- Fintrack App cloned and dependencies installed

## Step-by-Step Setup

### 1. Create a Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Add project" or "Create a project"
   - Enter a project name (e.g., "Fintrack App")
   - Click "Continue"

3. **Google Analytics (Optional)**
   - Choose whether to enable Google Analytics
   - If enabled, select or create an Analytics account
   - Click "Create project"
   - Wait for the project to be created (takes a few seconds)

### 2. Register Your Web App

1. **Add a Web App**
   - In your Firebase project dashboard, click the web icon (`</>`)
   - Or go to Project Settings > General > Your apps

2. **Register App**
   - Enter an app nickname: "Fintrack Web"
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

3. **Save Firebase Configuration**
   - You'll see a code snippet with your Firebase config
   - **IMPORTANT:** Copy these values, you'll need them soon!
   
   It should look like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

4. **Click "Continue to console"**

### 3. Enable Email/Password Authentication

1. **Navigate to Authentication**
   - In the left sidebar, click "Build" > "Authentication"
   - Click "Get started"

2. **Enable Email/Password Provider**
   - Click on the "Sign-in method" tab
   - Find "Email/Password" in the list
   - Click on it to expand
   - Toggle the first switch to "Enabled" (Email/Password)
   - Click "Save"

   **Note:** You can leave "Email link (passwordless sign-in)" disabled

### 4. Create Demo User (Required for Demo Login)

1. **Go to Users Tab**
   - Still in Authentication, click the "Users" tab
   - Click "Add user"

2. **Create Demo Account**
   - Email: `demo@demo.com`
   - Password: `demopassword`
   - Click "Add user"

   **Note:** This demo account is required for the "Demo Login" button to work!

### 5. Configure Firebase in Your App

1. **Create .env File**
   - In the root of your Fintrack_App directory, create a file named `.env`
   - Copy the contents from `.env.example`

2. **Add Your Firebase Config**
   - Open the `.env` file
   - Replace the placeholder values with your Firebase config values:

   ```env
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```

   **IMPORTANT:** 
   - All variables MUST start with `VITE_`
   - No quotes around the values
   - No spaces before or after the `=`

3. **Save the File**
   - Make sure the file is named exactly `.env` (with the dot at the beginning)
   - Save and close

### 6. Start Your App

1. **Stop Your Dev Server** (if running)
   - Press `Ctrl + C` in the terminal

2. **Restart the Development Server**
   ```bash
   npm run dev
   ```

3. **Open Your Browser**
   - Navigate to: http://localhost:5173
   - The app should now load without errors

### 7. Test Authentication

1. **Test Registration**
   - Click "Register" or navigate to `/register`
   - Fill in the form with a test email and password
   - Click "Register"
   - You should be redirected to the dashboard

2. **Test Login**
   - Log out (if logged in)
   - Navigate to `/login`
   - Enter your test credentials
   - Click "Login"
   - You should be redirected to the dashboard

3. **Test Demo Login**
   - Log out (if logged in)
   - Navigate to `/login`
   - Click "Demo Login (No Account Required)"
   - You should be logged in as the demo user

## Troubleshooting

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Cause:** The API key in your `.env` file is incorrect or missing.

**Solution:**
1. Double-check your `.env` file
2. Make sure `VITE_FIREBASE_API_KEY` matches the `apiKey` from Firebase Console
3. Ensure there are no extra spaces or quotes
4. Restart your dev server

### Issue: "Firebase: Error (auth/configuration-not-found)"

**Cause:** Firebase project is not properly configured or Auth is not enabled.

**Solution:**
1. Go to Firebase Console
2. Navigate to Authentication
3. Make sure "Email/Password" is enabled
4. Check that your project ID is correct in `.env`

### Issue: Demo Login Button Shows Error

**Cause:** Demo user (`demo@demo.com`) doesn't exist in Firebase.

**Solution:**
1. Go to Firebase Console > Authentication > Users
2. Add user with email: `demo@demo.com` and password: `demopassword`
3. Try demo login again

### Issue: Changes to .env Not Reflecting

**Cause:** Vite doesn't hot-reload environment variables.

**Solution:**
1. Stop your dev server (`Ctrl + C`)
2. Restart it: `npm run dev`
3. Hard refresh your browser (`Ctrl + Shift + R` or `Cmd + Shift + R`)

### Issue: "Module not found" Errors

**Cause:** Dependencies not installed properly.

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Firebase Console Shows No Users After Registration

**Cause:** This is normal! Firebase creates users even if they don't show immediately.

**Solution:**
1. Refresh the Users page in Firebase Console
2. Check the "Sign-in method" tab for activity
3. Try logging in - if it works, the user exists

## Security Best Practices

### 1. Never Commit .env File
The `.env` file contains sensitive credentials and should NEVER be committed to version control.

**Check your .gitignore:**
```bash
cat .gitignore | grep .env
```
Should show: `.env`

### 2. Firebase Security Rules (Optional but Recommended)

If you plan to use Firestore or Storage later, set up security rules:

1. Go to Firebase Console
2. Navigate to Firestore Database or Storage
3. Click on "Rules" tab
4. Configure appropriate access rules

Example for development:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. API Key Restrictions (For Production)

1. Go to Google Cloud Console
2. Navigate to APIs & Services > Credentials
3. Find your Firebase API key
4. Add application restrictions (HTTP referrers)
5. Add your production domain

## Firebase Quotas (Free Tier)

The Firebase Free (Spark) plan includes:

- **Authentication:** Unlimited users
- **Realtime Database:** 1 GB storage, 10 GB/month bandwidth
- **Cloud Firestore:** 1 GiB storage, 50K reads/day, 20K writes/day
- **Cloud Storage:** 5 GB storage, 1 GB/day bandwidth
- **Hosting:** 10 GB storage, 360 MB/day bandwidth

This is more than enough for development and small apps!

## Next Steps

Now that Firebase is set up, you can:

1. **Add Firestore Database** - Store user transactions, budgets, etc.
2. **Add Cloud Storage** - Allow users to upload receipt images
3. **Add Google Sign-In** - One-click authentication
4. **Add Phone Auth** - SMS verification
5. **Deploy to Firebase Hosting** - Host your app for free

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Reference](https://firebase.google.com/docs/reference/js/auth)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Status Dashboard](https://status.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)

## Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Review this guide's Troubleshooting section
3. Check Firebase Console for any alerts or issues
4. Review the Firebase documentation
5. Open an issue on the project's GitHub repository

---

**Congratulations!** 🎉 Your Fintrack App is now powered by Firebase!