import React from 'react';
import { getAvatarData, getAvatarStyle } from '../lib/helper/avatarHelper';

/**
 * Avatar Component
 * Displays user avatar with photo or default initials with colored background
 *
 * @param {object} user - User object with displayName, email, photoURL
 * @param {string} size - Size of avatar: 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
 * @param {string} className - Additional CSS classes
 */
const Avatar = ({ user, size = 'md', className = '' }) => {
  const avatarData = getAvatarData(user);
  const style = getAvatarStyle(avatarData.color, size);

  if (avatarData.hasPhoto && avatarData.photoURL) {
    // Display user's photo
    return (
      <img
        src={avatarData.photoURL}
        alt={user?.displayName || user?.email || 'User'}
        style={{
          ...style,
          objectFit: 'cover',
        }}
        className={className}
      />
    );
  }

  // Display initials with colored background
  return (
    <div
      style={style}
      className={className}
      title={user?.displayName || user?.email || 'User'}
    >
      {avatarData.initials}
    </div>
  );
};

export default Avatar;
