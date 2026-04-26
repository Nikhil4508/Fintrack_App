import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  // Initialize the navigate function from react-router-dom
  // This function allows us to programmatically navigate to different routes
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  // The Hero component renders the main landing page with a header, main content, and footer
  // It includes a navigation bar with links to login and register, a main section with a call to action, and a footer with copyright information
  // The main section also highlights key features of the application such as tracking transactions, budget planning, savings goals, and financial insights
  // The component uses Tailwind CSS classes for styling and layout
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--background-color)]">
        <div className="mx-auto px-6 flex h-14 items-center">
          <div className="mr-4 flex text-[var(--heading-text)]">
            <Link to="/" className="mr-6  flex items-center space-x-2">
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
                className="lucide lucide-dollar-sign-icon lucide-dollar-sign"
              >
                <line x1="12" x2="12" y1="2" y2="22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span className="font-bold ">Fintrack</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <button
                onClick={handleLogin}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm text-[var(--heading-text)] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-[var(--sub-background-color)] h-9 rounded-md px-3 cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm text-[var(--btn-text)]  font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-hover-bg)] h-9 rounded-md px-3 cursor-pointer"
              >
                Register
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-[var(--background-main)]">
        <section className="w-full py-12 md:py-24 lg:py-32np ">
          <div className="mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-2">
                <div className="space-y-2">
                  <div className="text-3xl text-[var(--heading-text)] font-bold tracking-tighter sm:text-5xl">
                    Take control of your finances
                  </div>
                  <p className="max-w-[600px] text-[var(--sub-heading-text)] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed  ">
                    Track your income, expenses, savings goals, and budgets all
                    in one place. Get insights into your spending habits and
                    achieve your financial goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row mt-2 ">
                  <button
                    onClick={handleGetStarted}
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm text-[var(--btn-text)] font-medium transition-colors  disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-hover-bg)] h-11 rounded-md px-8 gap-1.5"
                  >
                    Get Started
                    <ArrowRight />
                  </button>
                  <button
                    onClick={handleLogin}
                    className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--background-color)] text-[var(--heading-text)] hover:bg-[var(--sub-hover)] border border-[var(--sub-background-color)] h-11 rounded-md px-8 gap-1.5"
                  >
                    Login
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2 ">
                  <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 bg-[var(--background-color)] border-[var(--border-color)]">
                    <div className="rounded-full bg-[var(--sub-background-color)] text-[var(--heading-text)] p-2">
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
                        className="lucide lucide-wallet-icon lucide-wallet"
                      >
                        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                      </svg>
                    </div>
                    <h3 className="text-center text-lg text-[var(--heading-text)] font-medium">
                      Track Transactions
                    </h3>
                    <p className="text-center text-sm text-[var(--sub-heading-text)]">
                      Log your income and expenses with detailed categorization
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 bg-[var(--background-color)] border-[var(--border-color)]">
                    <div className="rounded-full bg-[var(--sub-background-color)] text-[var(--heading-text)] p-2">
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
                        className="lucide lucide-chart-spline-icon lucide-chart-spline"
                      >
                        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                        <path d="M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" />
                      </svg>
                    </div>
                    <h3 className="text-center text-lg text-[var(--heading-text)] font-medium">
                      Budget Planning
                    </h3>
                    <p className="text-center text-sm text-[var(--sub-heading-text)] ">
                      Set and monitor budgets for different spending categories
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 bg-[var(--background-color)] border-[var(--border-color)]">
                    <div className="rounded-full bg-[var(--sub-background-color)] text-[var(--heading-text)] p-2">
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
                        className="lucide lucide-piggy-bank-icon lucide-piggy-bank"
                      >
                        <path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z" />
                        <path d="M16 10h.01" />
                        <path d="M2 8v1a2 2 0 0 0 2 2h1" />
                      </svg>
                    </div>
                    <h3 className="text-center text-lg text-[var(--heading-text)] font-medium">
                      Savings Goals
                    </h3>
                    <p className="text-center text-sm text-[var(--sub-heading-text)]">
                      Create and track progress towards your savings targets
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 bg-[var(--background-color)] border-[var(--border-color)]">
                    <div className="rounded-full p-2 bg-[var(--sub-background-color)] text-[var(--heading-text)]">
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
                        className="lucide lucide-dollar-sign-icon lucide-dollar-sign"
                      >
                        <line x1="12" x2="12" y1="2" y2="22" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <h3 className="text-center text-lg text-[var(--heading-text)] font-medium">
                      Financial Insights
                    </h3>
                    <p className="text-center text-sm text-[var(--sub-heading-text)]">
                      Get visual reports on your spending patterns and habits
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0 px-6 bg-[var(--background-color)] border-[var(--border-color)]">
        <div className=" flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-[var(--sub-heading-text)] md:text-left">
            © 2025 FinTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
