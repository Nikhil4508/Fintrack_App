import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Zap,
  BriefcaseBusiness,
  UtensilsCrossed,
  GraduationCap,
  Ambulance,
  ShoppingBag,
  Clapperboard,
  Car,
  Plus,
  CirclePlus,
  Trash2,
  Plane,
  PiggyBank,
} from "lucide-react";
import Budgetmodal from "./Budgetmodal";
import BudgetUpdateModal from "./BudgetUpdateModal";
import "./budget.css";
import initialBudgets from "../data/initialBudgets";
import { getUserStorageKey, isDemoUser } from "../lib/helper/demoUser";
import { showBudgetAlert } from "../lib/notificationPreferences";
import { formatCurrency, getCurrencySymbol } from "../lib/userPreferences";

// Define color mapping for progress bars
const PROGRESS_COLORS = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  // fallback
  default: "bg-[var(--progress-head)]",
};

// Map category names to icons
const CATEGORY_ICONS = {
  Groceries: ShoppingCart,
  Dining: UtensilsCrossed,
  Entertainment: Clapperboard,
  Transportation: Car,
  Utilities: Zap,
  Shopping: ShoppingBag,
  Health: Ambulance,
  Education: GraduationCap,
  Salary: BriefcaseBusiness,
  Hospital: Ambulance,
  Travel: Plane,
  Investments: PiggyBank,
  Other: ShoppingCart, // Default icon for "Other"
  // Add more categories as needed
};

// Helper to parse "$350.00 / $500.00" or "€350.00 / €500.00" to [350, 500]
function parseAmt(amtStr) {
  if (!amtStr) return [0, 0];
  // Currency-agnostic: extract numbers from any currency format
  const parts = amtStr.split("/").map((s) => s.trim().replace(/[^\d.-]/g, ""));
  if (parts.length === 2) {
    const spent = parseFloat(parts[0]) || 0;
    const total = parseFloat(parts[1]) || 0;
    return [spent, total];
  }
  return [0, 0];
}

const Budgets = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

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

  const [categoryBudgetCards, setCategoryBudgetCards] = useState(() => {
    const storageKey = getUserStorageKey("fintrack_category_budgets");
    const stored = localStorage.getItem(storageKey);

    // Helper to update currency symbols in stored data
    const updateCurrencyInData = (data) => {
      return data.map((budget) => {
        // Parse amounts and reformat with current currency
        const [spentStr, totalStr] = budget.amt
          .split("/")
          .map((s) => s.trim().replace(/[^\d.-]/g, ""));
        const spent = parseFloat(spentStr) || 0;
        const total = parseFloat(totalStr) || 0;
        const remaining = total - spent;

        return {
          ...budget,
          amt: `${formatCurrency(spent)} / ${formatCurrency(total)}`,
          remain: formatCurrency(remaining),
          icon: CATEGORY_ICONS[budget.title] || ShoppingCart,
        };
      });
    };

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return updateCurrencyInData(parsed);
      } catch {
        const demoData = isDemoUser() ? initialBudgets : [];
        return updateCurrencyInData(demoData);
      }
    }
    const demoData = isDemoUser() ? initialBudgets : [];
    return updateCurrencyInData(demoData);
  });

  // Save to localStorage whenever categoryBudgetCards changes
  useEffect(() => {
    const storageKey = getUserStorageKey("fintrack_category_budgets");
    // Remove icon property before saving (functions can't be stringified)
    const toStore = categoryBudgetCards.map(({ icon, ...rest }) => rest);
    localStorage.setItem(storageKey, JSON.stringify(toStore));
    window.dispatchEvent(new Event("budgetsUpdated"));
  }, [categoryBudgetCards]);

  // Add new category budget
  const addCategoryBudget = (newBudget) => {
    const formattedAmount = formatCurrency(parseFloat(newBudget.amount));
    setCategoryBudgetCards((prev) => [
      ...prev,
      {
        ...newBudget,
        icon: CATEGORY_ICONS[newBudget.title] || ShoppingCart, // fallback icon
        used: "0%",
        remain: formattedAmount,
        amt: `${formatCurrency(0)} / ${formattedAmount}`,
        color: "red",
        period: newBudget.period || "Monthly",
      },
    ]);
    setShowModal(false);
  };

  // Update budget amounts when currency preference changes
  useEffect(() => {
    const handlePreferenceChange = () => {
      const prefs = localStorage.getItem("fintrack_preferences");
      const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
      const symbol = getCurrencySymbol(currency);
      setCurrencySymbol(symbol);

      // Update all budget amounts with new currency symbol
      setCategoryBudgetCards((prev) =>
        prev.map((budget) => {
          // Parse the amt string to extract numeric values
          const [spentStr, totalStr] = budget.amt
            .split("/")
            .map((s) => s.trim().replace(/[^\d.-]/g, ""));
          const spent = parseFloat(spentStr) || 0;
          const total = parseFloat(totalStr) || 0;
          const remaining = total - spent;

          return {
            ...budget,
            amt: `${formatCurrency(spent)} / ${formatCurrency(total)}`,
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

  const [showModal, setShowModal] = useState(false);

  // Helper to get Tailwind class for progress bar color
  const getProgressBarColor = (color) => {
    return PROGRESS_COLORS[color] || PROGRESS_COLORS.default;
  };

  // Handle opening the update modal
  const handleUpdateClick = (budget) => {
    setSelectedBudget(budget);
    setShowUpdateModal(true);
  };

  // Handle updating the budget
  const handleUpdateBudget = (updatedBudget) => {
    setCategoryBudgetCards((prev) =>
      prev.map((b) => {
        if (b.title === updatedBudget.title) {
          // Check if we should show a notification
          const [spent, total] = parseAmt(updatedBudget.amt);
          const percentage = total > 0 ? Math.round((spent / total) * 100) : 0;

          // Show notification if budget usage is significant
          if (percentage >= 75) {
            showBudgetAlert(updatedBudget.title, spent, total, percentage);
          }

          return { ...b, ...updatedBudget };
        }
        return b;
      }),
    );
  };

  const handleDeleteCategoryBudget = (title) => {
    setCategoryBudgetCards((prev) =>
      prev.filter((budget) => budget.title !== title),
    );
  };

  // --- Dynamic summary calculations ---
  // Monthly Overview: total spent / total budget
  // Remaining Budget: total remaining
  // Budget Period: for demo, assume current month
  let totalSpent = 0,
    totalBudget = 0,
    totalRemain = 0;
  categoryBudgetCards.forEach((card) => {
    const [spent, budget] = parseAmt(card.amt);
    totalSpent += spent;
    totalBudget += budget;
    totalRemain += Math.max(0, budget - spent);
  });
  const overviewPercent =
    totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const remainingPercent =
    totalBudget > 0 ? Math.round((totalRemain / totalBudget) * 100) : 0;

  // Budget period: current month
  const now = new Date();
  const monthName = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();
  const firstDay = `${monthName} 1`;
  const lastDay = `${monthName} ${new Date(year, now.getMonth() + 1, 0).getDate()}`;
  const today = now.getDate();
  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - today;

  const budgetCards = [
    {
      title: "Monthly Overview",
      desc: "Your budget usage for this month",
      amt: `${formatCurrency(totalSpent)} / ${formatCurrency(totalBudget)}`,
      progressinfo: "% of total budget used",
      color: "default",
      progress: overviewPercent,
    },
    {
      title: "Remaining Budget",
      desc: "Amount left to spend this month",
      amt: formatCurrency(totalRemain),
      progressinfo: "% of total budget remaining",
      color: "green",
      progress: remainingPercent,
    },
    {
      title: "Budget Period",
      desc: "Current budget cycle information",
      amt: `${firstDay} - ${lastDay}`,
      progressinfo: ` days remaining in this period`,
      color: "blue",
      progress: daysRemaining,
    },
  ];

  return (
    <>
      {showModal && (
        <Budgetmodal
          onClose={() => setShowModal(false)}
          addCategoryBudget={addCategoryBudget}
        />
      )}
      {showUpdateModal && selectedBudget && (
        <BudgetUpdateModal
          onClose={() => setShowUpdateModal(false)}
          budget={selectedBudget}
          onUpdate={handleUpdateBudget}
        />
      )}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between ">
          <h2 className="text-3xl font-semibold tracking-tight text-[var(--heading-text)]">
            Budgets
          </h2>
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)]  hover:bg-[var(--btn-hover-bg)] h-10 md:px-4 px-2 py-2 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Plus />
            <span className="hidden md:inline">Add Budgets</span>
          </button>
        </div>
        {/* cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgetCards.map((items) => (
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
                  {items.progress}
                  {items.progressinfo}
                </p>
                <div className="mt-4 h-2 w-full rounded-full bg-[var(--sub-background-color)]">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressBarColor(items.color)}`}
                    style={{ width: `${items.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* main section */}
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm   ">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Category Budgets
            </h3>
            <p className="text-sm text-[var(--sub-heading-text)]">
              Track your spending against category budgets
            </p>
          </div>
          {/* data lists */}
          <div className="p-6 pt-0">
            <div
              dir="ltr"
              className="relative overflow-y-auto h-[400px] custom-scrollbar"
            >
              <div
                data-radix-scroll-area-viewport
                className="w-full rounded-[inherit]"
              >
                <div className="">
                  <div className="space-y-6 ">
                    {categoryBudgetCards.length === 0 ? (
                      <div className="text-center text-[var(--sub-heading-text)] py-10">
                        <p>No category budgets yet.</p>
                        <p>
                          Click{" "}
                          <span
                            className="font-semibold text-blue-400 transition-opacity hover:opacity-90 cursor-pointer "
                            onClick={() => setShowModal(true)}
                          >
                            Add Budgets
                          </span>{" "}
                          to get started!
                        </p>
                      </div>
                    ) : (
                      categoryBudgetCards.map((categoryItems) => (
                        <div className="space-y-2" key={categoryItems.title}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1">
                              <span className="text-lg mt-0.5">
                                <categoryItems.icon />
                              </span>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {categoryItems.title}
                                  <span className="text-xs ml-2 text-[var(--sub-heading-text)]">
                                    ({categoryItems.period || "Monthly"})
                                  </span>
                                </span>
                                <span className="text-sm text-[var(--heading-text)] md:hidden mt-1">
                                  {categoryItems.amt}
                                </span>
                              </div>
                            </div>
                            <div className="hidden md:block text-sm text-[var(--heading-text)]">
                              {categoryItems.amt}
                            </div>
                          </div>
                          {/* progressbar */}
                          <div className="space-y-1">
                            <div className="relative w-full overflow-hidden rounded-full bg-[var(--sub-background-color)] h-2">
                              <div
                                className="h-full flex-1 bg-[var(--progress-head)] transition-all rounded-full"
                                style={{ width: categoryItems.used }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-[var(--sub-heading-text)]">
                              <span>{categoryItems.used} used</span>
                              <span>
                                {(() => {
                                  const [spent, total] = parseAmt(
                                    categoryItems.amt,
                                  );
                                  if (spent >= total && total > 0) {
                                    return (
                                      <span className="text-green-600 font-semibold flex gap-1 items-baseline ">
                                        Goal reached!
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
                                          className="lucide lucide-party-popper-icon lucide-party-popper w-4 h-4"
                                        >
                                          <path d="M5.8 11.3 2 22l10.7-3.79" />
                                          <path d="M4 3h.01" />
                                          <path d="M22 8h.01" />
                                          <path d="M15 2h.01" />
                                          <path d="M22 20h.01" />
                                          <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
                                          <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17" />
                                          <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7" />
                                          <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
                                        </svg>
                                      </span>
                                    );
                                  }
                                  return <>{categoryItems.remain} remain</>;
                                })()}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <button
                              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium  transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--sub-background-color)] bg-[var(--background-color)] hover:bg-[var(--sub-hover)] hover:text-red-400 rounded-md px-2 h-7 gap-1 cursor-pointer"
                              onClick={() =>
                                handleDeleteCategoryBudget(categoryItems.title)
                              }
                            >
                              <Trash2 />
                            </button>
                            <button
                              className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--sub-background-color)] bg-background hover:bg-[var(--sub-hover)] hover:text-accent-foreground rounded-md px-3 h-7 gap-1 cursor-pointer"
                              onClick={() => handleUpdateClick(categoryItems)}
                            >
                              <CirclePlus />
                              Add Fund
                            </button>
                          </div>
                        </div>
                      ))
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

export default Budgets;
