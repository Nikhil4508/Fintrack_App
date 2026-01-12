import React, { useState, useRef, useEffect } from "react";
import { getCurrencySymbol } from "../lib/userPreferences";

const categories = [
  "Groceries",
  "Dining",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health",
  "Housing",
  "Travel",
  "Education",
  "Insurance",
  "Subscriptions",
  "Income",
  "Other",
];

const Transactionmodal = ({ onClose, addTransaction }) => {
  const [transactionType, setTransactionType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dateRef = useRef(null);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setDatePickerOpen(false);
      }
    }
    if (dropdownOpen || datePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, datePickerOpen]);

  // Helper to format date as dd/mm/yy
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year.slice(-2)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !transactionType ||
      !selectedCategory ||
      !selectedDate ||
      !amount ||
      !description
    ) {
      alert("Please fill all required fields.");
      return;
    }
    // Format amount with + or - and current currency symbol
    const amtPrefix = transactionType === "income" ? "+" : "-";
    const formattedAmt = `${amtPrefix}${currencySymbol}${parseFloat(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    addTransaction({
      date: formatDate(selectedDate),
      desc: description,
      cat: selectedCategory,
      amt: formattedAmt,
    });
    // Optionally reset form here
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 "></div>
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-color)] bg-[var(--background-color)] p-6 shadow-lg  sm:rounded-lg sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <h1 className="text-lg text-[var(--heading-text)] font-semibold leading-none tracking-tight">
              Add Transactions
            </h1>
            <p className="text-sm text-[var(--sub-heading-text)]">
              Enter the details of your transaction below.
            </p>
          </div>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <div className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ">
                Transaction Type
              </div>
              <div className="flex gap-2 space-x-2 ">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="expense"
                    name="transactionType"
                    value="expense"
                    checked={transactionType === "expense"}
                    onChange={() => setTransactionType("expense")}
                    className="h-4 w-4 text-black ring-offset-black"
                  />
                  <label
                    htmlFor="expense"
                    className="text-[var(--heading-text)]"
                  >
                    Expense
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="income"
                    name="transactionType"
                    value="income"
                    checked={transactionType === "income"}
                    onChange={() => setTransactionType("income")}
                    className="h-4 w-4 text-black ring-offset-black"
                  />
                  <label
                    htmlFor="income"
                    className="text-[var(--heading-text)]"
                  >
                    Income
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label
                for="amount"
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Amount *
              </label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#7e7d7d]">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  className="flex h-10 w-full rounded-md border border-[#cccccc] bg-background px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-background file:border-0 file:bg-transparent file:text-sm  file:font-medium file:text-foreground placeholder:text-[#7e7d7d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 pl-7"
                  placeholder="0.00"
                  step="0.01"
                  id="amount"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                for="description"
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Description *
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  className="flex h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your Description"
                  id="description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Category *
              </label>
              <div className="relative mt-2" ref={dropdownRef}>
                <button
                  id="category"
                  type="button"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-background placeholder:text-[var(--sub-heading-text)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <span>{selectedCategory || "Select Category"}</span>
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
                    className="lucide lucide-chevron-down-icon lucide-chevron-down h-4 w-4 opacity-50"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <ul
                    className="absolute z-10 mt-[-284px] w-full bg-[var(--background-color)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-auto [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded"
                  >
                    {categories.map((cat) => (
                      <li
                        key={cat}
                        className={`px-4 py-2 cursor-pointer hover:bg-[var(--sub-hover)] text-sm text-[var(--heading-text)] ${selectedCategory === cat ? "bg-[var(--sub-hover)] font-semibold" : ""}`}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setDropdownOpen(false);
                        }}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="date"
                className="text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Date *
              </label>
              <div className="relative mt-2">
                <label htmlFor="date-input" className="sr-only">
                  Date
                </label>
                <div className="flex items-center relative">
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
                    className="lucide lucide-calendar h-5 w-5 opacity-90 absolute left-3 pointer-events-none text-[var(--heading-text)] "
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <input
                    id="date-input"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--background-color)] pl-10 pr-3 py-2 text-sm text-[var(--heading-text)] ring-offset-background placeholder:text-[var(--sub-heading-text)] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    value={
                      selectedDate
                        ? `${selectedDate.split("-")[2]}-${selectedDate.split("-")[1]}-${selectedDate.split("-")[0]}`
                        : ""
                    }
                    onFocus={(e) => {
                      e.target.blur();
                      document.getElementById("hidden-date-input").showPicker();
                    }}
                    placeholder="Select Date"
                    readOnly
                  />
                  <input
                    id="hidden-date-input"
                    type="date"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    tabIndex={-1}
                  />
                </div>
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
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-[var(--heading-text)]"
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
            className="lucide lucide-x-icon lucide-x w-5 h-5
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

export default Transactionmodal;
