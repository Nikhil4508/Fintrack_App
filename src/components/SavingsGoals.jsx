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
  const match = amtStr.match(/\$([\d,]+\.\d{2})\s*\/\s*\$([\d,]+\.\d{2})/);
  if (match) {
    const saved = parseFloat(match[1].replace(/,/g, ""));
    const target = parseFloat(match[2].replace(/,/g, ""));
    return [saved, target];
  }
  return [0, 0];
}

const SavingsGoals = () => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [goalToUpdate, setGoalToUpdate] = useState(null);

  const handleOpenUpdateModal = (goal, idx) => {
    setGoalToUpdate({ ...goal, idx });
    setUpdateModalOpen(true);
  };

  const handleUpdateGoal = (updatedGoal) => {
    setSavingBudgetCards((prev) =>
      prev.map((g, i) =>
        i === updatedGoal.idx ? { ...updatedGoal, icon: g.icon } : g,
      ),
    );
  };

  // Load from localStorage or use shared initialSavingsGoals (demo data for demo user only)
  const [savingBudgetCards, setSavingBudgetCards] = useState(() => {
    const storageKey = getUserStorageKey("savingBudgetCards");
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return isDemoUser() ? initialSavingsGoals : [];
      }
    }
    return isDemoUser() ? initialSavingsGoals : [];
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
    const formatCurrency = (amt) =>
      `$${amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  const formatCurrency = (amt) =>
    `$${amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const savingCards = [
    {
      title: "Total Savings",
      desc: "Your total saved amount",
      amt: formatCurrency(totalSaved),
      progressinfo:
        totalSaved > 0
          ? `+${formatCurrency(totalSaved)} saved`
          : "No savings yet",
    },
    {
      title: "Savings Rate",
      desc: "Percentage of income saved",
      amt: `${savingsRate.toFixed(1)}%`,
      progressinfo:
        monthlyIncome > 0
          ? `${formatCurrency(totalSaved)} of ${formatCurrency(monthlyIncome)} income`
          : "No income set",
    },
    {
      title: "Goal Progress",
      desc: "Overall progress towards goals",
      amt: `${goalProgress.toFixed(0)}%`,
      progressinfo: `${formatCurrency(totalSaved)} of ${formatCurrency(totalTarget)} total goals`,
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
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)]  hover:bg-[var(--btn-hover-bg)] h-10 px-4 py-2 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Plus />
            Add Savings Goal
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
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="mr-2 text-lg">
                                  {React.createElement(Icon)}
                                </span>
                                <div>
                                  <div className="font-medium">
                                    {savingItems.title}
                                  </div>
                                  <div className="text-xs text-[var(--sub-heading-text)]">
                                    Target date: {savingItems.date}
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-[var(--heading-text)]">
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
