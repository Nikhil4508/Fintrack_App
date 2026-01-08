import React, { useContext, useRef, useState } from "react";
import { ImageContext } from "../context/ImageContext";
import { auth } from "../lib/helper/firebaseClient";
import { updateProfile } from "firebase/auth";

const Settingmodal = ({ onClose }) => {
  const { image, setImage } = useContext(ImageContext);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      setError("");

      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const imageData = reader.result;

          // Update Firebase user profile with photoURL
          const currentUser = auth.currentUser;
          if (currentUser) {
            await updateProfile(currentUser, {
              photoURL: imageData,
            });
          }

          // Update context and localStorage for backward compatibility
          setImage(imageData);
          localStorage.setItem("profileImage", imageData);

          setIsUploading(false);
          onClose(); // Close the modal after uploading the image
        };
        reader.onerror = () => {
          setError("Failed to read image file");
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error("Error updating profile picture:", err);
        setError("Failed to update profile picture. Please try again.");
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 "></div>

      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-color)] bg-[var(--background-color)] p-6 shadow-lg  sm:rounded-lg sm:max-w-[425px]">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h1 className="text-lg text-[var(--heading-text)] font-semibold leading-none tracking-tight">
            Update Profile Picture
          </h1>
          <p className="text-sm text-[var(--sub-heading-text)]">
            Upload a new profile picture. JPG, PNG, and GIF formats are
            supported.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4 py-4">
          <span className="relative flex shrink-0 border border-[var(--sub-background-color)] overflow-hidden rounded-full h-24 w-24">
            <img
              src={image}
              alt="Profile Picture"
              className="aspect-square h-full w-full"
            />
          </span>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div className="grid w-full gap-2">
            <label
              htmlFor="avatar"
              className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only"
            >
              Choose a profile picture
            </label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm text-[var(--heading-text)]  font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--sub-background-color)] bg-background hover:bg-[var(--sub-background-color)] hover:text-accent-foreground h-10 px-4 py-2 w-full"
              type="button"
              onClick={handleFileInputClick}
              disabled={isUploading}
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
                className="lucide lucide-upload-icon lucide-upload h-4 w-4"
              >
                <path d="M12 3v12" />
                <path d="m17 8-5-5-5 5" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              </svg>
              {isUploading ? "Uploading..." : "Change Image"}
            </button>
          </div>
        </div>
        <button
          type="button"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-[var(--sub-heading-text)]"
          onClick={onClose}
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
            className="lucide lucide-x-icon lucide-x"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Settingmodal;
