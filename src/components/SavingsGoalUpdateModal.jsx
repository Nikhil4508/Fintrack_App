import React, { useEffect, useState } from "react";
import {
  getCurrencySymbol,
  formatCurrency as formatCurrencyUtil,
} from "../lib/userPreferences";

const SavingsGoalUpdateModal = ({ open, onClose, goal, onUpdate }) => {
  const [action, setAction] = useState("add");
  const [amount, setAmount] = useState("");

  // Get currency symbol from user preferences
  const [currencySymbol, setCurrencySymbol] = useState(() => {
    const prefs = localStorage.getItem("fintrack_preferences");
    const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
    return getCurrencySymbol(currency);
  });

  useEffect(() => {
    setAmount("");
    setAction("add");
  }, [goal, open]);

  if (!open || !goal) return null;

  // Parse "$800.00 / $1,000.00" or "€800.00 / €1,000.00" to [800, 1000]
  const parseAmounts = (amtStr) => {
    if (!amtStr) return [0, 0];
    const parts = amtStr
      .split("/")
      .map((s) => s.trim().replace(/[^\d.-]/g, ""));
    if (parts.length === 2) {
      const saved = parseFloat(parts[0]) || 0;
      const target = parseFloat(parts[1]) || 0;
      return [saved, target];
    }
    return [0, 0];
  };

  const [currentSaved, targetAmount] = parseAmounts(goal.amt);
  const remaining = targetAmount - currentSaved;
  const usage =
    targetAmount > 0 ? Math.round((currentSaved / targetAmount) * 100) : 0;

  const formatCurrency = (amt) => formatCurrencyUtil(amt);

  const handleSubmit = (e) => {
    e.preventDefault();
    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) return;

    let newSaved = currentSaved;
    if (action === "add") {
      newSaved = Math.min(currentSaved + amtNum, targetAmount);
    } else if (action === "subtract") {
      newSaved = Math.max(0, currentSaved - amtNum);
    }

    const newRemain = Math.max(0, targetAmount - newSaved);
    const newUsage =
      targetAmount > 0 ? Math.round((newSaved / targetAmount) * 100) : 0;

    const updatedGoal = {
      ...goal,
      amt: `${formatCurrency(newSaved)} / ${formatCurrency(targetAmount)}`,
      used: `${newUsage}%`,
      remain: formatCurrency(newRemain),
    };

    onUpdate(updatedGoal);
    onClose();
  };

  // Toggle button UI
  const toggleAction = () => {
    setAction((prev) => (prev === "add" ? "subtract" : "add"));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80"></div>
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-color)] bg-[var(--background-color)] p-6 shadow-lg  sm:rounded-lg sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <h1 className="text-lg text-[var(--heading-text)] font-semibold leading-none tracking-tight">
              Update "{goal.title}" Savings Goal
            </h1>
            <p className="text-sm text-[var(--sub-heading-text)]">
              Add or subtract funds from your savings goal.
            </p>
          </div>
          <div className="grid gap-4 py-4">
            <div className="bg-[var(--sub-hover)] rounded-lg p-4 space-y-2 text-[var(--heading-text)]">
              <div className="flex justify-between text-sm">
                <span>Current saved:</span>
                <span className="font-medium">
                  {formatCurrency(currentSaved)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Goal target:</span>
                <span className="font-medium">
                  {formatCurrency(targetAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining:</span>
                <span className="font-medium text-green-500">
                  {formatCurrency(remaining)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Progress:</span>
                <span
                  className={`font-medium ${usage > 50 ? "text-green-600" : "text-green-500"}`}
                >
                  {usage}%
                </span>
              </div>
            </div>
            <div className="space-y-2 text-[var(--heading-text)]">
              <div className="text-sm font-medium leading-none">Action</div>
              {/* Toggle Button */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={toggleAction}
                  className={`flex items-center px-4 py-2 rounded-full border transition-colors duration-200 cursor-pointer ${
                    action === "add"
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-red-500 text-white border-red-500"
                  }`}
                  aria-pressed={action === "add" ? "true" : "false"}
                >
                  {action === "add" ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-plus-icon lucide-plus w-4 h-4 mr-1"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      Add
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-minus-icon lucide-minus w-4 h-4 mr-1"
                      >
                        <path d="M5 12h14" />
                      </svg>
                      Subtract
                    </>
                  )}
                </button>
                <span className="text-xs text-[var(--sub-heading-text)]">
                  {action === "add" ? "Switch to subtract" : "Switch to add"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="text-sm text-[var(--heading-text)] font-medium leading-none"
              >
                Amount *
              </label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--sub-heading-text)]">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-[var(--sub-background-color)] placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sub-background-color)] focus-visible:ring-offset-2 pl-7"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  max={
                    action === "add"
                      ? Math.max(0, targetAmount - currentSaved)
                      : currentSaved
                  }
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-[var(--sub-heading-text)]">
                {action === "add"
                  ? "Add funds to this savings goal"
                  : "Subtract funds from this savings goal"}
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm text-[var(--heading-text)] font-medium border border-[var(--border-color)] bg-[var(--background-color)] hover:bg-[var(--sub-hover)] h-10 px-4 py-2 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover-bg)] h-10 px-4 py-2 cursor-pointer"
            >
              {action === "add" ? "Add " : "Subtract "}
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
            className="lucide lucide-x-icon lucide-x w-5 h-5 text-[var(--heading-text)]"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default SavingsGoalUpdateModal;
