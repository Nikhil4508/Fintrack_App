import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/helper/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  getSavingsGoals,
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  getUserProfile,
  createUserProfile,
} from '../lib/helper/firestoreHelper';

const UserDataContext = createContext();

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within UserDataProvider');
  }
  return context;
};

export const UserDataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Load user data when user logs in
        await loadUserData(currentUser.uid);
      } else {
        // Clear data when user logs out
        clearUserData();
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (userId) => {
    try {
      setLoading(true);

      // Load user profile (create if doesn't exist)
      let profile = await getUserProfile(userId);
      if (!profile) {
        profile = await createUserProfile(userId, {
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName || 'User',
        });
      }
      setUserProfile(profile);

      // Load transactions
      const transactionsData = await getTransactions(userId);
      setTransactions(transactionsData);

      // Load budgets
      const budgetsData = await getBudgets(userId);
      setBudgets(budgetsData);

      // Load savings goals
      const goalsData = await getSavingsGoals(userId);
      setSavingsGoals(goalsData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearUserData = () => {
    setTransactions([]);
    setBudgets([]);
    setSavingsGoals([]);
    setUserProfile(null);
  };

  // ==================== TRANSACTION METHODS ====================

  const addNewTransaction = async (transactionData) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const newTransaction = await addTransaction(user.uid, transactionData);
      setTransactions((prev) => [newTransaction, ...prev]);
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateExistingTransaction = async (transactionId, transactionData) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const updatedTransaction = await updateTransaction(user.uid, transactionId, transactionData);
      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionId ? { ...t, ...transactionData } : t))
      );
      return updatedTransaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const removeTransaction = async (transactionId) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await deleteTransaction(user.uid, transactionId);
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  // ==================== BUDGET METHODS ====================

  const addNewBudget = async (budgetData) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const newBudget = await addBudget(user.uid, budgetData);
      setBudgets((prev) => [...prev, newBudget]);
      return newBudget;
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  };

  const updateExistingBudget = async (budgetId, budgetData) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const updatedBudget = await updateBudget(user.uid, budgetId, budgetData);
      setBudgets((prev) =>
        prev.map((b) => (b.id === budgetId ? { ...b, ...budgetData } : b))
      );
      return updatedBudget;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  };

  const removeBudget = async (budgetId) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await deleteBudget(user.uid, budgetId);
      setBudgets((prev) => prev.filter((b) => b.id !== budgetId));
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  };

  // ==================== SAVINGS GOAL METHODS ====================

  const addNewSavingsGoal = async (goalData) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const newGoal = await addSavingsGoal(user.uid, goalData);
      setSavingsGoals((prev) => [...prev, newGoal]);
      return newGoal;
    } catch (error) {
      console.error('Error adding savings goal:', error);
      throw error;
    }
  };

  const updateExistingSavingsGoal = async (goalId, goalData) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const updatedGoal = await updateSavingsGoal(user.uid, goalId, goalData);
      setSavingsGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, ...goalData } : g))
      );
      return updatedGoal;
    } catch (error) {
      console.error('Error updating savings goal:', error);
      throw error;
    }
  };

  const removeSavingsGoal = async (goalId) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await deleteSavingsGoal(user.uid, goalId);
      setSavingsGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (error) {
      console.error('Error deleting savings goal:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    userProfile,
    transactions,
    budgets,
    savingsGoals,
    addNewTransaction,
    updateExistingTransaction,
    removeTransaction,
    addNewBudget,
    updateExistingBudget,
    removeBudget,
    addNewSavingsGoal,
    updateExistingSavingsGoal,
    removeSavingsGoal,
    refreshUserData: () => user && loadUserData(user.uid),
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
