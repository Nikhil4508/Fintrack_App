import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-[var(--border-color)] py-6 md:py-0 px-6 bg-[var(--background-color)]">
      <div className=" flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center  text-sm leading-loose text-[var(--sub-heading-text)] md:text-left dark:text-gray-400">
          © 2025 FinTrack. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer