import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './firebaseClient';

// Get user's collection reference
const getUserCollection = (userId, collectionName) => {
  return collection(db, 'users', userId, collectionName);
};

// ==================== TRANSACTIONS ====================

export const addTransaction = async (userId, transactionData) => {
  try {
    const transactionsRef = getUserCollection(userId, 'transactions');
    const docRef = await addDoc(transactionsRef, {
      ...transactionData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...transactionData };
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const getTransactions = async (userId) => {
  try {
    const transactionsRef = getUserCollection(userId, 'transactions');
    const q = query(transactionsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    const transactions = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });

    return transactions;
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

export const updateTransaction = async (userId, transactionId, transactionData) => {
  try {
    const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
    await updateDoc(transactionRef, {
      ...transactionData,
      updatedAt: serverTimestamp()
    });
    return { id: transactionId, ...transactionData };
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (userId, transactionId) => {
  try {
    const transactionRef = doc(db, 'users', userId, 'transactions', transactionId);
    await deleteDoc(transactionRef);
    return transactionId;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// ==================== BUDGETS ====================

export const addBudget = async (userId, budgetData) => {
  try {
    const budgetsRef = getUserCollection(userId, 'budgets');
    const docRef = await addDoc(budgetsRef, {
      ...budgetData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...budgetData };
  } catch (error) {
    console.error('Error adding budget:', error);
    throw error;
  }
};

export const getBudgets = async (userId) => {
  try {
    const budgetsRef = getUserCollection(userId, 'budgets');
    const querySnapshot = await getDocs(budgetsRef);

    const budgets = [];
    querySnapshot.forEach((doc) => {
      budgets.push({ id: doc.id, ...doc.data() });
    });

    return budgets;
  } catch (error) {
    console.error('Error getting budgets:', error);
    throw error;
  }
};

export const updateBudget = async (userId, budgetId, budgetData) => {
  try {
    const budgetRef = doc(db, 'users', userId, 'budgets', budgetId);
    await updateDoc(budgetRef, {
      ...budgetData,
      updatedAt: serverTimestamp()
    });
    return { id: budgetId, ...budgetData };
  } catch (error) {
    console.error('Error updating budget:', error);
    throw error;
  }
};

export const deleteBudget = async (userId, budgetId) => {
  try {
    const budgetRef = doc(db, 'users', userId, 'budgets', budgetId);
    await deleteDoc(budgetRef);
    return budgetId;
  } catch (error) {
    console.error('Error deleting budget:', error);
    throw error;
  }
};

// ==================== SAVINGS GOALS ====================

export const addSavingsGoal = async (userId, goalData) => {
  try {
    const goalsRef = getUserCollection(userId, 'savingsGoals');
    const docRef = await addDoc(goalsRef, {
      ...goalData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...goalData };
  } catch (error) {
    console.error('Error adding savings goal:', error);
    throw error;
  }
};

export const getSavingsGoals = async (userId) => {
  try {
    const goalsRef = getUserCollection(userId, 'savingsGoals');
    const querySnapshot = await getDocs(goalsRef);

    const goals = [];
    querySnapshot.forEach((doc) => {
      goals.push({ id: doc.id, ...doc.data() });
    });

    return goals;
  } catch (error) {
    console.error('Error getting savings goals:', error);
    throw error;
  }
};

export const updateSavingsGoal = async (userId, goalId, goalData) => {
  try {
    const goalRef = doc(db, 'users', userId, 'savingsGoals', goalId);
    await updateDoc(goalRef, {
      ...goalData,
      updatedAt: serverTimestamp()
    });
    return { id: goalId, ...goalData };
  } catch (error) {
    console.error('Error updating savings goal:', error);
    throw error;
  }
};

export const deleteSavingsGoal = async (userId, goalId) => {
  try {
    const goalRef = doc(db, 'users', userId, 'savingsGoals', goalId);
    await deleteDoc(goalRef);
    return goalId;
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    throw error;
  }
};

// ==================== USER PROFILE ====================

export const createUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return profileData;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    });
    return profileData;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
