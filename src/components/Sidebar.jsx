import { NavLink } from "react-router-dom";
import {
  House,
  CreditCard,
  ChartLine,
  PiggyBank,
  Repeat,
  Settings,
} from "lucide-react";

const navlinks = [
  { id: 1, name: "Overview", icon: House, href: "/dashboard" },
  { id: 2, name: "Transactions", icon: CreditCard, href: "/transactions" },
  { id: 3, name: "Budgets", icon: ChartLine, href: "/budgets" },
  { id: 4, name: "Savings Goals", icon: PiggyBank, href: "/savingsgoals" },
  { id: 5, name: "Setting", icon: Settings, href: "/settings" },
];

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar - hidden on mobile */}
      <aside className="hidden md:flex group h-full w-16 flex-col items-center border-r border-[var(--border-color)] bg-[var(--background-color)] py-4 transition-all duration-300 hover:w-64 md:w-64">
        <div className="flex flex-1 flex-col gap-2 px-2 py-4 w-full ">
          {navlinks.map((items) => {
            const Icon = items.icon;
            return (
              <NavLink
                key={items.id}
                to={items.href}
                style={({ isActive }) => ({
                  background: isActive ? "var(--nav-bg-active)" : "",
                  color: isActive ? "var(--nav-text-active)" : "",
                })}
                className="flex h-10 items-center rounded-md px-3 text-sm text-[var(--heading-text)] font-medium transition-colors hover:bg-[var(--sub-background-color)]"
              >
                <Icon className="mr-2 h-5 w-5" />
                <span className="hidden group-hover:inline-block md:inline-block">
                  {items.name}
                </span>
              </NavLink>
            );
          })}
        </div>
      </aside>

      {/* Mobile Menu Dropdown - slides from top */}
      <div
        className={`md:hidden fixed top-14 left-0 right-0 bg-[var(--background-color)] border-b border-[var(--border-color)] shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isMobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navlinks.map((items) => {
            const Icon = items.icon;
            return (
              <NavLink
                key={items.id}
                to={items.href}
                onClick={handleLinkClick}
                style={({ isActive }) => ({
                  background: isActive ? "var(--nav-bg-active)" : "",
                  color: isActive ? "var(--nav-text-active)" : "",
                })}
                className="flex h-12 items-center rounded-md px-4 text-base text-[var(--heading-text)] font-medium transition-colors hover:bg-[var(--sub-background-color)]"
              >
                <Icon className="mr-3 h-5 w-5" />
                <span>{items.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30 top-14"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
