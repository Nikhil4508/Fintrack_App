import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCurrencySymbol } from "../lib/userPreferences";

const Savingmodal = ({ onClose, onAddGoal }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dateRef = useRef(null);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const datePickerRef = useRef(null);

  // Get currency symbol from user preferences
  const [currencySymbol, setCurrencySymbol] = useState(() => {
    const prefs = localStorage.getItem("fintrack_preferences");
    const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
    return getCurrencySymbol(currency);
  });

  // Prevent background scroll when modal is open
  useEffect(() => {
    // Save original overflow
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Custom input for DatePicker
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <button
      type="button"
      className={`flex h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--background-color)] pl-10 pr-3 py-2 text-sm ring-offset-[var(--sub-background-color)] placeholder:text-[var(--sub-heading-text)] focus:outline-none focus:ring-1 focus:ring-[var(--sub-background-color)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer mt-2 text-left ${
        !value ? "text-[var(--sub-heading-text)]" : "text-[var(--heading-text)]"
      }`}
      onClick={onClick}
      ref={ref}
      aria-label="Select date"
    >
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
        className="lucide lucide-calendar h-5 w-5 opacity-90 absolute left-3 text-[var(--heading-text)] pointer-events-none"
        style={{
          left: "0.75rem",
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      {value || "Select Date"}
    </button>
  ));

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare the goal data
    const goalData = {
      goalName,
      targetAmount: parseFloat(targetAmount),
      initialAmount: initialAmount ? parseFloat(initialAmount) : 0,
      date: selectedDate ? selectedDate : null,
    };
    // Call the callback to add the goal
    if (onAddGoal) {
      onAddGoal(goalData);
    }
    onClose();
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setDatePickerOpen(false);
      }
    }
    if (datePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [datePickerOpen]);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 "></div>
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-color)] bg-[var(--background-color)] p-6 shadow-lg  sm:rounded-lg sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <h1 className="text-lg text-[var(--heading-text)] font-semibold leading-none tracking-tight">
              Create Savings Goal
            </h1>
            <p className="text-sm text-[var(--sub-heading-text)]">
              Set a new savings goal to track your progress.
            </p>
          </div>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="gaol-name"
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Goal Name *
              </label>
              <input
                type="text"
                className="flex h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-[var(--sub-background-color)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sub-background-color)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                placeholder="eg., Emergency Fund,Vacation,New Car"
                step="0.01"
                id="goal-name"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="target-amount"
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Target Amount *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--sub-heading-text)]">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-[var(--sub-background-color)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sub-background-color)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-7 mt-2"
                  placeholder="0.00"
                  step="0.01"
                  id="target-amount"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="Initial-amount"
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
              >
                Initial Amount * (Optional)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--sub-heading-text)]">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-[var(--sub-background-color)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--sub-background-color)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-7 mt-2"
                  placeholder="0.00"
                  step="0.01"
                  id="Initial-amount"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="date"
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Date * (Optional)
              </label>
              <div className="relative" ref={datePickerRef}>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  customInput={<CustomInput />}
                  dateFormat="dd-MM-yyyy"
                  popperPlacement="bottom-start"
                  popperClassName="z-[9999]"
                  placeholderText="Select Date"
                  showPopperArrow={false}
                  wrapperClassName="w-full"
                />
                {/* Custom styles for react-datepicker */}
                <style>
                  {`
                    .react-datepicker-light {
                      background: var(--background-color);
                      color: var(--heading-text);
                      border: 1px solid var(--border-color);
                    }
                    .react-datepicker-dark {
                      background: var(--background-color);
                      color: var(--heading-text);
                      border: 1px solid var(--border-color);
                    }
                    .react-datepicker__day--selected,
                    .react-datepicker__day--keyboard-selected {
                      background: var(--sub-background-color);
                      color: var(--heading-text);
                    }
                    .react-datepicker__header {
                      background: var(--background-color);
                      border-bottom: 1px solid var(--border-color);
                    }
                    .react-datepicker__current-month,
                    .react-datepicker-time__header,
                    .react-datepicker-year-header {
                      color: var(--heading-text);
                    }
                  `}
                </style>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm text-[var(--heading-text)] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--border-color)] bg-[var(--background-color)] hover:bg-[var(--sub-hover)] hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
              onClick={onClose}
            >
              cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover-bg)] h-10 px-4 py-2 cursor-pointer"
            >
              Add Transaction
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
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
            className="lucide lucide-x-icon lucide-x w-5 h-5 text-[var(--heading-text)]
        "
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default Savingmodal;
