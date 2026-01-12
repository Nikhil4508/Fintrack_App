import React, { useEffect, useState } from "react";
import { getCurrencySymbol, formatCurrency } from "../lib/userPreferences";

const BudgetUpdateModal = ({ budget, onUpdate, onClose }) => {
  // Form state
  const [action, setAction] = useState("add");
  const [amount, setAmount] = useState("");

  // Get currency symbol from user preferences
  const [currencySymbol, setCurrencySymbol] = useState(() => {
    const prefs = localStorage.getItem("fintrack_preferences");
    const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
    return getCurrencySymbol(currency);
  });

  // Prevent background scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
    setAmount("");
    setAction("add");
  }, [budget]);

  if (!budget) return null;

  // Parse current values
  // amt: "$180.00 / $200.00" or "€180.00 / €200.00" etc.
  const [spentStr, totalStr] = budget.amt
    .split("/")
    .map((s) => s.trim().replace(/[^\d.-]/g, ""));
  const spent = parseFloat(spentStr) || 0;
  const total = parseFloat(totalStr) || 0;
  const remaining = total - spent;
  const usage = total > 0 ? Math.round((spent / total) * 100) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) return;

    let newSpent = spent;
    if (action === "add") {
      newSpent = spent + amtNum;
    } else if (action === "subtract") {
      newSpent = Math.max(0, spent - amtNum);
    }

    // Clamp to total
    const newRemain = Math.max(0, total - newSpent);
    const newUsage = total > 0 ? Math.round((newSpent / total) * 100) : 0;

    // Format values with current currency
    const newBudget = {
      ...budget,
      amt: `${formatCurrency(newSpent)} / ${formatCurrency(total)}`,
      used: `${newUsage}%`,
      remain: formatCurrency(newRemain),
    };

    onUpdate(newBudget);
    onClose();
  };

  // Toggle button UI
  const toggleAction = () => {
    setAction((prev) => (prev === "add" ? "subtract" : "add"));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80"></div>
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-color)] bg-[var(--background-color)] p-6 shadow-lg duration-200 sm:rounded-lg sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <h2 className="text-lg text-[var(--heading-text)] font-semibold leading-none tracking-tight flex items-center gap-2">
              Update {budget.title} Budget
            </h2>
            <p className="text-sm text-[var(--sub-heading-text)]">
              Add or subtract spending from your {budget.period || "monthly"}{" "}
              {budget.title.toLowerCase()} budget.
            </p>
          </div>
          <div className="grid gap-4 py-4">
            <div className="bg-[var(--sub-hover)] rounded-lg p-4 space-y-2 text-[var(--heading-text)]">
              <div className="flex justify-between text-sm">
                <span className="">Current spent:</span>
                <span className="font-medium">{formatCurrency(spent)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="">Budget total:</span>
                <span className="font-medium">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="">Remaining:</span>
                <span className="font-medium text-green-500">
                  {formatCurrency(remaining)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="">Usage:</span>
                <span
                  className={`font-medium ${usage > 50 ? "text-red-500" : "text-green-500"}`}
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
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
              >
                Amount *
              </label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--sub-heading-text)]">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm text-[var(--heading-text)]  ring-offset-[var(--sub-background-color)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sub-background-color)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-7"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  max={action === "add" ? undefined : spent}
                />
              </div>
              <p className="text-xs text-[var(--sub-heading-text)]">
                {action === "add"
                  ? "Add spending to this budget category"
                  : "Subtract spending from this budget category"}
              </p>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm text-[var(--heading-text)] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--border-color)] bg-background hover:bg-[var(--sub-hover)] hover:text-accent-foreground h-10 px-4 py-2"
            >
              Close
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm text-[var(--btn-text)] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-hover-bg)] h-10 px-4 py-2"
            >
              {action === "add" ? "Add Amount" : "Subtract Amount"}
            </button>
          </div>
        </form>

        {/* close btn */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-[var(--background-color)] transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-[var(--sub-heading-text)]"
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
            className="lucide lucide-x-icon lucide-x w-5 h-5"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default BudgetUpdateModal;
