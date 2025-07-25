import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../lib/helper/firebaseClient";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    console.log("Attempting to send password reset email to:", email);

    try {
      // Configure action code settings to redirect back to the app
      const actionCodeSettings = {
        // URL you want to redirect back to after password reset
        url: window.location.origin + "/login",
        handleCodeInApp: false,
      };

      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      console.log("Password reset email sent successfully!");
      setMessage(
        "Password reset email sent! Please check your inbox and spam folder.",
      );
      setEmail("");
    } catch (error) {
      console.error("Password reset error:", error.code, error.message);
      // Handle different Firebase error codes with user-friendly messages
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address. Please check and try again.");
      } else if (error.code === "auth/missing-email") {
        setError("Please enter an email address.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many requests. Please try again later.");
      } else {
        setError(`Failed to send reset email: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background-color)]">
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

      <div className="rounded-lg border border-[var(--sub-background-color)] bg-[var(--background-color)] shadow-sm w-full max-w-md">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold tracking-tight text-2xl text-[var(--heading-text)]">
            Reset Password
          </h3>
          <p className="text-sm text-[var(--sub-heading-text)]">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <form onSubmit={handleResetPassword}>
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
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm text-center">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm text-center">
                {message}
              </div>
            )}
          </div>

          <div className="items-center p-6 pt-0 flex flex-col space-y-4">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover-bg)] h-10 px-4 py-2 w-full cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center text-sm text-[var(--heading-text)]">
              Remember your password?
              <Link to="/login" className="hover:underline">
                {" "}
                Back to Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
