import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Fuel,
  Zap,
  BriefcaseBusiness,
  UtensilsCrossed,
  GraduationCap,
  Ambulance,
  ShoppingBag,
  Clapperboard,
  Car,
  Landmark,
  Plane,
  Laptop,
  House,
  CirclePlus,
  Coffee,
  Plus,
  Hotel,
  Box,
  CookingPot,
  Tag,
  Trash2,
  Smartphone,
  Projector,
  NotebookPen,
} from "lucide-react";
import Savingmodal from "./Savingmodal";
import SavingsGoalUpdateModal from "./SavingsGoalUpdateModal";
import "./savinggoal.css";
import initialSavingsGoals from "../data/initialSavingsGoals";
import { getUserStorageKey, isDemoUser } from "../lib/helper/demoUser";
import { showSavingsGoalUpdate } from "../lib/notificationPreferences";
import { formatCurrency, getCurrencySymbol } from "../lib/userPreferences";

const ICON_MAP = {
  "Emergency Fund": "Landmark",
  Vacation: "Hotel",
  "New Laptop": "Laptop",
  Car: "Car",
  Mobile: "Smartphone",
  "Home Down Payment": "House",
  Other: "Tag",
  Education: "GraduationCap",
  Dinning: " CookingPot",
  "Entertainment ": "Clapperboard",
  Fuel: "Fuel",
  Hospital: "Ambulance",
  Transpotation: "Plane",
  Utilities: "Zap",
  Shopping: "ShoppingBag",
  Groceries: "ShoppingCart",
  Insurance: "BriefcaseBusiness",
  "Coffee Shop": "Coffee",
  Movie: "Projector",
  Project: "NotebookPen",
  // Add more mappings as needed
};

const ICON_COMPONENTS = {
  ShoppingCart,
  Fuel,
  Zap,
  BriefcaseBusiness,
  UtensilsCrossed,
  GraduationCap,
  Ambulance,
  ShoppingBag,
  Clapperboard,
  Car,
  Landmark,
  Plane,
  Laptop,
  House,
  CirclePlus,
  Coffee,
  Plus,
  Box,
  Hotel,
  CookingPot,
  Tag,
  Smartphone,
  Projector,
  NotebookPen,
};

function parseAmount(amtStr) {
  if (!amtStr) return [0, 0];
  // Currency-agnostic: extract numbers from any currency format
  const parts = amtStr.split("/").map((s) => s.trim().replace(/[^\d.-]/g, ""));
  if (parts.length === 2) {
    const saved = parseFloat(parts[0]) || 0;
    const target = parseFloat(parts[1]) || 0;
    return [saved, target];
  }
  return [0, 0];
}

const SavingsGoals = () => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [goalToUpdate, setGoalToUpdate] = useState(null);

  // Get currency symbol from user preferences
  const [currencySymbol, setCurrencySymbol] = useState(() => {
    const prefs = localStorage.getItem("fintrack_preferences");
    const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
    return getCurrencySymbol(currency);
  });

  // Listen for preference changes
  useEffect(() => {
    const handlePreferenceChange = () => {
      const prefs = localStorage.getItem("fintrack_preferences");
      const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
      setCurrencySymbol(getCurrencySymbol(currency));
    };

    window.addEventListener("preferencesChanged", handlePreferenceChange);
    return () => {
      window.removeEventListener("preferencesChanged", handlePreferenceChange);
    };
  }, []);

  const handleOpenUpdateModal = (goal, idx) => {
    setGoalToUpdate({ ...goal, idx });
    setUpdateModalOpen(true);
  };

  const handleUpdateGoal = (updatedGoal) => {
    setSavingBudgetCards((prev) =>
      prev.map((g, i) => {
        if (i === updatedGoal.idx) {
          // Calculate progress and show notification if significant
          const [saved, target] = parseAmount(updatedGoal.amt);
          const percentage =
            target > 0 ? Math.round((saved / target) * 100) : 0;

          // Show notification for milestone achievements
          if (percentage >= 25) {
            showSavingsGoalUpdate(updatedGoal.title, saved, target, percentage);
          }

          return { ...updatedGoal, icon: g.icon };
        }
        return g;
      }),
    );
  };

  // Load from localStorage or use shared initialSavingsGoals (demo data for demo user only)
  const [savingBudgetCards, setSavingBudgetCards] = useState(() => {
    const storageKey = getUserStorageKey("savingBudgetCards");
    const stored = localStorage.getItem(storageKey);

    // Helper to update currency symbols in stored data
    const updateCurrencyInData = (data) => {
      return data.map((goal) => {
        // Parse amounts and reformat with current currency
        const [savedStr, targetStr] = goal.amt
          .split("/")
          .map((s) => s.trim().replace(/[^\d.-]/g, ""));
        const saved = parseFloat(savedStr) || 0;
        const target = parseFloat(targetStr) || 0;
        const remaining = target - saved;

        return {
          ...goal,
          amt: `${formatCurrency(saved)} / ${formatCurrency(target)}`,
          remain: formatCurrency(remaining),
        };
      });
    };

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return updateCurrencyInData(parsed);
      } catch {
        const demoData = isDemoUser() ? initialSavingsGoals : [];
        return updateCurrencyInData(demoData);
      }
    }
    const demoData = isDemoUser() ? initialSavingsGoals : [];
    return updateCurrencyInData(demoData);
  });

  useEffect(() => {
    const storageKey = getUserStorageKey("savingBudgetCards");
    localStorage.setItem(storageKey, JSON.stringify(savingBudgetCards));
  }, [savingBudgetCards]);

  const [showModal, setShowModal] = useState(false);

  const handleAddGoal = (goalData) => {
    const { goalName, targetAmount, initialAmount, date } = goalData;
    const usedPercent =
      targetAmount > 0 ? Math.round((initialAmount / targetAmount) * 100) : 0;
    const remainAmount = targetAmount - initialAmount;
    const iconKey = ICON_MAP[goalName] || "Tag";
    const icon = ICON_COMPONENTS[iconKey] ? iconKey : "Tag";

    setSavingBudgetCards((prev) => [
      ...prev,
      {
        title: goalName,
        used: `${usedPercent}%`,
        remain: formatCurrency(remainAmount),
        amt: `${formatCurrency(initialAmount)} / ${formatCurrency(targetAmount)}`,
        icon,
        date: date
          ? typeof date === "string"
            ? date
            : date.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
          : "N/A",
      },
    ]);
  };

  // Update savings goal amounts when currency preference changes
  useEffect(() => {
    const handlePreferenceChange = () => {
      setSavingBudgetCards((prev) =>
        prev.map((goal) => {
          // Parse the amt string to extract numeric values
          const [savedStr, targetStr] = goal.amt
            .split("/")
            .map((s) => s.trim().replace(/[^\d.-]/g, ""));
          const saved = parseFloat(savedStr) || 0;
          const target = parseFloat(targetStr) || 0;
          const remaining = target - saved;

          return {
            ...goal,
            amt: `${formatCurrency(saved)} / ${formatCurrency(target)}`,
            remain: formatCurrency(remaining),
          };
        }),
      );
    };

    window.addEventListener("preferencesChanged", handlePreferenceChange);
    return () => {
      window.removeEventListener("preferencesChanged", handlePreferenceChange);
    };
  }, []);

  const handleDeleteGoal = (idx) => {
    setSavingBudgetCards((prev) => prev.filter((_, i) => i !== idx));
  };

  const [totalSaved, totalTarget] = savingBudgetCards.reduce(
    ([savedSum, targetSum], goal) => {
      const [saved, target] = parseAmount(goal.amt);
      return [savedSum + saved, targetSum + target];
    },
    [0, 0],
  );

  const monthlyIncome = 12000;
  const savingsRate =
    monthlyIncome > 0 ? (totalSaved / monthlyIncome) * 100 : 0;
  const goalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const formatCurrencyLocal = (amt) => formatCurrency(amt);

  const savingCards = [
    {
      title: "Total Savings",
      desc: "Your total saved amount",
      amt: formatCurrencyLocal(totalSaved),
      progressinfo:
        totalSaved > 0
          ? `+${formatCurrencyLocal(totalSaved)} saved`
          : "No savings yet",
    },
    {
      title: "Savings Rate",
      desc: "Percentage of income saved",
      amt: `${savingsRate.toFixed(1)}%`,
      progressinfo:
        monthlyIncome > 0
          ? `${formatCurrencyLocal(totalSaved)} of ${formatCurrencyLocal(monthlyIncome)} income`
          : "No income set",
    },
    {
      title: "Goal Progress",
      desc: "Overall progress towards goals",
      amt: `${goalProgress.toFixed(0)}%`,
      progressinfo: `${formatCurrencyLocal(totalSaved)} of ${formatCurrencyLocal(totalTarget)} total goals`,
    },
  ];

  return (
    <>
      {showModal && (
        <Savingmodal
          onClose={() => setShowModal(false)}
          onAddGoal={handleAddGoal}
        />
      )}
      <SavingsGoalUpdateModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        goal={goalToUpdate}
        onUpdate={handleUpdateGoal}
      />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between ">
          <h2 className="text-3xl text-[var(--heading-text)] font-semibold tracking-tight">
            Savings Goals
          </h2>
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)]  hover:bg-[var(--btn-hover-bg)] h-10 md:px-4 px-2 py-2 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Plus />
            <span className="hidden md:inline">Add Savings Goal</span>
          </button>
        </div>
        {/* cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savingCards.map((items) => (
            <div
              key={items.title}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm"
            >
              <div className="flex flex-col space-y-1.5 p-6 pb-2">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  {items.title}
                </h3>
                <p className="text-sm text-[var(--sub-heading-text)]">
                  {items.desc}
                </p>
              </div>
              <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{items.amt}</div>
                <p className="text-xs text-[var(--sub-heading-text)]">
                  {items.progressinfo}
                </p>
                {/* Only show progress bar for Goal Progress */}
                {items.title === "Goal Progress" && (
                  <div className="mt-4 h-2 w-full rounded-full bg-[var(--sub-background-color)]">
                    <div
                      className="h-2 rounded-full bg-[var(--progress-head)]"
                      style={{ width: `${goalProgress.toFixed(0)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* main section */}
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Your Savings Goals
            </h3>
            <p className="text-sm text-[var(--sub-heading-text)]">
              Track progress towards your financial goals
            </p>
          </div>
          {/* data lists */}
          <div className="p-6 pt-0">
            <div
              dir="ltr"
              className="relative overflow-y-scroll h-[400px] custom-scrollbar"
            >
              <div className="h-full w-full rounded-[inherit]">
                <div className="">
                  <div className="space-y-6 ">
                    {savingBudgetCards.length === 0 ? (
                      <div className="text-center text-[var(--sub-heading-text)] py-10 flex flex-col items-center justify-center">
                        <p>No savings goals yet.</p>
                        <p>
                          Click{" "}
                          <span
                            className="font-semibold text-blue-500 hover:opacity-90 transition-opacity cursor-pointer"
                            onClick={() => setShowModal(true)}
                          >
                            Add Savings Goal
                          </span>{" "}
                          to get started!
                        </p>
                      </div>
                    ) : (
                      savingBudgetCards.map((savingItems, idx) => {
                        const Icon = ICON_COMPONENTS[savingItems.icon] || Tag;
                        return (
                          <div
                            key={savingItems.title + idx}
                            className="space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1">
                                <span className="text-lg mt-0.5">
                                  {React.createElement(Icon)}
                                </span>
                                <div className="flex flex-col">
                                  <div className="font-medium">
                                    {savingItems.title}
                                  </div>
                                  <div className="text-xs text-[var(--sub-heading-text)]">
                                    Target date: {savingItems.date}
                                  </div>
                                  <div className="text-sm text-[var(--heading-text)] md:hidden mt-1">
                                    {savingItems.amt}
                                  </div>
                                </div>
                              </div>
                              <div className="hidden md:block text-sm text-[var(--heading-text)]">
                                {savingItems.amt}
                              </div>
                            </div>
                            {/* progressbar */}
                            <div className="space-y-1">
                              <div className="relative w-full overflow-hidden rounded-full bg-[var(--sub-background-color)] h-2">
                                <div
                                  className="h-full rounded-full flex-1 bg-[var(--progress-head)] transition-all"
                                  style={{ width: savingItems.used }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs text-[var(--sub-heading-text)]">
                                <span>{savingItems.used} complete</span>
                                <span>{savingItems.remain} to go</span>
                              </div>
                            </div>
                            {/* button */}
                            <div className="flex justify-end gap-2">
                              <button
                                type="delete"
                                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 duration-300 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--sub-background-color)] bg-background hover:bg-[var(--sub-background-color)] hover:text-red-400 rounded-md px-2 h-7 gap-1 cursor-pointer"
                                onClick={() => handleDeleteGoal(idx)}
                              >
                                <Trash2 />
                              </button>
                              <button
                                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--sub-background-color)] bg-background hover:bg-[var(--sub-background-color)] hover:text-[var(-sub-heading-text)] rounded-md px-3 h-7 gap-1 cursor-pointer"
                                onClick={() =>
                                  handleOpenUpdateModal(savingItems, idx)
                                }
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
                                  className="lucide lucide-circle-plus-icon lucide-circle-plus"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M8 12h8" />
                                  <path d="M12 8v8" />
                                </svg>
                                <span>Add Funds</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SavingsGoals;
