import React, { useEffect } from "react";

const TransactionDetailModal = ({ transaction, onClose }) => {

   // Prevent background scroll when modal is open
  useEffect(() => {
    // Save original overflow
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!transaction) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/80"></div>
      {/* Modal */}
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[var(--border-color)] bg-[var(--background-color)] p-6 shadow-lg sm:rounded-lg sm:max-w-[425px]">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h1 className="text-lg text-[var(--heading-text)] font-semibold leading-none tracking-tight flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
            Transaction Details
          </h1>
          <p className="text-sm text-[var(--sub-heading-text)]">Complete information about this transaction.</p>
        </div>
        <div className="grid gap-4 py-4">
          <div className="space-y-2 ">
            <div className="text-sm font-medium text-[var(--heading-text)] flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-dollar-sign-icon lucide-dollar-sign h-4 w-4"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Amount
            </div>
            <div className="flex items-center justify-between">
              <div className={`text-base font-semibold pl-6 ${transaction.amt.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                {transaction.amt}
              </div>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-[var(--sub-background-color)] bg-[var(--sub-background-color)] text-[var(--heading-text)] hover:bg-[var(--sub-hover)]">
                Expense
              </div>
            </div>
          </div>
          <div className="shrink-0 bg-[var(--border-color)] h-[1px] w-full mt-1 mb-1"></div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-[var(--sub-heading-text)] flex items-center gap-2 ">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-text-icon lucide-file-text h-4 w-4"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
              Description
            </div>
            <div className="text-base text-[var(--heading-text)] font-normal pl-6">{transaction.desc}</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-[var(--sub-heading-text)] flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-tag-icon lucide-tag h-4 w-4"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>  
              Category
            </div>
            <div className="text-base font-normal pl-6">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-[var(--sub-background-color)]  text-[var(--heading-text)]">
                {transaction.cat}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-[var(--sub-heading-text)] flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-calendar-icon lucide-calendar h-4 w-4"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
              Transaction Date
            </div>
            <div className="text-base text-[var(--heading-text)] font-normal pl-6">{transaction.date}</div>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-[var(--sub-background-color)] bg-background hover:bg-[var(--btn-sub-hover)] h-10 px-4 py-2 cursor-pointer text-[var(--heading-text)]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--heading-text)] rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x w-5 h-5">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default TransactionDetailModal;