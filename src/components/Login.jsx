import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../lib/helper/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function from react-router-dom

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } catch (error) {
      // Handle different Firebase error codes with user-friendly messages
      if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later.");
      } else if (error.code === "auth/user-disabled") {
        setError("This account has been disabled.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  const handleDemoLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, "demo@demo.com", "demopassword");
      navigate("/dashboard");
    } catch (error) {
      setError("Demo login failed. Please contact support.");
    }
  };

  // This component renders a login page with a form for users to enter their email and password
  // It includes a header with the application name, a configuration error alert, and buttons for login and demo login
  // The form fields are styled with Tailwind CSS classes for a clean and modern look
  return (
    <div className=" flex min-h-screen flex-col items-center justify-center bg-[var(--background-color)] ">
      <Link
        to="/"
        className="absolute text-[var(--heading-text)] left-8 top-8 flex items-center gap-2"
      >
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
        <span className="font-bold">Fintrack</span>
      </Link>

      <div className=" rounded-lg border border-[var(--sub-background-color)] bg-[var(--background-color)] shadow-sm w-full max-w-md">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold tracking-tight text-2xl text-[var(--heading-text)] ">
            Login
          </h3>
          <p className="text-sm text-[var(--sub-heading-text)]">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <label
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="mt-2 flex h-10 w-full rounded-md border border-[var(--sub-background-color)] bg-background px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-[var(--sub-background-color)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sub-background-main)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="email"
                placeholder="name@email.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ">
                <label
                  className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  to="/forget-password"
                  className="text-xs text-[var(--heading-text)] hover:underline"
                >
                  Forget password?
                </Link>
              </div>
              <input
                className=" mt-2 flex h-10 w-full rounded-md border border-[var(--sub-background-color)] bg-[var(--background-color)] px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-[var(--sub-background-color)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sub-background-main)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
          </div>

          <div className="items-center p-6 pt-0 flex flex-col space-y-4">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover-bg)] h-10 px-4 py-2 w-full cursor-pointer"
              type="submit"
            >
              Login
            </button>

            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--background-color)] text-[var(--heading-text)] hover:bg-[var(--sub-background-color)] h-10 px-4 py-2 w-full border border-[var(--sub-background-color)] cursor-pointer"
              type="button"
              onClick={handleDemoLogin}
            >
              Demo Login (No Account Required)
            </button>

            <div className="text-center text-sm text-[var(--heading-text)]">
              Don't have an account?
              <Link to="/register" className="hover:underline">
                {" "}
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
