/**
 * Avatar Helper Utility
 * Generates default avatars with user initials and colored backgrounds
 */

// Predefined color palette for avatars
const AVATAR_COLORS = [
  { bg: '#FF6B6B', text: '#FFFFFF' }, // Red
  { bg: '#4ECDC4', text: '#FFFFFF' }, // Teal
  { bg: '#45B7D1', text: '#FFFFFF' }, // Blue
  { bg: '#FFA07A', text: '#FFFFFF' }, // Light Salmon
  { bg: '#98D8C8', text: '#FFFFFF' }, // Mint
  { bg: '#F7DC6F', text: '#2C3E50' }, // Yellow
  { bg: '#BB8FCE', text: '#FFFFFF' }, // Purple
  { bg: '#85C1E2', text: '#FFFFFF' }, // Sky Blue
  { bg: '#F8B739', text: '#FFFFFF' }, // Orange
  { bg: '#52B788', text: '#FFFFFF' }, // Green
  { bg: '#E63946', text: '#FFFFFF' }, // Dark Red
  { bg: '#A8DADC', text: '#1D3557' }, // Light Blue
  { bg: '#F72585', text: '#FFFFFF' }, // Pink
  { bg: '#7209B7', text: '#FFFFFF' }, // Deep Purple
  { bg: '#3A86FF', text: '#FFFFFF' }, // Bright Blue
];

/**
 * Get user initials from name or email
 * @param {string} name - User's display name
 * @param {string} email - User's email (fallback)
 * @returns {string} User initials (1-2 characters)
 */
export const getInitials = (name, email) => {
  if (name && name.trim()) {
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      // First and Last name initials
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    // Single name - first two characters
    return name.trim().substring(0, 2).toUpperCase();
  }

  // Fallback to email
  if (email && email.trim()) {
    return email.trim()[0].toUpperCase();
  }

  return '?';
};

/**
 * Generate a consistent color based on string input
 * @param {string} input - String to generate color from (email or name)
 * @returns {object} Color object with bg and text properties
 */
export const getAvatarColor = (input) => {
  if (!input || !input.trim()) {
    return AVATAR_COLORS[0];
  }

  // Generate consistent hash from string
  let hash = 0;
  const str = input.toLowerCase().trim();

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use hash to select color from palette
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

/**
 * Get avatar data for a user
 * @param {object} user - User object with displayName and email
 * @returns {object} Avatar data with initials, colors, and photoURL
 */
export const getAvatarData = (user) => {
  if (!user) {
    return {
      initials: '?',
      color: AVATAR_COLORS[0],
      hasPhoto: false,
      photoURL: null,
    };
  }

  const initials = getInitials(user.displayName, user.email);
  const color = getAvatarColor(user.email || user.displayName);

  return {
    initials,
    color,
    hasPhoto: !!user.photoURL,
    photoURL: user.photoURL || null,
  };
};

/**
 * Generate inline styles for avatar
 * @param {object} color - Color object with bg and text properties
 * @param {string} size - Size of avatar ('sm', 'md', 'lg', 'xl')
 * @returns {object} Style object
 */
export const getAvatarStyle = (color, size = 'md') => {
  const sizes = {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '64px',
    '2xl': '96px',
  };

  const fontSizes = {
    xs: '10px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '36px',
  };

  return {
    backgroundColor: color.bg,
    color: color.text,
    width: sizes[size] || sizes.md,
    height: sizes[size] || sizes.md,
    fontSize: fontSizes[size] || fontSizes.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    fontWeight: '600',
    textTransform: 'uppercase',
    userSelect: 'none',
  };
};
