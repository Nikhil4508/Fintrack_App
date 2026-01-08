// import React, { useContext } from 'react'
// import { ImageContext } from '../context/ImageContext';

// const Header = () => {
//   const {image,theme,setTheme} = useContext(ImageContext);

//   const toggleTheme = () => {
//       setTheme(theme === "dark-theme"? "light-theme":"dark-theme");
//   };

//   return (
//     <header
//       className='sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--background-color)] backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 px-6'
//     >
//       {/* container in classname */}
//       <div className=" flex h-14 items-center">
//         <div
//           className="mr-4 hidden md:flex text-[var(--heading-text)]"
//         >
//           <a href="/dashboard" className="mr-6 flex items-center space-x-2">
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign-icon lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
//             <span className="hidden font-semibold sm:inline-block">FinTrack</span>
//           </a>
//         </div>
//         <div
//           className="flex flex-1 items-center justify-between space-x-2 md:justify-end"
//         >
//           <div className="w-full flex-1 md:w-auto md:flex-none">
//             <div className="hidden md:block "></div>
//           </div>
//           <div className="flex items-center gap-2 ">
//             <button
//               className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-[var(--sub-background-color)] text-[var(--heading-text)] h-10 w-10 cursor-pointer "
//               type='button'
//               onClick={toggleTheme}
//             >
//               {theme === "light-theme" ? (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon-icon lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg> ) :(<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun-icon lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>)}

//               <span className="sr-only">Toggle theme</span>
//             </button>

//             {/* profile pic */}
//             <button
//               className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-gray-400 relative h-8 w-8 rounded-full p-0 bg-[var(--nav-pic-bg)]"
//               type='button'

//             >
//               <span className="sr-relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
//                 <img src={image} alt="Demo User" className="aspect-square h-full w-full " />
//               </span>
//             </button>

//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

// export default Header

import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { auth } from "../lib/helper/firebaseClient";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Avatar from "./Avatar";

const Header = () => {
  const { image, theme, setTheme } = useContext(ImageContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const profileBtnRef = useRef(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Get current user from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark-theme" ? "light-theme" : "dark-theme");
  };

  // Navigate to Settings page with Profile tab active
  const handleUserProfile = () => {
    setShowProfileMenu(false);
    navigate("/settings", { state: { tab: "Profile" } });
  };

  // Logout handler: sign out from Firebase and redirect to Hero ("/")
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowProfileMenu(false);
      navigate("/"); // Redirect to Hero component ("/")
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--background-color)] backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 px-6">
      <div className=" flex h-14 items-center">
        <div className="mr-4 flex text-[var(--heading-text)]">
          <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-dollar-sign-icon lucide-dollar-sign"
            >
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className="hidden font-semibold sm:inline-block">
              FinTrack
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:block "></div>
          </div>
          <div className="flex items-center gap-2 ">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-[var(--sub-background-color)] text-[var(--heading-text)] h-10 w-10 cursor-pointer "
              type="button"
              onClick={toggleTheme}
            >
              {theme === "light-theme" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-moon-icon lucide-moon"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-sun-icon lucide-sun"
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
              )}
              <span className="sr-only">Toggle theme</span>
            </button>

            {/* profile pic with dropdown */}
            <div className="relative">
              <button
                ref={profileBtnRef}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 hover:opacity-80 relative h-8 w-8 rounded-full p-0 cursor-pointer"
                type="button"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={showProfileMenu}
              >
                <Avatar user={currentUser} size="sm" />
              </button>
              {showProfileMenu && (
                <div
                  ref={menuRef}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[var(--background-color)] border border-[var(--border-color)] z-50"
                >
                  <div className="px-4 py-3 border-b border-[var(--border-color)]">
                    <p className="text-sm font-medium text-[var(--heading-text)]">
                      {currentUser?.displayName || "User"}
                    </p>
                    <p className="text-xs text-[var(--sub-heading-text)] truncate">
                      {currentUser?.email}
                    </p>
                  </div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-[var(--heading-text)] hover:bg-[var(--sub-background-color)] transition-colors border-b border-[var(--border-color)]"
                    onClick={handleUserProfile}
                  >
                    My Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-[var(--heading-text)] hover:bg-[var(--sub-background-color)] transition-colors"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
