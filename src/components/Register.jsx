import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../lib/helper/firebaseClient";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Firebase registration
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      setSuccess("Registration successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDemoRegister = async () => {
    setError("");
    setSuccess("");
    // Demo registration logic - sign in with demo account
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, "demo@demo.com", "demopassword");
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-15 flex min-h-screen flex-col items-center justify-center bg-[var(--background-color)] ">
      <Link
        to="/"
        className="absolute left-8 top-8 flex items-center gap-2 text-[var(--heading-text)] "
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

      <div className="rounded-lg border border-[var(--sub-background-color)] bg-card shadow-sm w-full max-w-md">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="font-semibold tracking-tight text-2xl text-[var(--heading-text)]">
            Create an account
          </h3>
          <p className="text-sm text-[var(--sub-heading-text)]">
            Enter your information to create an account
          </p>
        </div>
        <form onSubmit={handleRegister}>
          <div className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <label
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                className="mt-1 flex h-10 w-full rounded-md border border-[var(--sub-background-color)] bg-background px-3 py-2 text-sm ring-offset-[var(--sub-background-color)] placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sub-background-main)] focus-visible:ring-offset-2 text-[var(--heading-text)]"
                id="name"
                placeholder="Nikhil rathod"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="mt-1 flex h-10 w-full rounded-md border border-[var(--sub-background-color)] bg-background px-3 py-2 text-sm ring-offset-[var(--sub-background-color)] placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sub-background-main)] focus-visible:ring-offset-2 text-[var(--heading-text)]"
                id="email"
                placeholder="name@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="mt-1 flex h-10 w-full rounded-md border border-[var(--sub-background-color)] bg-background px-3 py-2 text-sm ring-offset-[var(--sub-background-color)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sub-background-main)] focus-visible:ring-offset-2 text-[var(--heading-text)]"
                id="password"
                required
                minLength="6"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-[var(--sub-heading-text)]">
                Password must be at least 6 characters long
              </p>
            </div>
            <div className="space-y-2">
              <label
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <input
                className="mt-1 flex h-10 w-full rounded-md border border-[var(--sub-background-color)] bg-[var(--background-color)] px-3 py-2 text-sm ring-offset-[var(--sub-background-color)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sub-background-main)] focus-visible:ring-offset-2 text-[var(--heading-text)]"
                id="confirm-password"
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm text-center">
                {success}
              </div>
            )}
          </div>

          <div className="items-center p-6 pt-0 flex flex-col space-y-4">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover-bg)] h-10 px-4 py-2 w-full"
              type="submit"
            >
              Register
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 border border-[var(--sub-background-color)] bg-[var(--background-color)] hover:bg-[var(--sub-background-color)] h-10 px-4 py-2 w-full text-[var(--heading-text)]"
              type="button"
              onClick={handleDemoRegister}
            >
              Demo Login (No Account Required)
            </button>
            <div className="text-center text-sm text-[var(--heading-text)]">
              Already have an account?
              <Link to="/login" className="hover:underline">
                {" "}
                Login{" "}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
