import React, { useRef, useState,useEffect } from 'react'
import { ShoppingCart, Fuel, Zap, UtensilsCrossed, GraduationCap, Ambulance, ShoppingBag, Clapperboard, Car, Plane, House,Shield,Package ,TabletSmartphone} from 'lucide-react';

const budgetcategories = [
  "Groceries", "Dining", "Transportation", "Utilities", "Entertainment", "Shopping", "Health", "Housing", "Travel", "Education", "Insurance", "Subscriptions", "Other"
];

const categoryIcons = {
  "Groceries": <ShoppingCart />,
  "Dining": <UtensilsCrossed />,
  "Transportation": <Car />,
  "Utilities": <Zap />,
  "Entertainment": <Clapperboard />,
  "Shopping": <ShoppingBag />,
  "Health": <Ambulance />,
  "Housing": <House />,
  "Travel": <Plane />,
  "Education": <GraduationCap />,
  "Insurance": <Shield />,
  "Subscriptions": <TabletSmartphone />,
  "Fuel":<Fuel/>,
  "Other": <Package />
};

const periodCategories = ["Weekly","Monthly","Yearly"];

const Budgetmodal = ({onClose,addCategoryBudget}) => {

  const [selectedBudgetCategory,setSelectedBudgetCategory] = useState("");
  const [dropdownOpen,setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedPeriodCategory,setSelectedPeriodCategory] = useState("Monthly");
  const [periodDropDownOpen,setPeriodDropDownOpen] = useState(false);
  const periodRef = useRef(null);
  const [amount,setAmount] = useState("");

   // Prevent background scroll when modal is open
  useEffect(() => {
    // Save original overflow
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  useEffect(() => {
      function handleClickOutside(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
        if (periodRef.current && !periodRef.current.contains(event.target)) {
          setPeriodDropDownOpen(false);
        }
      }
      if (dropdownOpen || periodDropDownOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropdownOpen,periodDropDownOpen]);

    const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBudgetCategory || !amount) return;
    addCategoryBudget({
      title: selectedBudgetCategory,
      amount: parseFloat(amount).toFixed(2),
      period: selectedPeriodCategory,
    });
  };


  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80"></div>
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-color)] bg-[var(--background-color)] p-6 shadow-lg  sm:rounded-lg sm:max-w-[425px]">
        <form onSubmit={handleSubmit} >
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <h1 className="text-lg text-[var(--heading-text)] font-semibold leading-none tracking-tight">
              Create Budget
            </h1>
            <p className="text-sm text-[var(--sub-heading-text)]">Set a budget for a specific category.</p>
          </div>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="category" className='text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 '>
                Category *
              </label>
              <div className="relative" ref={dropdownRef}>
                <button id='category' type='button' className="flex h-10 w-full items-center justify-between rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm ring-offset-[var(--background-color)] placeholder:text-[var(--sub-heading-text)] focus:outline-none focus:ring-2 focus:ring-[var(--sub-background-color)] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-2"
                onClick={() => setDropdownOpen((open) => !open) }
                >
                  <span className="flex items-center text-[var(--heading-text)] ">
                    {selectedBudgetCategory && <span className="inline-block mr-2 align-middle ">{categoryIcons[selectedBudgetCategory]}</span>}
                    {selectedBudgetCategory || "Select Category"}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down h-4 w-4 opacity-50"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {dropdownOpen && (
                  <ul className='absolute z-10 mt-1 w-full bg-[var(--background-color)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-y-scroll  [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded '>
                    {budgetcategories.map((cat)=> (
                      <li key={cat} className={`px-4 py-2 cursor-pointer flex text-sm text-[var(--heading-text)] items-center hover:bg-[var(--sub-hover)] ${selectedBudgetCategory === cat ? 'bg-[var(--sub-hover)] font-semibold' : ''}`}
                      onClick={()=>{
                        setSelectedBudgetCategory(cat);
                        setDropdownOpen(false);
                      }}
                      >
                        <span className="inline-block mr-2">{categoryIcons[cat]}</span>
                        {cat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="amount" className='text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 '>
                Budget Amount *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--sub-heading-text)]">$</span>
                <input type="number" className='flex h-10 w-full rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-[var(--sub-background-color)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[var(--sub-heading-text)] focus-visible:outline-none focus-visible:ring-1  focus-visible:ring-[var(--sub-background-color)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-7 mt-2' placeholder='0.00' required
                value={amount}
                onChange={e =>setAmount(e.target.value)}
                min="0"
                step="0.01"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="period" className='text-sm text-[var(--heading-text)] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' >Budget Period</label>
              <div className="relative" ref={periodRef}>
                <button id='period' type='button' className='flex h-10 w-full items-center justify-between rounded-md border border-[var(--border-color)] bg-[var(--background-color)] px-3 py-2 text-sm text-[var(--heading-text)] ring-offset-[var(--sub-background-color)] placeholder:text-[var(--sub-heading-text)] focus:outline-none focus:ring-1 focus:ring-[var(--sub-background-color)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 mt-2'
                onClick={()=> setPeriodDropDownOpen((open)=> !open)}
                >
                  <span >
                    {selectedPeriodCategory || "Monthly"}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down h-4 w-4 opacity-50"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {periodDropDownOpen && (
                  <ul className="absolute z-10 mt-1 w-full bg-[var(--background-color)] border border-[var(--border-color)] rounded-md shadow-lg max-h-60 overflow-auto">
                    {periodCategories.map((cat)=> (
                      <li key={cat} className={`px-4 py-2 cursor-pointer flex text-sm items-center text-[var(--heading-text)] hover:bg-[var(--sub-hover)] ${selectedPeriodCategory === cat ? 'bg-[var(--sub-hover)] font-semibold' : ''}`}
                      onClick={()=>{
                        setSelectedPeriodCategory(cat);
                        setPeriodDropDownOpen(false);
                      }}
                      >
                        <span className="inline-block mr-2">{categoryIcons[cat]}</span>
                        {cat}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <button 
              type='button' 
              className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm text-[var(--heading-text)] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--border-color)] bg-[var(--background-color)] hover:bg-[var(--sub-hover)] hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer'
              onClick={onClose}
            >
              cancel
            </button>
          <button 
            type='submit' 
            className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-[var(--btn-primary-bg)] text-[var(--btn-text)] hover:bg-[var(--btn-hover-bg)] h-10 px-4 py-2 cursor-pointer'
          >
            Create Budget
          </button>
          </div>
        </form>
        <button onClick={onClose } className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x-icon lucide-x w-5 h-5 text-[var(--heading-text)]
          "><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      </div>
    </>
  )
}

export default Budgetmodal