import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Applayout from "./components/layout/Applayout";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Budgets from "./components/Budgets";
import SavingsGoals from "./components/SavingsGoals";
import Settings from "./components/Settings";
import Hero from "./components/Hero";
import Register from "./components/Register";
import Login from "./components/Login";
import ForgetPassword from "./components/ForgetPassword";
import "./App.css";
import { ImageProvider } from "./context/ImageContext";
import { auth } from "./lib/helper/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Listen for auth state changes with Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ImageProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* Authenticated routes */}
        {isAuthenticated && (
          <Route path="/" element={<Applayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="savingsgoals" element={<SavingsGoals />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        )}
      </Routes>
    </ImageProvider>
  );
}

export default App;
