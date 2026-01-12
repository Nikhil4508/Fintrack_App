import { useRef, useState, useEffect } from "react";
import { Plus, Ellipsis } from "lucide-react";
import Transactionmodal from "./Transactionmodal";
import TransactionDetailModal from "./TransactionDetailModal";
import initialTransactions from "../data/initialTransactions";
import { getUserStorageKey, isDemoUser } from "../lib/helper/demoUser";
import { formatCurrency, getCurrencySymbol } from "../lib/userPreferences";

// Helper function to parse dd/mm/yy to Date object
function parseDate(dateStr) {
  // Assumes format dd/mm/yy
  const [day, month, year] = dateStr.split("/").map(Number);
  // Adjust year for 20xx
  const fullYear = year < 100 ? 2000 + year : year;
  return new Date(fullYear, month - 1, day);
}

// Helper functions for date range checks
function isToday(date) {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function isThisWeek(date) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return date >= startOfWeek && date <= endOfWeek;
}

function isThisMonth(date) {
  const now = new Date();
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function isLastMonth(date) {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return (
    date.getMonth() === lastMonth.getMonth() &&
    date.getFullYear() === lastMonth.getFullYear()
  );
}

function isThisYear(date) {
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
}

function isLastYear(date) {
  const now = new Date();
  return date.getFullYear() === now.getFullYear() - 1;
}

const categoryFilter = [
  "All Time",
  "Today",
  "This Week",
  "This Month",
  "Last Month",
  "This Year",
  "Last Year",
];

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState("All Time");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [descSortAsc, setDescSortAsc] = useState(true); // true: A-Z, false: Z-A
  const [amtSortAsc, setAmtSortAsc] = useState(true); // true: min->max, false: max->min
  const [detailModalTx, setDetailModalTx] = useState(null);
  const itemsPerPage = 8;

  // For per-row actions menu
  const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

  // Get currency symbol from user preferences
  const [currencySymbol, setCurrencySymbol] = useState(() => {
    const prefs = localStorage.getItem("fintrack_preferences");
    const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
    return getCurrencySymbol(currency);
  });

  // Handler to remove a transaction
  const removeTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    setActionMenuOpenId(null);
  };

  const viewTransactionDetail = (tx) => {
    setDetailModalTx(tx);
    setActionMenuOpenId(null); // Optionally close the action menu
  };

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

  // Close action menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        actionMenuOpenId !== null &&
        !event.target.closest(".transaction-action-menu")
      ) {
        setActionMenuOpenId(null);
      }
    }
    if (actionMenuOpenId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionMenuOpenId]);

  // Load transactions from localStorage or use initialTransactions (demo data for demo user only)
  const [transactions, setTransactions] = useState(() => {
    const storageKey = getUserStorageKey("fintrack_transactions");
    const stored = localStorage.getItem(storageKey);
    const prefs = localStorage.getItem("fintrack_preferences");
    const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
    const symbol = getCurrencySymbol(currency);

    // Helper to update currency symbol in amount
    const updateCurrencyInAmount = (amt) => {
      if (!amt) return amt;
      // Extract numeric value and sign
      const isNegative = amt.startsWith("-");
      const numericValue = parseFloat(amt.replace(/[^0-9.-]/g, ""));
      if (isNaN(numericValue)) return amt;
      // Format with current currency
      const formatted = numericValue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${isNegative ? "-" : "+"}${symbol}${formatted}`;
    };

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Restore icon property and update currency symbols
        return parsed.map((tx) => ({
          ...tx,
          amt: updateCurrencyInAmount(tx.amt),
          icon: Ellipsis,
        }));
      } catch {
        // If demo user, show demo data, otherwise empty
        const demoData = isDemoUser() ? initialTransactions : [];
        return demoData.map((tx) => ({
          ...tx,
          amt: updateCurrencyInAmount(tx.amt),
          icon: Ellipsis,
        }));
      }
    }
    // If demo user, show demo data, otherwise empty
    const demoData = isDemoUser() ? initialTransactions : [];
    return demoData.map((tx) => ({
      ...tx,
      amt: updateCurrencyInAmount(tx.amt),
      icon: Ellipsis,
    }));
  });

  // Update transaction amounts when currency preference changes
  useEffect(() => {
    const handlePreferenceChange = () => {
      const prefs = localStorage.getItem("fintrack_preferences");
      const currency = prefs ? JSON.parse(prefs).currency : "USD - US Dollar";
      const symbol = getCurrencySymbol(currency);

      setTransactions((prev) =>
        prev.map((tx) => {
          // Extract numeric value and sign from current amount
          const isNegative = tx.amt.startsWith("-");
          const numericValue = parseFloat(tx.amt.replace(/[^0-9.-]/g, ""));
          if (isNaN(numericValue)) return tx;
          // Format with new currency
          const formatted = numericValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          return {
            ...tx,
            amt: `${isNegative ? "-" : "+"}${symbol}${formatted}`,
          };
        }),
      );
    };

    window.addEventListener("preferencesChanged", handlePreferenceChange);
    return () => {
      window.removeEventListener("preferencesChanged", handlePreferenceChange);
    };
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    const storageKey = getUserStorageKey("fintrack_transactions");
    // Remove icon property before saving (functions can't be stringified)
    const toStore = transactions.map(({ icon, ...rest }) => rest);
    localStorage.setItem(storageKey, JSON.stringify(toStore));

    // Dispatch event so Dashboard can update
    window.dispatchEvent(new Event("transactionsUpdated"));
  }, [transactions]);

  // Handler to add a new transaction
  const addTransaction = (newTx) => {
    // Convert amount to use current currency symbol
    const numericAmount = parseFloat(newTx.amt.replace(/[^0-9.-]/g, ""));
    const isNegative = newTx.amt.startsWith("-");
    const formattedAmount = `${isNegative ? "-" : "+"}${formatCurrency(Math.abs(numericAmount))}`;

    setTransactions((prev) => [
      {
        ...newTx,
        amt: formattedAmount,
        id: prev.length ? Math.max(...prev.map((t) => t.id)) + 1 : 1,
        icon: Ellipsis,
      },
      ...prev,
    ]);
    setShowModal(false);
  };

  // Function to filter transactions based on the active tab
  const getFilteredTransactions = () => {
    if (activeTab === "All") {
      return transactions;
    }
    return transactions.filter((transaction) => {
      if (activeTab === "Income") {
        return transaction.cat.toLowerCase() === "income";
      } else if (activeTab === "Expenses") {
        return transaction.cat.toLowerCase() !== "income";
      }
      return false;
    });
  };

  // Filter by date category
  const filterByCategory = (transactions) => {
    if (selectedCategoryFilter === "All Time") return transactions;
    return transactions.filter((tx) => {
      const txDate = parseDate(tx.date);
      switch (selectedCategoryFilter) {
        case "Today":
          return isToday(txDate);
        case "This Week":
          return isThisWeek(txDate);
        case "This Month":
          return isThisMonth(txDate);
        case "Last Month":
          return isLastMonth(txDate);
        case "This Year":
          return isThisYear(txDate);
        case "Last Year":
          return isLastYear(txDate);
        default:
          return true;
      }
    });
  };

  //filter by tab
  let filteredTransactions = getFilteredTransactions();

  // 2. Filter by date category
  filteredTransactions = filterByCategory(filteredTransactions);

  // Search filter on filteredTransactions
  const searchedTransactions = filteredTransactions.filter((transaction) => {
    if (!search.trim()) return true;
    const searchLower = search.toLowerCase();
    return (
      transaction.desc.toLowerCase().includes(searchLower) ||
      transaction.cat.toLowerCase().includes(searchLower) ||
      transaction.date.toLowerCase().includes(searchLower) ||
      transaction.amt.toLowerCase().includes(searchLower)
    );
  });

  // Sort by description or amount
  let sortedTransactions = [...searchedTransactions];
  if (amtSortAsc !== null) {
    // If amount sort is active, sort by amount
    sortedTransactions.sort((a, b) => {
      // Remove $ and commas, convert to float, handle +/-
      const parseAmt = (amt) => parseFloat(amt.replace(/[^0-9.-]+/g, ""));
      const aVal = parseAmt(a.amt);
      const bVal = parseAmt(b.amt);
      return amtSortAsc ? aVal - bVal : bVal - aVal;
    });
  } else {
    // Otherwise, sort by description
    sortedTransactions.sort((a, b) => {
      if (a.desc.toLowerCase() < b.desc.toLowerCase())
        return descSortAsc ? -1 : 1;
      if (a.desc.toLowerCase() > b.desc.toLowerCase())
        return descSortAsc ? 1 : -1;
      return 0;
    });
  }

  // Calculate the transactions to display based on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  // Calculate total pages
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  // Handler for sorting
  const handleDescSort = () => {
    setDescSortAsc((prev) => !prev);
    setAmtSortAsc(null); // disable amount sort
    setCurrentPage(1);
  };
  const handleAmtSort = () => {
    setAmtSortAsc((prev) => (prev === null ? true : !prev));
    setDescSortAsc(true); // reset desc sort
    setCurrentPage(1);
  };

  return (
    <>
      {showModal && (
        <Transactionmodal
          onClose={() => setShowModal(false)}
          addTransaction={addTransaction}
        />
      )}
      {detailModalTx && (
        <TransactionDetailModal
          transaction={detailModalTx}
          onClose={() => setDetailModalTx(null)}
        />
      )}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between ">
          <h2 className="text-3xl text-[var(--heading-text)] font-semibold tracking-tight">
            Transactions
          </h2>
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover-bg)] h-10 md:px-4 px-2 py-2 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <Plus />
            <span className="hidden md:inline">Add Transaction</span>
          </button>
        </div>
        <div className="space-y-4">
          {/* sub-header */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-[var(--sub-background-color)] p-1 text-[var(--sub-heading-text)]">
              <button
                type="button"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${activeTab === "All" ? "bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm" : ""}`}
                onClick={() => setActiveTab("All")}
              >
                All
              </button>
              <button
                type="button"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${activeTab === "Income" ? "bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm" : ""}`}
                onClick={() => setActiveTab("Income")}
              >
                Income
              </button>
              <button
                type="button"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${activeTab === "Expenses" ? "bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm" : ""}`}
                onClick={() => setActiveTab("Expenses")}
              >
                Expenses
              </button>
            </div>
            {/* searchbar and filter */}
            <div className="flex flex-wrap gap-2 justify-end items-center">
              {/* category wise dropdown */}
              <div
                className="relative flex-shrink-0 order-1 sm:order-2"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  className="flex items-center justify-between rounded-md border border-[var(--sub-background-color)] bg-[var(--background-color)] px-2 md:px-3 py-2 text-sm ring-offset-[var(--background-color)] placeholder:text-[var(--sub-heading-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sub-background-color)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-[120px] md:w-[180px] h-9 cursor-pointer"
                  onClick={() => setDropdownOpen((open) => !open)}
                >
                  <span className="text-[var(--heading-text)] truncate">
                    {selectedCategoryFilter || "All Time"}
                  </span>
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
                    className="lucide lucide-chevron-down-icon lucide-chevron-down h-4 w-4 text-[var(--sub-heading-text)]"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-[var(--background-color)] border border-[var(--border-color)] rounded-md shadow-lg max-h-64 overflow-auto">
                    {categoryFilter.map((cat) => (
                      <li
                        key={cat}
                        className={`px-4 py-2 cursor-pointer hover:bg-[var(--btn-sub-hover)] text-sm text-[var(--heading-text)] ${selectedCategoryFilter === cat ? "bg-[var(--btn-sub-hover)] font-semibold" : ""}`}
                        onClick={() => {
                          setSelectedCategoryFilter(cat);
                          setDropdownOpen(false);
                        }}
                      >
                        {cat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* searchbar */}
              <div className="w-full sm:w-auto sm:max-w-sm order-2 sm:order-1">
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only"
                  htmlFor="search"
                ></label>
                <input
                  id="search"
                  placeholder="search transactions..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1); //reset to first page on search
                  }}
                  className="flex w-full rounded-md border border-[var(--sub-background-color)] bg-[var(--background-color)] px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-[var(--background-color)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sub-background-color)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-9"
                />
              </div>
            </div>
          </div>
          {/*main-section  */}
          <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  {activeTab} Transactions
                </h3>
                <p className="text-sm text-[var(--sub-heading-text)]">
                  View all your {activeTab.toLowerCase()} transactions
                </p>
              </div>
              <div className="p-6 pt-0">
                <div>
                  <div className="rounded-md border border-[var(--border-color)]">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b-[var(--border-color)]">
                          <tr className="border-b transition-colors hover:bg-[var(--sub-hover)] ">
                            <th className="h-12 px-4 text-left align-middle font-medium text-[var(--sub-heading-text)] ">
                              Date
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-[var(--sub-heading-text)]">
                              <button
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-[var(--sub-background-color)] text-[var(--sub-heading-text)] h-10 px-4 py-2 cursor-pointer"
                                onClick={handleDescSort}
                              >
                                Description
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
                                  className="lucide lucide-arrow-down-up-icon lucide-arrow-down-up"
                                >
                                  <path d="m3 16 4 4 4-4" />
                                  <path d="M7 20V4" />
                                  <path d="m21 8-4-4-4 4" />
                                  <path d="M17 4v16" />
                                </svg>
                              </button>
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-[var(--sub-heading-text)] ">
                              Category
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-[var(--sub-heading-text)] ">
                              <button
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-[var(--sub-background-color)] text-[var(--sub-heading-text)] hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                                onClick={handleAmtSort}
                              >
                                Amount
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
                                  className="lucide lucide-arrow-down-up-icon lucide-arrow-down-up"
                                >
                                  <path d="m3 16 4 4 4-4" />
                                  <path d="M7 20V4" />
                                  <path d="m21 8-4-4-4 4" />
                                  <path d="M17 4v16" />
                                </svg>
                              </button>
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-[var(--sub-heading-text)] "></th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {currentTransactions.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-8 text-center text-[var(--sub-heading-text)]"
                              >
                                No transactions found.
                              </td>
                            </tr>
                          ) : (
                            currentTransactions.map((items, idx) => (
                              <tr
                                key={idx}
                                className="transition-colors hover:bg-[var(--sub-hover)] "
                                style={{
                                  borderBottom: "1px solid var(--border-color)",
                                }}
                              >
                                <td className="p-4 align-middle ">
                                  {items.date}
                                </td>
                                <td className="p-4 align-middle">
                                  {items.desc}
                                </td>
                                <td className="p-4 align-middle ">
                                  <div className="inline-flex items-center rounded-full border border-[var(--border-color)] px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                                    {items.cat}
                                  </div>
                                </td>
                                <td className="p-4 align-middle ">
                                  <div
                                    className={`text-base font-medium ${items.amt.startsWith("-") ? "text-red-600" : "text-green-600"}`}
                                  >
                                    {items.amt}
                                  </div>
                                </td>
                                <td className="p-4 align-middle relative">
                                  <button
                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-[var(--sub-background-color)] text-[var(--heading-text)] h-8 w-8 cursor-pointer "
                                    type="button"
                                    onClick={() =>
                                      setActionMenuOpenId(items.id)
                                    }
                                  >
                                    <items.icon />
                                  </button>
                                  {actionMenuOpenId === items.id && (
                                    <div className="transaction-action-menu absolute right-10 z-20 mt-2 w-40 bg-[var(--background-color)] border border-[var(--border-color)] rounded-md shadow-lg p-1">
                                      <div className=" p-2 text-sm font-semibold text-[var(--heading-text)] leading-none tracking-tight mb-2">
                                        Actions
                                      </div>
                                      <button
                                        className="w-full text-left px-2 py-2 hover:bg-[var(--btn-sub-hover)] text-[var(--heading-text)] flex items-center rounded-md gap-3"
                                        onClick={() =>
                                          viewTransactionDetail(items)
                                        }
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
                                          className="lucide lucide-eye-icon lucide-eye h-4 w-4"
                                        >
                                          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                          <circle cx="12" cy="12" r="3" />
                                        </svg>
                                        View Detail
                                      </button>
                                      <button
                                        className="w-full text-left px-2 py-2 flex items-center gap-3 rounded-md hover:bg-red-100 text-red-600"
                                        onClick={() =>
                                          removeTransaction(items.id)
                                        }
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
                                          className="lucide lucide-trash2-icon lucide-trash-2 w-4 h-4"
                                        >
                                          <path d="M3 6h18" />
                                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                          <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                          />
                                          <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                          />
                                        </svg>
                                        Remove
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* next and prev button */}
                  <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="hidden md:block text-sm text-[var(--sub-heading-text)]">
                      Showing {currentTransactions.length} of{" "}
                      {searchedTransactions.length} transaction(s)
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--sub-background-color)] bg-background hover:bg-[var(--btn-sub-hover)] hover:text-accent-foreground h-9 rounded-md px-3"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <button
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--sub-background-color)] bg-background hover:bg-[var(--btn-sub-hover)] hover:text-accent-foreground h-9 rounded-md px-3"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
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

export default Transactions;
