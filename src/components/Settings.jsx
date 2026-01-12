import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Settingmodal from "./Settingmodal";
import { ImageContext } from "../context/ImageContext";
import { auth } from "../lib/helper/firebaseClient";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import Avatar from "./Avatar";
import { notifyPreferencesChanged } from "../lib/userPreferences";

const Settings = () => {
  const location = useLocation();
  const { image, theme, setTheme } = useContext(ImageContext);
  const [activeTab, setActiveTab] = useState(
    location.state?.tab || "Appearance",
  );
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [isDemoAccount, setIsDemoAccount] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  // Notification preferences state - Load from localStorage
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("fintrack_notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          emailNotifications: true,
          pushNotifications: true,
          budgetAlerts: true,
          paymentReminders: true,
          savingsGoalsUpdates: true,
        };
      }
    }
    return {
      emailNotifications: true,
      pushNotifications: true,
      budgetAlerts: true,
      paymentReminders: true,
      savingsGoalsUpdates: true,
    };
  });
  const [notificationMessage, setNotificationMessage] = useState("");

  // Preferences state - Load from localStorage
  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem("fintrack_preferences");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {
          currency: "USD - US Dollar",
          dateFormat: "MM/DD/YYYY",
          startWeekOn: "Sunday",
          autoCategorize: true,
        };
      }
    }
    return {
      currency: "USD - US Dollar",
      dateFormat: "MM/DD/YYYY",
      startWeekOn: "Sunday",
      autoCategorize: true,
    };
  });
  const [preferenceMessage, setPreferenceMessage] = useState("");

  // Dropdown states for preferences
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [dateFormatDropdownOpen, setDateFormatDropdownOpen] = useState(false);
  const [startWeekDropdownOpen, setStartWeekDropdownOpen] = useState(false);

  // Currency options
  const currencyOptions = [
    "USD - US Dollar",
    "EUR - Euro",
    "GBP - British Pound",
    "JPY - Japanese Yen",
    "CAD - Canadian Dollar",
    "AUD - Australian Dollar",
    "INR - Indian Rupee",
  ];

  // Date format options
  const dateFormatOptions = [
    "MM/DD/YYYY",
    "DD/MM/YYYY",
    "YYYY-MM-DD",
    "DD-MM-YYYY",
  ];

  // Start week options
  const startWeekOptions = ["Sunday", "Monday"];

  // Get current user from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const isDemo = user.email === "demo@demo.com";
        setIsDemoAccount(isDemo);
        setFullName(user.displayName || (isDemo ? "Demo User" : ""));
        setEmail(user.email || "");
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen for avatar update events
  useEffect(() => {
    const handleAvatarUpdate = () => {
      // Force refresh of current user to get updated photoURL
      const user = auth.currentUser;
      if (user) {
        setCurrentUser({ ...user });
      }
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);

  // Update active tab when location state changes
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const handleThemeChange = (newTheme) => {
    if (newTheme === "system-theme") {
      const prefersDarkScheme = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDarkScheme ? "dark-theme" : "light-theme");
    } else {
      setTheme(newTheme);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser || isDemoAccount) return;

    setIsLoading(true);
    setProfileMessage("");

    try {
      // Update display name
      if (fullName !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: fullName,
        });
      }

      // Update email if changed
      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      setProfileMessage("Profile updated successfully!");
      setTimeout(() => setProfileMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setProfileMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser || isDemoAccount) return;

    setPasswordLoading(true);
    setPasswordMessage("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("All password fields are required");
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords do not match");
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("New password must be at least 6 characters");
      setPasswordLoading(false);
      return;
    }

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPassword);

      setPasswordMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        setPasswordMessage("Current password is incorrect");
      } else {
        setPasswordMessage(`Error: ${error.message}`);
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Toggle notification setting
  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Save notification preferences
  const handleSaveNotifications = () => {
    try {
      localStorage.setItem(
        "fintrack_notifications",
        JSON.stringify(notifications),
      );
      setNotificationMessage("Notification preferences saved successfully!");
      setTimeout(() => setNotificationMessage(""), 3000);
    } catch (error) {
      console.error("Error saving notifications:", error);
      setNotificationMessage("Error saving preferences. Please try again.");
      setTimeout(() => setNotificationMessage(""), 3000);
    }
  };

  // Update preference setting
  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Toggle auto-categorize
  const toggleAutoCategorize = () => {
    setPreferences((prev) => ({
      ...prev,
      autoCategorize: !prev.autoCategorize,
    }));
  };

  // Save preferences
  const handleSavePreferences = () => {
    try {
      localStorage.setItem("fintrack_preferences", JSON.stringify(preferences));
      notifyPreferencesChanged(); // Notify all components of preference change
      setPreferenceMessage("Preferences saved successfully!");
      setTimeout(() => setPreferenceMessage(""), 3000);
    } catch (error) {
      console.error("Error saving preferences:", error);
      setPreferenceMessage("Error saving preferences. Please try again.");
      setTimeout(() => setPreferenceMessage(""), 3000);
    }
  };

  return (
    <>
      {showModal && <Settingmodal onClose={() => setShowModal(false)} />}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--heading-text)]">
            Settings
          </h2>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm lg:w-1/3 w-full">
            <div className="p-6 pt-6 ">
              <div className="flex flex-col items-center space-y-4">
                <Avatar user={currentUser} size="2xl" />
                <div className="space-y-1 text-center">
                  <h3 className="text-xl font-semibold">
                    {currentUser?.displayName || "User"}
                  </h3>
                  <p className="text-sm text-[var(--sub-heading-text)]">
                    {currentUser?.email || "No email"}
                  </p>
                </div>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--sub-background-color)] bg-background hover:bg-[var(--sub-background-color)] hover:text-accent-foreground h-10 px-4 py-2 w-full cursor-pointer"
                  onClick={() => setShowModal(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-arrow-up-from-line-icon lucide-arrow-up-from-line mr-2 h-4 w-4"
                  >
                    <path d="m18 9-6-6-6 6" />
                    <path d="M12 3v14" />
                    <path d="M5 21h14" />
                  </svg>
                  Change Avatar
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="space-y-4">
              {/* top button */}
              <div className="h-auto md:h-10 items-center justify-center rounded-md bg-[var(--sub-background-color)] p-1 text-[var(--sub-heading-text)] grid grid-cols-2 md:grid-cols-4 gap-1">
                <button
                  type="button"
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${activeTab === "Appearance" ? "bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm" : ""}`}
                  onClick={() => setActiveTab("Appearance")}
                >
                  Appearance
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${activeTab === "Profile" ? "bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm" : ""}`}
                  onClick={() => setActiveTab("Profile")}
                >
                  Profile
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${activeTab === "Notifications" ? "bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm" : ""}`}
                  onClick={() => setActiveTab("Notifications")}
                >
                  Notifications
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-2 md:px-3 py-1.5 text-xs md:text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${activeTab === "Preferences" ? "bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm" : ""}`}
                  onClick={() => setActiveTab("Preferences")}
                >
                  Preferences
                </button>
              </div>
              {/* main section */}
              {activeTab === "Appearance" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Appearance
                      </h3>
                      <p className="text-sm text-[var(--sub-heading-text)]">
                        Customize how the dashboard looks and feels.
                      </p>
                    </div>
                    <div className="p-6 pt-0 space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ">
                          Theme
                        </label>
                        {/* mode buttons */}
                        <div className="mt-2 grid grid-cols-3 gap-4">
                          <div>
                            <button
                              type="button"
                              className={`aspect-square h-4 w-4 rounded-full border text-[var(--heading-text)] ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer sr-only`}
                              id="theme-light"
                              onClick={() => handleThemeChange("light-theme")}
                            ></button>
                            <label
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-[var(--sub-background-color)]  bg-popover p-4 ${theme === "light-theme" ? "border-black hover:bg-[var(--sub-background-color)]" : "hover:bg-[var(--sub-background-color)]"}`}
                              for="theme-light"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="md:mb-3 h-6 w-6 lucide lucide-sun-icon lucide-sun"
                              >
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2" />
                                <path d="M12 20v2" />
                                <path d="m4.93 4.93 1.41 1.41" />
                                <path d="m17.66 17.66 1.41 1.41" />
                                <path d="M2 12h2" />
                                <path d="M20 12h2" />
                                <path d="m6.34 17.66-1.41 1.41" />
                                <path d="m19.07 4.93-1.41 1.41" />
                              </svg>
                              <span className="hidden md:inline">Light</span>
                            </label>
                          </div>
                          <div className="">
                            <button
                              type="button"
                              className={`aspect-square h-4 w-4 rounded-full border border-primary text-[var(--heading-text)] ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer sr-only`}
                              id="theme-dark"
                              onClick={() => handleThemeChange("dark-theme")}
                            ></button>
                            <label
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-[var(--sub-background-color)] bg-popover p-4 ${theme === "dark-theme" ? "border-white hover:bg-[var(--sub-background-color)]" : "hover:bg-[var(--sub-background-color)]"} `}
                              for="theme-dark"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="md:mb-3 h-6 w-6 lucide lucide-moon-icon lucide-moon"
                              >
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                              </svg>
                              <span className="hidden md:inline">Dark</span>
                            </label>
                          </div>
                          <div className="">
                            <button
                              type="button"
                              className={`aspect-square h-4 w-4 rounded-full border border-primary ${theme === "system-theme" ? "border-white hover:bg-[var(--sub-background-color)]" : ""}  text-[var(--heading-text)] ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer sr-only`}
                              id="theme-system"
                              onClick={() => handleThemeChange("system-theme")}
                            ></button>
                            <label
                              className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-[var(--sub-background-color)]  bg-popover p-4 ${theme === "system-theme" ? "border-white" : "hover:bg-[var(--sub-background-color)]"} `}
                              for="theme-system"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="md:mb-3 h-6 w-6 lucide lucide-monitor-icon lucide-monitor"
                              >
                                <rect
                                  width="20"
                                  height="14"
                                  x="2"
                                  y="3"
                                  rx="2"
                                />
                                <line x1="8" x2="16" y1="21" y2="21" />
                                <line x1="12" x2="12" y1="17" y2="21" />
                              </svg>
                              <span className="hidden md:inline">System</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <button className="mt-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover-bg)] h-10 px-4 py-2 gap-2 cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-save-icon lucide-save h-4 w-4"
                        >
                          <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                          <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                          <path d="M7 3v4a1 1 0 0 0 1 1h7" />
                        </svg>
                        Save Appearance
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* profile section */}
              {activeTab === "Profile" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Profile
                      </h3>
                      <p className="text-sm text-[var(--sub-heading-text)]">
                        Manage your personal information and account settings.
                      </p>
                    </div>
                    <div className="p-6 pt-0 space-y-6">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="name"
                        >
                          Full Name
                        </label>
                        <input
                          className="mt-2 flex h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          id="name"
                          disabled={isDemoAccount}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="email"
                        >
                          Email Address
                        </label>
                        <input
                          className="mt-2 flex h-10 w-full rounded-md border border-[var(--border-color)] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          id="email"
                          type="email"
                          disabled={isDemoAccount}
                        />
                      </div>
                      {isDemoAccount && (
                        <p className="text-sm text-yellow-500">
                          Demo account profile cannot be edited
                        </p>
                      )}
                      {profileMessage && (
                        <p
                          className={`text-sm ${profileMessage.includes("Error") ? "text-red-500" : "text-green-500"}`}
                        >
                          {profileMessage}
                        </p>
                      )}
                      <button
                        onClick={handleSaveProfile}
                        disabled={isLoading || isDemoAccount}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-primary/90 h-10 px-4 py-2 gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-save-icon lucide-save h-4 w-4"
                        >
                          <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                          <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                          <path d="M7 3v4a1 1 0 0 0 1 1h7" />
                        </svg>
                        {isLoading ? "Saving..." : "Save Profile"}
                      </button>
                      {!isDemoAccount && (
                        <>
                          <div className="shrink-0 bg-[var(--sub-background-color)] h-[1px] w-full"></div>
                          <h3 className="text-lg font-medium">
                            Change Password
                          </h3>
                          <div className="space-y-2">
                            <label
                              for="current-password"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Current Password
                            </label>
                            <input
                              id="current-password"
                              placeholder="Enter your password"
                              type="password"
                              value={currentPassword}
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                              className="mt-2 flex h-10 w-full rounded-md border border-[var(--border-color)] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              for="new-password"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              New Password
                            </label>
                            <input
                              id="new-password"
                              placeholder="Enter new password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="mt-2 flex h-10 w-full rounded-md border border-[var(--border-color)] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              for="confirm-password"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Confirm Password
                            </label>
                            <input
                              id="confirm-password"
                              placeholder="Confirm new password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              className="mt-2 flex h-10 w-full rounded-md border border-[var(--border-color)] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                          </div>
                          {passwordMessage && (
                            <p
                              className={`text-sm ${passwordMessage.includes("Error") || passwordMessage.includes("incorrect") || passwordMessage.includes("required") || passwordMessage.includes("do not match") || passwordMessage.includes("must be") ? "text-red-500" : "text-green-500"}`}
                            >
                              {passwordMessage}
                            </p>
                          )}
                          <button
                            onClick={handleChangePassword}
                            disabled={passwordLoading}
                            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-primary/90 h-10 px-4 py-2 gap-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="lucide lucide-check-icon lucide-check h-4 w-4"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                            {passwordLoading
                              ? "Changing..."
                              : "Change Password"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* notifications section */}
              {activeTab === "Notifications" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-color)] shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl text-[var(--heading-text)] font-semibold leading-none tracking-tight">
                        Notifications
                      </h3>
                      <p className="text-sm text-[var(--sub-heading-text)]">
                        Configure how you want to receive notifications.
                      </p>
                    </div>
                    <div className="p-6 pt-0 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg text-[var(--heading-text)] font-medium">
                          Notification Channels
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-[var(--heading-text)]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="lucide lucide-bell-icon lucide-bell h-4 w-4"
                            >
                              <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                              <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                            </svg>
                            <label
                              for="email-notifications"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Email Notifications
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              toggleNotification("emailNotifications")
                            }
                            className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${notifications.emailNotifications ? "bg-[var(--btn-primary-bg)]" : "bg-[var(--sub-background-color)]"}`}
                            id="email-notifications"
                          >
                            <span
                              className={`pointer-events-none block h-5 w-5 rounded-full bg-[var(--background-color)] shadow-lg ring-0 transition-transform ${notifications.emailNotifications ? "translate-x-5" : "translate-x-0"}`}
                            ></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-[var(--heading-text)]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="lucide lucide-bell-icon lucide-bell h-4 w-4"
                            >
                              <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                              <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                            </svg>
                            <label
                              for="push-notifications"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Push Notifications
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              toggleNotification("pushNotifications")
                            }
                            className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${notifications.pushNotifications ? "bg-[var(--btn-primary-bg)]" : "bg-[var(--sub-background-color)]"}`}
                            id="push-notifications"
                          >
                            <span
                              className={`pointer-events-none block h-5 w-5 rounded-full bg-[var(--background-color)] shadow-lg ring-0 transition-transform ${notifications.pushNotifications ? "translate-x-5" : "translate-x-0"}`}
                            ></span>
                          </button>
                        </div>
                      </div>
                      <div className="shrink-0 bg-[var(--sub-background-color)] h-[2px] w-full"></div>
                      <div className="space-y-4">
                        <h3 className="text-lg text-[var(--heading-text)] font-medium">
                          Notifications Types
                        </h3>
                        <div className="flex items-center justify-between text-[var(--heading-text)]">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            for="budget-alerts"
                          >
                            Budget Alerts
                          </label>
                          <button
                            type="button"
                            onClick={() => toggleNotification("budgetAlerts")}
                            className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${notifications.budgetAlerts ? "bg-[var(--btn-primary-bg)]" : "bg-[var(--sub-background-color)]"}`}
                            id="budget-alerts"
                          >
                            <span
                              className={`pointer-events-none block h-5 w-5 rounded-full bg-[var(--background-color)] shadow-lg ring-0 transition-transform ${notifications.budgetAlerts ? "translate-x-5" : "translate-x-0"}`}
                            ></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[var(--heading-text)]">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            for="payment-remainders"
                          >
                            Payment Remainders
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              toggleNotification("paymentReminders")
                            }
                            className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${notifications.paymentReminders ? "bg-[var(--btn-primary-bg)]" : "bg-[var(--sub-background-color)]"}`}
                            id="payment-remainders"
                          >
                            <span
                              className={`pointer-events-none block h-5 w-5 rounded-full bg-[var(--background-color)] shadow-lg ring-0 transition-transform ${notifications.paymentReminders ? "translate-x-5" : "translate-x-0"}`}
                            ></span>
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-[var(--heading-text)]">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            for="savings-goals"
                          >
                            Save Goals Updates
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              toggleNotification("savingsGoalsUpdates")
                            }
                            className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${notifications.savingsGoalsUpdates ? "bg-[var(--btn-primary-bg)]" : "bg-[var(--sub-background-color)]"}`}
                            id="savings-goals"
                          >
                            <span
                              className={`pointer-events-none block h-5 w-5 rounded-full bg-[var(--background-color)] shadow-lg ring-0 transition-transform ${notifications.savingsGoalsUpdates ? "translate-x-5" : "translate-x-0"}`}
                            ></span>
                          </button>
                        </div>
                      </div>
                      {notificationMessage && (
                        <div className="p-4 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-sm">
                          {notificationMessage}
                        </div>
                      )}
                      <button
                        onClick={handleSaveNotifications}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover-bg)] h-10 px-4 py-2 gap-2 cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-save-icon lucide-save h-4 w-4"
                        >
                          <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                          <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                          <path d="M7 3v4a1 1 0 0 0 1 1h7" />
                        </svg>
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* preferences section */}
              {activeTab === "Preferences" && (
                <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Preferences
                      </h3>
                      <p className="text-sm text-[var(--sub-heading-text)]">
                        Customize your financial dashboard experience.
                      </p>
                    </div>
                    <div className="p-6 pt-0 space-y-6">
                      <div className="space-y-2 relative">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="currency"
                        >
                          Currency
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrencyDropdownOpen(!currencyDropdownOpen)
                          }
                          className="flex h-10 w-full items-center justify-between rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm ring-offset-background placeholder:text-[var(--sub-heading-text)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-2 cursor-pointer"
                          id="currency"
                        >
                          <span className="pointer-none text-[var(--heading-text)]">
                            {preferences.currency}
                          </span>
                          <ChevronDown className="text-[var(--sub-heading-text)]" />
                        </button>
                        {currencyDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-full bg-[var(--background-color)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-auto">
                            {currencyOptions.map((currency) => (
                              <div
                                key={currency}
                                className={`px-4 py-2 cursor-pointer hover:bg-[var(--sub-background-color)] text-sm text-[var(--heading-text)] ${preferences.currency === currency ? "bg-[var(--sub-background-color)] font-semibold" : ""}`}
                                onClick={() => {
                                  updatePreference("currency", currency);
                                  setCurrencyDropdownOpen(false);
                                }}
                              >
                                {currency}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 relative">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="data-format"
                        >
                          Date Format
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setDateFormatDropdownOpen(!dateFormatDropdownOpen)
                          }
                          className="flex h-10 w-full items-center justify-between rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm ring-offset-background placeholder:text-[var(--sub-heading-text)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-2 cursor-pointer"
                          id="data-format"
                        >
                          <span className="pointer-none text-[var(--heading-text)]">
                            {preferences.dateFormat}
                          </span>
                          <ChevronDown className="text-[var(--sub-heading-text)]" />
                        </button>
                        {dateFormatDropdownOpen && (
                          <div className="absolute z-10 mt-1 w-full bg-[var(--background-color)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-auto">
                            {dateFormatOptions.map((format) => (
                              <div
                                key={format}
                                className={`px-4 py-2 cursor-pointer hover:bg-[var(--sub-background-color)] text-sm text-[var(--heading-text)] ${preferences.dateFormat === format ? "bg-[var(--sub-background-color)] font-semibold" : ""}`}
                                onClick={() => {
                                  updatePreference("dateFormat", format);
                                  setDateFormatDropdownOpen(false);
                                }}
                              >
                                {format}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 bg-[var(--sub-background-color)] h-[2px] w-full"></div>

                      <div className="space-y-2 relative">
                        <div className="flex items-center justify-between">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="start-day"
                          >
                            Start Week On
                          </label>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setStartWeekDropdownOpen(!startWeekDropdownOpen)
                              }
                              className="flex h-10 items-center justify-between rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm ring-offset-background placeholder:text-[var(--sub-heading-text)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-[180px] cursor-pointer"
                              id="start-day"
                            >
                              <span className="pointer-none text-[var(--heading-text)]">
                                {preferences.startWeekOn}
                              </span>
                              <ChevronDown className="text-[var(--sub-heading-text)]" />
                            </button>
                            {startWeekDropdownOpen && (
                              <div className="absolute z-10 mt-1 w-full bg-[var(--background-color)] border border-[var(--border-color)] rounded-md shadow-lg">
                                {startWeekOptions.map((day) => (
                                  <div
                                    key={day}
                                    className={`px-4 py-2 cursor-pointer hover:bg-[var(--sub-background-color)] text-sm text-[var(--heading-text)] ${preferences.startWeekOn === day ? "bg-[var(--sub-background-color)] font-semibold" : ""}`}
                                    onClick={() => {
                                      updatePreference("startWeekOn", day);
                                      setStartWeekDropdownOpen(false);
                                    }}
                                  >
                                    {day}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="auto-categorize"
                          >
                            Auto-Categorize Transactions
                          </label>
                          <button
                            type="button"
                            onClick={toggleAutoCategorize}
                            className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${preferences.autoCategorize ? "bg-[var(--btn-primary-bg)]" : "bg-[var(--sub-background-color)]"}`}
                            id="auto-categorize"
                          >
                            <span
                              className={`pointer-events-none block h-5 w-5 rounded-full bg-[var(--background-color)] shadow-lg ring-0 transition-transform ${preferences.autoCategorize ? "translate-x-5" : "translate-x-0"}`}
                            ></span>
                          </button>
                        </div>
                        <p className="text-sm text-[var(--sub-heading-text)]">
                          Automatically categorize new transactions based on
                          previous patterns.
                        </p>
                      </div>
                      {preferenceMessage && (
                        <div className="p-4 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-sm">
                          {preferenceMessage}
                        </div>
                      )}
                      <button
                        onClick={handleSavePreferences}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover-bg)] h-10 px-4 py-2 gap-2 cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="lucide lucide-save-icon lucide-save h-4 w-4"
                        >
                          <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                          <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                          <path d="M7 3v4a1 1 0 0 0 1 1h7" />
                        </svg>
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
