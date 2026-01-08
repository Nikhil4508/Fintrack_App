import React, { useState, useEffect } from "react";
import { getAvatarData, getAvatarStyle } from "../lib/helper/avatarHelper";

/**
 * Avatar Component
 * Displays user avatar with photo or default initials with colored background
 *
 * @param {object} user - User object with displayName, email, photoURL
 * @param {string} size - Size of avatar: 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
 * @param {string} className - Additional CSS classes
 */
const Avatar = ({ user, size = "md", className = "" }) => {
  const avatarData = getAvatarData(user);
  const style = getAvatarStyle(avatarData.color, size);
  const [localImage, setLocalImage] = useState(null);

  // Check localStorage for custom profile image (user-specific)
  useEffect(() => {
    if (!user?.email) {
      setLocalImage(null);
      return;
    }

    // Use email as key to make it user-specific
    const storageKey = `profileImage_${user.email}`;
    const storedImage = localStorage.getItem(storageKey);
    setLocalImage(storedImage || null);

    // Listen for avatar updates
    const handleAvatarUpdate = () => {
      const updatedImage = localStorage.getItem(storageKey);
      setLocalImage(updatedImage || null);
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, [user?.email]);

  // Priority: localStorage image > Firebase photoURL > initials
  if (localImage) {
    return (
      <img
        src={localImage}
        alt={user?.displayName || user?.email || "User"}
        style={{
          ...style,
          objectFit: "cover",
        }}
        className={className}
      />
    );
  }

  if (
    avatarData.hasPhoto &&
    avatarData.photoURL &&
    avatarData.photoURL !== "localStorage"
  ) {
    // Display user's photo from Firebase
    return (
      <img
        src={avatarData.photoURL}
        alt={user?.displayName || user?.email || "User"}
        style={{
          ...style,
          objectFit: "cover",
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
      title={user?.displayName || user?.email || "User"}
    >
      {avatarData.initials}
    </div>
  );
};

export default Avatar;
