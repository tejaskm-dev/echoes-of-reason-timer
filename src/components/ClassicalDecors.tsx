import React from 'react';

export const GoldDiamond: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={`text-[#c5a059] inline-block ${className}`}>
    <path d="M12 2L22 12L12 22L2 12Z" />
    <path d="M12 6L18 12L12 18L6 12Z" fill="#ede6db" fillOpacity="0.4" />
  </svg>
);

export const ClassicalPillarWatermark: React.FC<{ className?: string; opacity?: number }> = ({ 
  className = "w-48 h-48", 
  opacity = 0.08 
}) => (
  <svg 
    viewBox="0 0 200 300" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`pointer-events-none select-none ${className}`}
    style={{ opacity }}
  >
    {/* Capital Volutes / Ionic Scroll */}
    <path d="M30 40 C30 25, 55 20, 70 30 C85 40, 75 60, 55 60 C40 60, 30 50, 30 40" stroke="currentColor" strokeWidth="2.5" />
    <path d="M170 40 C170 25, 145 20, 130 30 C115 40, 125 60, 145 60 C160 60, 170 50, 170 40" stroke="currentColor" strokeWidth="2.5" />
    <path d="M40 30 L160 30" stroke="currentColor" strokeWidth="3" />
    <path d="M35 45 L165 45" stroke="currentColor" strokeWidth="2" />
    <path d="M50 60 L150 60" stroke="currentColor" strokeWidth="2.5" />
    
    {/* Column Fluting */}
    <line x1="60" y1="65" x2="60" y2="260" stroke="currentColor" strokeWidth="2" />
    <line x1="75" y1="65" x2="75" y2="260" stroke="currentColor" strokeWidth="2" />
    <line x1="90" y1="65" x2="90" y2="260" stroke="currentColor" strokeWidth="2" />
    <line x1="100" y1="65" x2="100" y2="260" stroke="currentColor" strokeWidth="2.5" />
    <line x1="110" y1="65" x2="110" y2="260" stroke="currentColor" strokeWidth="2" />
    <line x1="125" y1="65" x2="125" y2="260" stroke="currentColor" strokeWidth="2" />
    <line x1="140" y1="65" x2="140" y2="260" stroke="currentColor" strokeWidth="2" />

    {/* Column Base */}
    <path d="M45 260 L155 260" stroke="currentColor" strokeWidth="3" />
    <path d="M35 275 L165 275" stroke="currentColor" strokeWidth="4" />
    <path d="M25 290 L175 290" stroke="currentColor" strokeWidth="5" />
  </svg>
);

export const ClassicalStatueBust: React.FC<{ className?: string; opacity?: number }> = ({
  className = "w-72 h-72",
  opacity = 0.05
}) => (
  <svg 
    viewBox="0 0 300 400" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={`pointer-events-none select-none ${className}`}
    style={{ opacity }}
  >
    {/* Classical Greek bust silhouette contour */}
    <path 
      d="M150 50 C120 50, 100 80, 100 110 C100 135, 110 150, 115 170 C100 185, 80 210, 70 240 C60 270, 65 310, 70 350 L230 350 C235 310, 240 270, 230 240 C220 210, 200 185, 185 170 C190 150, 200 135, 200 110 C200 80, 180 50, 150 50 Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path d="M125 105 C135 100, 145 100, 155 105" stroke="currentColor" strokeWidth="1.5" />
    <path d="M140 120 L135 145 L148 147" stroke="currentColor" strokeWidth="1.5" />
    <path d="M135 160 C145 165, 155 165, 165 160" stroke="currentColor" strokeWidth="1.5" />
    <path d="M90 270 C120 250, 180 250, 210 270" stroke="currentColor" strokeWidth="1.5" />
    <path d="M80 310 C120 290, 180 290, 220 310" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
