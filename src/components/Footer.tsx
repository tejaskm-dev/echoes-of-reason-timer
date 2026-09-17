import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full px-6 md:px-12 py-1 flex items-center justify-between gap-4 select-none">
      {/* 1. Bottom Left: Quote */}
      <div className="font-serif-display italic text-[#555e6d] text-xs sm:text-[13px] leading-tight">
        “Different perspectives. One stage.”
      </div>

      {/* 2. Bottom Center: Science Club, ASIET flanked with gold lines */}
      <div className="flex items-center gap-3 text-center">
        <div className="h-[0.5px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#c5a059]/70"></div>
        <span className="font-cinzel text-[10px] sm:text-[11px] tracking-[0.25em] font-semibold text-[#504022] uppercase">
          Science Club, ASIET
        </span>
        <div className="h-[0.5px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#c5a059]/70"></div>
      </div>

      {/* 3. Bottom Right: Compact Badge */}
      <div className="font-cinzel text-[10px] tracking-[0.25em] text-[#6a7588] uppercase font-semibold text-right leading-none">
        SCIENCE CLUB ASIET
      </div>
    </footer>
  );
};
