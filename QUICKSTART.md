# Quick Start Guide - Fintrack App with Firebase

Get your Fintrack App up and running in 5 minutes!

## 🚀 Quick Setup

### Step 1: Install Dependencies (1 minute)

```bash
cd Fintrack_App
npm install
```

### Step 2: Firebase Setup (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or select existing)
3. Click the web icon (`</>`) to add a web app
4. Copy the configuration values

### Step 3: Configure Environment (1 minute)

1. Create `.env` file in the root directory:

```bash
cp .env.example .env
```

2. Open `.env` and paste your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
```

### Step 4: Enable Authentication (1 minute)

1. In Firebase Console, go to **Authentication** > **Get started**
2. Click **Sign-in method** tab
3. Enable **Email/Password**
4. Click **Save**

### Step 5: Create Demo User (Optional - 30 seconds)

For demo login to work:

1. In Firebase Console, go to **Authentication** > **Users**
2. Click **Add user**
3. Email: `demo@demo.com`
4. Password: `demopassword`
5. Click **Add user**

### Step 6: Run the App! (30 seconds)

```bash
npm run dev
```

Open your browser to: **http://localhost:5173**

## ✅ You're Done!

The app should now be running. You can:

- **Register** a new account
- **Login** with your account
- **Use Demo Login** (if you created the demo user)

---

## 🎯 First Time Using the App?

### Create Your First Account

1. Click **Register** on the homepage
2. Fill in your details:
   - Full Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
3. Click **Register**
4. You'll be redirected to the dashboard

### Or Use Demo Account

1. Click **Login** on the homepage
2. Click **Demo Login (No Account Required)**
3. Explore the app with pre-loaded demo data

---

## 📱 App Features

### Dashboard
- Overview of your finances
- Income vs Expenses
- Recent transactions
- Budget status

### Transactions
- Add new transactions
- View transaction history
- Filter and search
- Edit or delete transactions

### Budgets
- Set spending limits by category
- Track budget usage
- Visual progress indicators
- Budget alerts

### Savings Goals
- Create savings targets
- Track progress
- Set deadlines
- Visualize achievements

### Settings
- Update profile
- Change password
- Theme preferences (Dark/Light)
- App customization

---

## 🆘 Common Issues

### Issue: "Firebase: Error (auth/invalid-api-key)"

**Fix:** Check your `.env` file - make sure all values are correct and there are no extra spaces.

### Issue: Demo login not working

**Fix:** Create the demo user in Firebase Console (see Step 5 above).

### Issue: Changes to .env not working

**Fix:** Restart your dev server:
```bash
# Press Ctrl+C to stop
npm run dev
```

### Issue: Port 5173 already in use

**Fix:** Kill the process or use a different port:
```bash
npm run dev -- --port 3000
```

---

## 🔥 Firebase Console Quick Links

Once your project is created, bookmark these:

- **Dashboard**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/overview`
- **Authentication**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication/users`
- **Project Settings**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/settings/general`

---

## 📚 Need More Help?

- **Detailed Setup**: See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- **Full Documentation**: See [README.md](./README.md)
- **Migration Guide**: See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **Changelog**: See [CHANGELOG.md](./CHANGELOG.md)

---

## 🎨 Customize Your Experience

### Change Theme
- Go to **Settings** in the app
- Toggle between Dark and Light modes

### Update Profile
- Go to **Settings**
- Update your display name
- Change your email or password

---

## 🚢 Ready to Deploy?

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

Your app will be live at: `https://YOUR_PROJECT_ID.web.app`

---

## 💡 Pro Tips

1. **Keyboard Shortcuts**: Most forms can be submitted with `Enter`
2. **Demo Mode**: Use demo account to test features without affecting your data
3. **Responsive Design**: Works great on mobile, tablet, and desktop
4. **Dark Mode**: Better for night-time budgeting! 🌙
5. **Regular Backups**: Export your data regularly (feature coming soon)

---

## 🎉 Enjoy Fintrack!

You're all set! Start tracking your finances like a pro.

**Questions or Issues?**
- Check the documentation files
- Open an issue on GitHub
- Review Firebase documentation

Happy tracking! 💰📊