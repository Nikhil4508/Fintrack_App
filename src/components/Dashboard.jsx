import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
  PiggyBank,
  Tag,
} from "lucide-react";
import { formatCurrency, getCurrencySymbol } from "../lib/userPreferences";
import { formatDateToLong } from "../lib/DateFormat";
import initialSavingsGoals from "../data/initialSavingsGoals";
import initialBudgets from "../data/initialBudgets";
import initialTransactions from "../data/initialTransactions";
import { getUserStorageKey, isDemoUser } from "../lib/helper/demoUser";

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
  PiggyBank,
};

const CATEGORY_ICON_MAP = {
  Groceries: "ShoppingCart",
  Dining: "UtensilsCrossed",
  Entertainment: "Clapperboard",
  Transportation: "Car",
  Utilities: "Zap",
  Shopping: "ShoppingBag",
  Health: "Ambulance",
  Education: "GraduationCap",
  Other: "Tag",
  // ...add more as needed
};

const getInitialTransactions = () => {
  const storageKey = getUserStorageKey("fintrack_transactions");
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return isDemoUser() ? initialTransactions : [];
    }
  }
  return isDemoUser() ? initialTransactions : [];
};

const Dashboard = () => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "var(--background-color, #1a1a1a)",
            color: "var(--heading-text, #fff)",
            border: "1px solid var(--border-color, #333)",
            borderRadius: 12,
            padding: "16px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            minWidth: "180px",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: 12,
              fontSize: "14px",
              color: "var(--heading-text)",
              borderBottom: "1px solid var(--border-color, #333)",
              paddingBottom: 8,
            }}
          >
            {label}
          </div>
          {payload.map((entry, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: idx < payload.length - 1 ? 8 : 0,
                fontSize: "13px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 3,
                    background: entry.color,
                  }}
                />
                <span style={{ color: "var(--sub-heading-text, #aaa)" }}>
                  {entry.name}:
                </span>
              </div>
              <span style={{ color: entry.color, fontWeight: 600 }}>
                {currencySymbol}
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const [activeTab, setActiveTab] = useState("Overview");
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

  // Transactions state from localStorage
  const [transactions, setTransactions] = useState(getInitialTransactions);

  // Listen for localStorage changes (cross-tab and in-app)
  useEffect(() => {
    const onTransactionsUpdated = () => {
      setTransactions(getInitialTransactions());
    };
    window.addEventListener("transactionsUpdated", onTransactionsUpdated);
    window.addEventListener("storage", (e) => {
      const storageKey = getUserStorageKey("fintrack_transactions");
      if (e.key === storageKey) {
        onTransactionsUpdated();
      }
    });
    return () => {
      window.removeEventListener("transactionsUpdated", onTransactionsUpdated);
      window.removeEventListener("storage", onTransactionsUpdated);
    };
  }, []);

  // Show only the latest 5 transactions, newest first
  const recentTransactions = [...transactions].slice(-5).reverse();

  // Budgets and savings goals logic remains unchanged...
  const [latestBudgets, setLatestBudgets] = useState(() => {
    const storageKey = getUserStorageKey("fintrack_category_budgets");
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        // Patch missing icons
        return JSON.parse(stored).map((budget) => ({
          ...budget,
          icon: budget.icon || CATEGORY_ICON_MAP[budget.title] || "Tag",
        }));
      } catch {
        return isDemoUser() ? initialBudgets : [];
      }
    }
    return isDemoUser() ? initialBudgets : [];
  });

  useEffect(() => {
    const onBudgetsUpdated = () => {
      const storageKey = getUserStorageKey("fintrack_category_budgets");
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setLatestBudgets(JSON.parse(stored));
        } catch {
          setLatestBudgets(isDemoUser() ? initialBudgets : []);
        }
      } else {
        setLatestBudgets(isDemoUser() ? initialBudgets : []);
      }
    };
    window.addEventListener("budgetsUpdated", onBudgetsUpdated);
    window.addEventListener("storage", onBudgetsUpdated);
    return () => {
      window.removeEventListener("budgetsUpdated", onBudgetsUpdated);
      window.removeEventListener("storage", onBudgetsUpdated);
    };
  }, []);

  // Show only the latest 5 budgets, newest first
  const latestFiveBudgets = latestBudgets.slice(-5).reverse();

  // Always get the latest savings goals from localStorage, fallback to initialSavingsGoals
  const [latestSavingGoals, setLatestSavingGoals] = useState(() => {
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

  // Listen for localStorage changes (e.g., when a new goal is added)
  useEffect(() => {
    const onStorage = () => {
      const storageKey = getUserStorageKey("savingBudgetCards");
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setLatestSavingGoals(JSON.parse(stored));
        } catch {
          setLatestSavingGoals(isDemoUser() ? initialSavingsGoals : []);
        }
      } else {
        setLatestSavingGoals(isDemoUser() ? initialSavingsGoals : []);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Also update when the component mounts (in case localStorage changed in this tab)
  useEffect(() => {
    const storageKey = getUserStorageKey("savingBudgetCards");
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setLatestSavingGoals(JSON.parse(stored));
      } catch {
        setLatestSavingGoals(isDemoUser() ? initialSavingsGoals : []);
      }
    } else {
      setLatestSavingGoals(isDemoUser() ? initialSavingsGoals : []);
    }
  }, []);

  // Show only the latest 5 goals, newest first
  const latestFiveGoals = latestSavingGoals.slice(-5).reverse();

  // --- Dynamic Card Data Calculation ---

  // Helper to parse transaction amount string (e.g. "+$1,000.00" or "-$500.00")
  const parseAmount = (amtStr) => {
    if (!amtStr) return 0;
    // Remove all except digits, minus, dot
    return parseFloat(amtStr.replace(/[^0-9.-]+/g, "")) || 0;
  };

  // Calculate Income, Expenses, Total Balance
  const income = transactions
    .filter((tx) => tx.amt && tx.amt.trim().startsWith("+"))
    .reduce((sum, tx) => sum + parseAmount(tx.amt), 0);

  const expenses = transactions
    .filter((tx) => tx.amt && tx.amt.trim().startsWith("-"))
    .reduce((sum, tx) => sum + parseAmount(tx.amt), 0);

  const totalBalance = income + expenses; // expenses is negative

  // Calculate Savings from SavingsGoals
  // Assume goal.amt is like "$1,000.00 / $5,000.00" (saved / target)
  const parseSavingsAmt = (amtStr) => {
    if (!amtStr) return 0;
    // Currency-agnostic: extract first number from any currency format
    const cleaned = amtStr.replace(/[^\d.-]/g, "");
    return parseFloat(cleaned) || 0;
  };

  const savings = latestSavingGoals.reduce(
    (sum, goal) => sum + parseSavingsAmt(goal.amt),
    0,
  );

  // Dynamic card data
  const formatAmountOnly = (val) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(val));
  };

  const cardData = [
    {
      id: 1,
      title: "Total Balance",
      price: (totalBalance < 0 ? "-" : "") + formatAmountOnly(totalBalance),
      desc: "",
    },
    {
      id: 2,
      title: "Income",
      price: formatAmountOnly(income),
      desc: "",
    },
    {
      id: 3,
      title: "Expenses",
      price: formatAmountOnly(expenses),
      desc: "",
    },
    {
      id: 4,
      title: "Savings",
      price: formatAmountOnly(savings),
      desc: "",
    },
  ];

  // Generate chart data from transactions
  const generateChartData = () => {
    if (transactions.length === 0) {
      return [];
    }

    // Group transactions by month-year
    const monthlyData = {};

    transactions.forEach((tx) => {
      // Parse DD/MM/YY format correctly
      const [day, month, year] = tx.date.split("/");
      const fullYear =
        year.length === 2 ? 2000 + parseInt(year, 10) : parseInt(year, 10);

      // Create date with proper format (year, month-1, day)
      const date = new Date(
        fullYear,
        parseInt(month, 10) - 1,
        parseInt(day, 10),
      );

      const monthName = date.toLocaleString("default", { month: "short" });
      const key = `${fullYear}-${String(parseInt(month, 10) - 1).padStart(2, "0")}`; // Pad month with leading zero for proper sorting
      const displayName = `${monthName} ${fullYear}`; // Display as "Jan 2026"

      if (!monthlyData[key]) {
        monthlyData[key] = {
          name: displayName,
          income: 0,
          expenses: 0,
          savings: 0,
          sortKey: key,
        };
      }

      const amount = parseAmount(tx.amt);
      if (amount > 0) {
        monthlyData[key].income += amount;
      } else {
        monthlyData[key].expenses += Math.abs(amount);
      }
    });

    // Calculate savings for each month
    Object.keys(monthlyData).forEach((key) => {
      monthlyData[key].savings =
        monthlyData[key].income - monthlyData[key].expenses;
    });

    // Sort by date and return last 6 months
    return Object.values(monthlyData)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .slice(-6);
  };

  const data = generateChartData();

  // Helper to determine color based on amount string
  const getAmountColor = (amt) => {
    if (typeof amt !== "string") return "";
    if (amt.trim().startsWith("+")) {
      return "text-green-600";
    } else if (amt.trim().startsWith("-")) {
      return "text-red-600";
    }
    return "";
  };

  // Helper to get progress bar width (handles both 'used' and 'percent')
  const getProgressWidth = (goal) => {
    if (goal.used && typeof goal.used === "string" && goal.used.endsWith("%")) {
      return goal.used;
    }
    if (goal.percent !== undefined && !isNaN(goal.percent)) {
      return `${goal.percent}%`;
    }
    return "0%";
  };

  return (
    <div className="flex flex-col gap-4 bg-[var(--background-main)]">
      <h3 className="text-3xl font-semibold tracking-tight text-[var(--heading-text)]">
        Dashboard
      </h3>
      {/* map cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cardData.map((items) => (
          <div
            key={items.id}
            className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">
                {items.title}
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-semibold">
                {currencySymbol}
                {items.price}
              </div>
              <p className="text-xs text-[var(--sub-heading-text)]">
                {items.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {/* tab buttons */}
        <div className="grid grid-cols-2 gap-1 max-[473px]:grid-rows-2 min-[473px]:inline-flex min-[473px]:h-10 min-[473px]:items-center min-[473px]:justify-center rounded-md bg-[var(--sub-background-color)] p-1 text-[var(--sub-heading-text)]">
          {["Overview", "Budget", "Savings Goals", "Transactions"].map(
            (tab) => (
              <button
                key={tab}
                type="button"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${activeTab === tab ? "bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ),
          )}
        </div>

        {/* overview tab */}
        {activeTab === "Overview" && (
          <div className=" ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4">
            {/* here is the chart and recent transactions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm lg:col-span-4 col-span-7">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Financial Overview
                  </h3>
                </div>
                <div className="p-6 pt-0 pl-2">
                  {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={data}
                        margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                        barCategoryGap="20%"
                        barGap={4}
                      >
                        <defs>
                          <linearGradient
                            id="colorIncome"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#6366f1"
                              stopOpacity={0.9}
                            />
                            <stop
                              offset="95%"
                              stopColor="#4f46e5"
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorExpenses"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#f87171"
                              stopOpacity={0.9}
                            />
                            <stop
                              offset="95%"
                              stopColor="#ef4444"
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorSavings"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#34d399"
                              stopOpacity={0.9}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10b981"
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--border-color)"
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="name"
                          stroke="var(--sub-heading-text)"
                          style={{ fontSize: "12px", fontWeight: 500 }}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="var(--sub-heading-text)"
                          style={{ fontSize: "12px" }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{
                            fill: "var(--sub-background-color)",
                            opacity: 0.3,
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            paddingTop: "20px",
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                          iconType="circle"
                          iconSize={10}
                        />
                        <Bar
                          dataKey="income"
                          fill="url(#colorIncome)"
                          name="Income"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={50}
                        />
                        <Bar
                          dataKey="expenses"
                          fill="url(#colorExpenses)"
                          name="Expenses"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={50}
                        />
                        <Bar
                          dataKey="savings"
                          fill="url(#colorSavings)"
                          name="Savings"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={50}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[350px] text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[var(--sub-heading-text)] mb-4"
                      >
                        <path d="M3 3v18h18" />
                        <path d="m19 9-5 5-4-4-3 3" />
                      </svg>
                      <h3 className="text-lg font-semibold text-[var(--heading-text)] mb-2">
                        No Financial Data Yet
                      </h3>
                      <p className="text-sm text-[var(--sub-heading-text)] max-w-sm">
                        Start adding transactions to see your financial overview
                        chart. Your income, expenses, and savings will be
                        displayed here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* recent-trans */}
              <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm lg:col-span-3 col-span-7">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Recent Transactions
                  </h3>
                  <p className="text-sm text-[var(--sub-heading-text)]">
                    You made {transactions.length} transactions this month
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <div className="relative overflow-y-auto h-[300px] custom-scrollbar">
                    <div className="w-full rounded-[inherit]">
                      <div className="">
                        {recentTransactions.map((rtx) => (
                          <div key={rtx.id} className="flex items-center mb-4">
                            <div className="ml-1 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {rtx.desc}
                              </p>
                              <p className="text-sm text-[var(--sub-heading-text)]">
                                {formatDateToLong(rtx.date)}
                              </p>
                            </div>
                            <div className="ml-auto flex flex-col items-end">
                              <p
                                className={`text-sm font-medium ${getAmountColor(rtx.amt)}`}
                              >
                                {rtx.amt}
                              </p>
                              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-[var(--sub-background-color)] text-secondary-foreground hover:bg-secondary/80 mt-1">
                                {rtx.cat}
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* ... */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* budgets tab */}
        {activeTab === "Budget" && (
          <div className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4">
            <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight  text-[var(--heading-text)]">
                  Monthly Budgets
                </h3>
                <p className="text-sm text-[var(--sub-heading-text)]">
                  Track your spending against your budget goals
                </p>
              </div>
              <div className="p-6 pt-0">
                <div className="relative overflow-y-auto h-[400px] custom-scrollbar">
                  <div className="w-full rounded-[inherit]">
                    <div>
                      <div className="space-y-6">
                        {latestFiveBudgets.map((budget, id) => {
                          const IconComponent =
                            ICON_COMPONENTS[budget.icon] || ShoppingCart;
                          return (
                            <div key={id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="mr-2 text-lg">
                                    {" "}
                                    <IconComponent />{" "}
                                  </span>
                                  <span className="font-medium">
                                    {budget.title}
                                  </span>
                                  <span className="text-xs ml-2 text-[var(--sub-heading-text)]">
                                    {budget.period || "(Monthly)"}
                                  </span>
                                </div>
                                <div className="text-sm text-[var(--sub-heading-text)]">
                                  {budget.amt}
                                </div>
                              </div>
                              {/* progressbar */}
                              <div className="space-y-1">
                                <div className="relative w-full overflow-hidden rounded-full bg-[var(--sub-background-color)] h-2">
                                  <div
                                    className="h-full  flex-1 bg-[var(--progress-head)] transition-all rounded-full"
                                    style={{ width: budget.used }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-[var(--sub-heading-text)]">
                                  <span>{budget.used} used</span>
                                  <span>{budget.remain} remaining</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* savings tab */}
        {activeTab === "Savings Goals" && (
          <div className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4">
            <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] ">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  Savings Goals
                </h3>
                <p className="text-sm text-[var(--sub-heading-text)]">
                  Track progress towards your financial goals
                </p>
              </div>
              <div className="p-6 pt-0">
                <div dir="ltr" className="relative overflow-y-auto h-[400px] custom-scrollbar">
                  <div
                    data-radix-scroll-area-viewport
                    className="w-full rounded-[inherit]"
                  >
                    <div>
                      <div className="space-y-6">
                        {latestFiveGoals.map((goal, id) => {
                          const IconComponent =
                            ICON_COMPONENTS[goal.icon] || PiggyBank;
                          return (
                            <div key={id} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="mr-2 text-lg">
                                    {" "}
                                    <IconComponent />{" "}
                                  </span>
                                  <div>
                                    <div className="font-medium">
                                      {goal.title}
                                    </div>
                                    <div className="text-xs text-[var(--sub-heading-text)]">
                                      Target date: {goal.date}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm text-[var(--heading-text)]">
                                  {goal.amt}
                                </div>
                              </div>
                              {/* progressbar */}
                              <div className="space-y-1">
                                <div className="relative w-full overflow-hidden rounded-full bg-[var(--sub-background-color)] h-2">
                                  <div
                                    className="h-full rounded-full flex-1 bg-[var(--progress-head)] transition-all"
                                    style={{ width: getProgressWidth(goal) }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-[var(--sub-heading-text)]">
                                  <span>{getProgressWidth(goal)} complete</span>
                                  <span>{goal.remain} to go</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions tab */}
        {activeTab === "Transactions" && (
          <div className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-4">
            <div className="rounded-lg border border-[var(--border-color)] bg-[var(--background-color)] text-[var(--heading-text)] shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="text-2xl font-semibold leading-none tracking-tight">
                  All Transactions
                </h3>
                <p className="text-sm text-[var(--sub-heading-text)]">
                  A detailed list of all your transactions
                </p>
              </div>
              <div className="p-6 pt-0">
                <div dir="ltr" className="relative overflow-y-auto h-[400px] custom-scrollbar">
                  <div className="w-full rounded-[inherit]">
                    <div className="">
                      <ul className="space-y-4">
                        {transactions
                          .slice()
                          .reverse()
                          .map((tx) => (
                            <li key={tx.id}>
                              <div className="flex items-center">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium leading-none">
                                    {tx.desc}
                                  </p>
                                  <p className="text-sm text-[var(--sub-heading-text)]">
                                    Dt. {tx.date}
                                  </p>
                                </div>
                                <div className="ml-auto flex flex-col items-end">
                                  <p
                                    className={`text-sm font-medium ${getAmountColor(tx.amt)}`}
                                  >
                                    {tx.amt}
                                  </p>
                                  <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-[var(--sub-background-color)] text-secondary-foreground hover:bg-secondary/80 mt-1">
                                    {tx.cat}
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
