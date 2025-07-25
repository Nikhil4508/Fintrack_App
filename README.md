# Fintrack App

A modern personal finance tracking application built with React, Vite, and Firebase.

## Features

- 📊 Dashboard with financial overview
- 💰 Transaction tracking
- 📈 Budget management
- 🎯 Savings goals
- ⚙️ User settings and preferences
- 🔐 Firebase authentication (Email/Password)
- 🎨 Dark/Light theme support

## Tech Stack

- **Frontend:** React 19, React Router
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth
- **Icons:** Lucide React
- **Charts:** Recharts, Chart.js

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm or yarn
- A Firebase account ([Create one here](https://firebase.google.com/))

## Firebase Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

### 2. Enable Firebase Authentication

1. In the Firebase Console, navigate to **Build > Authentication**
2. Click "Get started"
3. Enable the **Email/Password** sign-in method
4. Click "Save"

### 3. Create a Demo User (Optional)

For the demo login functionality to work, create a demo user:

1. In Firebase Console, go to **Authentication > Users**
2. Click "Add user"
3. Email: `demo@demo.com`
4. Password: `demopassword`
5. Click "Add user"

### 4. Get Firebase Configuration

1. In the Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Fintrack App")
5. Copy the Firebase configuration object

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Fintrack_App
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit your `.env` file to version control!

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
Fintrack_App/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # React components
│   │   ├── layout/      # Layout components
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Budgets.jsx
│   │   ├── SavingsGoals.jsx
│   │   ├── Settings.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── context/         # React context providers
│   ├── data/            # Mock/static data
│   ├── lib/             # Utilities and helpers
│   │   └── helper/
│   │       └── firebaseClient.js  # Firebase configuration
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # App entry point
│   └── index.css        # Global styles
├── public/              # Public assets
├── .env.example         # Example environment variables
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
└── README.md
```

## Authentication Flow

The app uses Firebase Authentication with the following flow:

1. **Registration:** Users can create an account with email and password
2. **Login:** Existing users can log in with their credentials
3. **Demo Mode:** Users can try the app without registration using the demo account
4. **Protected Routes:** Dashboard and other features require authentication
5. **Auth State:** The app monitors authentication state and redirects accordingly

## Deployment

### Build for production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Deploy to Firebase Hosting (Optional)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init hosting
```

4. Deploy:
```bash
firebase deploy
```

## Security Notes

- Never commit your `.env` file or expose Firebase credentials
- The `.gitignore` file is configured to exclude `.env` files
- Firebase security rules should be configured in the Firebase Console
- Consider implementing Firebase Security Rules for production apps

## Troubleshooting

### Authentication Errors

- **Error: "Firebase: Error (auth/invalid-api-key)"**
  - Check that your Firebase API key in `.env` is correct
  - Ensure all environment variables are prefixed with `VITE_`

- **Error: "Firebase: Error (auth/user-not-found)"**
  - The user doesn't exist. Create an account or use the demo login

- **Demo login not working**
  - Ensure you've created the demo user in Firebase Console with email `demo@demo.com`

### Build Errors

- **Module not found errors**
  - Run `npm install` to ensure all dependencies are installed
  - Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using React and Firebase