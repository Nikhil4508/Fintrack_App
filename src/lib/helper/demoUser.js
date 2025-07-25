import { auth } from './firebaseClient';

/**
 * Check if the current user is the demo user
 * @returns {boolean} True if current user is demo@demo.com
 */
export const isDemoUser = () => {
  const user = auth.currentUser;
  return user?.email === 'demo@demo.com';
};

/**
 * Get storage key with user-specific prefix
 * For demo user, use 'demo_' prefix
 * For regular users, use their user ID
 * @param {string} key - The base storage key
 * @returns {string} User-specific storage key
 */
export const getUserStorageKey = (key) => {
  const user = auth.currentUser;
  if (!user) return key;

  if (user.email === 'demo@demo.com') {
    return `demo_${key}`;
  }

  return `user_${user.uid}_${key}`;
};

/**
 * Check if user should see initial demo data
 * Returns true only for demo user on first load
 * @returns {boolean}
 */
export const shouldLoadDemoData = () => {
  return isDemoUser();
};
