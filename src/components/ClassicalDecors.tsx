import React from 'react';

/**
 * High-End 3D Faceted Neoclassical Gold Diamond
 */
export const GoldDiamond: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`inline-block shrink-0 ${className}`}>
    <defs>
      <linearGradient id="diamondGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff7dc" />
        <stop offset="50%" stopColor="#f3dea2" />
        <stop offset="100%" stopColor="#c5a059" />
      </linearGradient>
      <linearGradient id="diamondGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c5a059" />
        <stop offset="50%" stopColor="#966e22" />
        <stop offset="100%" stopColor="#634510" />
      </linearGradient>
    </defs>
    {/* Top-Left Facet */}
    <polygon points="12,2 12,12 2,12" fill="url(#diamondGradLight)" />
    {/* Bottom-Right Facet */}
    <polygon points="12,22 12,12 22,12" fill="url(#diamondGradDark)" />
    {/* Top-Right Facet */}
    <polygon points="12,2 22,12 12,12" fill="#e8c97e" />
    {/* Bottom-Left Facet */}
    <polygon points="12,22 2,12 12,12" fill="#b08a38" />
    {/* Center Specular Glint */}
    <circle cx="12" cy="12" r="1.5" fill="#ffffff" opacity="0.9" />
  </svg>
);

/**
 * Masterpiece Imperial Roman Laurel Wreath with Centered 4-Point Star
 */
export const ImperialLaurelCrown: React.FC<{ className?: string }> = ({ className = "w-28 h-12" }) => (
  <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
    <defs>
      <linearGradient id="laurelLeafGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffbeb" />
        <stop offset="35%" stopColor="#f7e199" />
        <stop offset="70%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#9a711e" />
      </linearGradient>
      <linearGradient id="laurelLeafGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d4af37" />
        <stop offset="50%" stopColor="#a37c28" />
        <stop offset="100%" stopColor="#6d4e13" />
      </linearGradient>
      <radialGradient id="berryGoldGlint" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#f5e09b" />
        <stop offset="100%" stopColor="#b3882a" />
      </radialGradient>
      <filter id="laurelGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#c5a059" floodOpacity="0.35" />
      </filter>
    </defs>

    <g filter="url(#laurelGlow)">
      {/* Left Laurel Branch */}
      <path 
        d="M90 68 C70 65, 42 55, 30 35 C24 25, 25 12, 32 5" 
        stroke="url(#laurelLeafGoldDark)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
      {/* Left Branch Leaves */}
      {/* Leaf 1 */}
      <path d="M32 5 C34 14, 44 18, 48 16 C46 8, 38 4, 32 5 Z" fill="url(#laurelLeafGoldLight)" stroke="#8d6c22" strokeWidth="0.6" />
      <path d="M28 12 C20 18, 22 28, 28 30 C32 24, 32 16, 28 12 Z" fill="url(#laurelLeafGoldDark)" stroke="#8d6c22" strokeWidth="0.6" />
      {/* Leaf 2 */}
      <path d="M40 22 C46 28, 56 28, 58 24 C54 18, 44 18, 40 22 Z" fill="url(#laurelLeafGoldLight)" stroke="#8d6c22" strokeWidth="0.6" />
      <path d="M33 32 C26 38, 30 48, 36 49 C41 43, 39 34, 33 32 Z" fill="url(#laurelLeafGoldDark)" stroke="#8d6c22" strokeWidth="0.6" />
      {/* Leaf 3 */}
      <path d="M48 38 C56 42, 65 40, 66 35 C60 30, 52 32, 48 38 Z" fill="url(#laurelLeafGoldLight)" stroke="#8d6c22" strokeWidth="0.6" />
      <path d="M42 50 C37 57, 44 65, 52 64 C55 58, 50 51, 42 50 Z" fill="url(#laurelLeafGoldDark)" stroke="#8d6c22" strokeWidth="0.6" />
      {/* Leaf 4 */}
      <path d="M60 52 C70 54, 78 50, 77 44 C70 42, 63 45, 60 52 Z" fill="url(#laurelLeafGoldLight)" stroke="#8d6c22" strokeWidth="0.6" />
      <path d="M58 64 C56 70, 66 76, 74 72 C74 66, 68 62, 58 64 Z" fill="url(#laurelLeafGoldDark)" stroke="#8d6c22" strokeWidth="0.6" />
      {/* Berries on Left Branch */}
      <circle cx="36" cy="18" r="2.2" fill="url(#berryGoldGlint)" />
      <circle cx="43" cy="33" r="2.2" fill="url(#berryGoldGlint)" />
      <circle cx="55" cy="46" r="2.2" fill="url(#berryGoldGlint)" />

      {/* Right Laurel Branch (Symmetrical) */}
      <path 
        d="M110 68 C130 65, 158 55, 170 35 C176 25, 175 12, 168 5" 
        stroke="url(#laurelLeafGoldDark)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
      />
      {/* Right Branch Leaves */}
      <path d="M168 5 C166 14, 156 18, 152 16 C154 8, 162 4, 168 5 Z" fill="url(#laurelLeafGoldLight)" stroke="#8d6c22" strokeWidth="0.6" />
      <path d="M172 12 C180 18, 178 28, 172 30 C168 24, 168 16, 172 12 Z" fill="url(#laurelLeafGoldDark)" stroke="#8d6c22" strokeWidth="0.6" />
      <path d="M160 22 C154 28, 144 28, 142 24 C146 18, 156 18, 160 22 Z" fill="url(#laurelLeafGoldLight)" stroke="#8d6c22" strokeWidth="0.6" />
      <path d="M167 32 C174 38, 170 48, 164 49 C159 43, 161 34, 167 32 Z" fill="url(#laurelLeafGoldDark)" stroke="#8d6c22" strokeWidth="0.6" />
      <path d="M152 38 C144 42, 135 40, 134 35 C140 30, 148 32, 152 38 Z" fill="url(#laurelLeafGoldLight)" stroke="#8d6c22" strokeWidth="0.6" />
      <path d="M158 50 C163 57, 156 65, 148 64 C145 58, 150 51, 158 50 Z" fill="url(#laurelLeafGoldDark)" stroke="#8d6c22" strokeWidth="0.6" />
      <path d="M140 52 C130 54, 122 50, 123 44 C130 42, 137 45, 140 52 Z" fill="url(#laurelLeafGoldLight)" stroke="#8d6c22" strokeWidth="0.6" />
      <path d="M142 64 C144 70, 134 76, 126 72 C126 66, 132 62, 142 64 Z" fill="url(#laurelLeafGoldDark)" stroke="#8d6c22" strokeWidth="0.6" />
      {/* Berries on Right Branch */}
      <circle cx="164" cy="18" r="2.2" fill="url(#berryGoldGlint)" />
      <circle cx="157" cy="33" r="2.2" fill="url(#berryGoldGlint)" />
      <circle cx="145" cy="46" r="2.2" fill="url(#berryGoldGlint)" />

      {/* Central Roman Laurel Tie Ribbon Knot */}
      <path d="M96 68 C94 72, 88 77, 85 80 C92 78, 100 76, 105 78 C108 76, 114 78, 115 80 C112 77, 106 72, 104 68 Z" fill="url(#laurelLeafGoldDark)" />
      <circle cx="100" cy="68" r="3.5" fill="url(#berryGoldGlint)" stroke="#745214" strokeWidth="0.8" />

      {/* Central 3D Faceted Celestial Star */}
      <g transform="translate(100, 36)">
        {/* Star Glow */}
        <circle cx="0" cy="0" r="14" fill="#fde68a" opacity="0.3" filter="blur(2px)" />
        {/* Diamond Star Facets */}
        {/* North */}
        <polygon points="0,-16 3,-3 0,0" fill="#fffbeb" />
        <polygon points="0,-16 -3,-3 0,0" fill="#f5df9b" />
        {/* South */}
        <polygon points="0,16 3,3 0,0" fill="#d4af37" />
        <polygon points="0,16 -3,3 0,0" fill="#9e792a" />
        {/* East */}
        <polygon points="16,0 3,3 0,0" fill="#ebd289" />
        <polygon points="16,0 3,-3 0,0" fill="#faecc0" />
        {/* West */}
        <polygon points="-16,0 -3,-3 0,0" fill="#d4af37" />
        <polygon points="-16,0 -3,3 0,0" fill="#8f6a1e" />
        {/* Diagonals */}
        <polygon points="7,-7 2,-1 0,0" fill="#fff" opacity="0.9" />
        <polygon points="-7,-7 -2,-1 0,0" fill="#f5df9b" />
        <polygon points="7,7 2,1 0,0" fill="#b88f32" />
        <polygon points="-7,7 -2,1 0,0" fill="#7a5912" />
        {/* Center Jewel Core */}
        <circle cx="0" cy="0" r="2.2" fill="#ffffff" />
      </g>
    </g>
  </svg>
);

/**
 * Extravagant Neoclassical Baroque Acanthus Pediment Arch
 */
export const BaroqueAcanthusPediment: React.FC<{ 
  teamType?: 'proposition' | 'opposition';
  className?: string;
}> = ({ teamType = 'proposition', className = "w-full" }) => {
  const isProp = teamType === 'proposition';
  const ribbonBg = isProp ? 'url(#propRibbonGrad)' : 'url(#oppRibbonGrad)';
  const ribbonBorder = isProp ? '#60a5fa' : '#fb7185';

  return (
    <svg viewBox="0 0 400 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-full overflow-visible ${className}`}>
      <defs>
        <linearGradient id="pedimentGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8d6928" />
          <stop offset="15%" stopColor="#d4af37" />
          <stop offset="35%" stopColor="#fff2c2" />
          <stop offset="50%" stopColor="#fae192" />
          <stop offset="65%" stopColor="#fff2c2" />
          <stop offset="85%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8d6928" />
        </linearGradient>

        <linearGradient id="propRibbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3250" />
          <stop offset="50%" stopColor="#0f1f38" />
          <stop offset="100%" stopColor="#081224" />
        </linearGradient>

        <linearGradient id="oppRibbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#481422" />
          <stop offset="50%" stopColor="#320b16" />
          <stop offset="100%" stopColor="#1e050c" />
        </linearGradient>

        <filter id="pedimentShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1a1408" floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter="url(#pedimentShadow)">
        {/* 1. Classical Triangular Gable / Arched Cornice */}
        <path 
          d="M10 82 C80 50, 150 25, 200 12 C250 25, 320 50, 390 82 L380 88 C310 58, 245 34, 200 22 C155 34, 90 58, 20 88 Z" 
          fill="url(#pedimentGold)" 
        />
        <path 
          d="M20 78 C90 48, 155 24, 200 14 C245 24, 310 48, 380 78" 
          stroke="#ffffff" 
          strokeWidth="1.2" 
          strokeOpacity="0.8" 
        />

        {/* 2. Left Acanthus Volute / Cornice Scroll */}
        <path 
          d="M15 84 C8 84, 0 78, 2 70 C4 60, 16 58, 24 64 C30 70, 26 80, 18 80 C14 80, 12 76, 14 72" 
          stroke="url(#pedimentGold)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        <path d="M8 72 C12 66, 20 66, 22 72" fill="url(#pedimentGold)" opacity="0.85" />

        {/* 3. Right Acanthus Volute / Cornice Scroll */}
        <path 
          d="M385 84 C392 84, 400 78, 398 70 C396 60, 384 58, 376 64 C370 70, 374 80, 382 80 C386 80, 388 76, 386 72" 
          stroke="url(#pedimentGold)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
        <path d="M392 72 C388 66, 380 66, 378 72" fill="url(#pedimentGold)" opacity="0.85" />

        {/* 4. Central Imperial Crest Ribbon */}
        <path 
          d="M100 48 L300 48 C310 48, 316 54, 312 62 L304 80 C302 84, 296 86, 290 86 L110 86 C104 86, 98 84, 96 80 L88 62 C84 54, 90 48, 100 48 Z" 
          fill={ribbonBg} 
          stroke="url(#pedimentGold)" 
          strokeWidth="1.8" 
        />
        {/* Inner Gold Hairline on Ribbon */}
        <path 
          d="M104 52 L296 52 C302 52, 306 56, 303 62 L297 76 C295 80, 291 82, 286 82 L114 82 C109 82, 105 80, 103 76 L97 62 C94 56, 98 52, 104 52 Z" 
          stroke={ribbonBorder} 
          strokeWidth="0.8" 
          strokeOpacity="0.65" 
        />

        {/* 5. Center Imperial Star Jewel atop the Pediment */}
        <g transform="translate(200, 12)">
          <circle cx="0" cy="0" r="16" fill="url(#pedimentGold)" opacity="0.25" filter="blur(3px)" />
          {/* 4-Point Star Crown */}
          <polygon points="0,-14 3,-3 14,0 3,3 0,14 -3,3 -14,0 -3,-3" fill="url(#pedimentGold)" stroke="#745214" strokeWidth="0.8" />
          <polygon points="0,-14 0,0 14,0" fill="#ffffff" opacity="0.6" />
          <polygon points="0,14 0,0 -14,0" fill="#583d0c" opacity="0.5" />
          <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
        </g>
      </g>
    </svg>
  );
};

/**
 * Imperial Filigree Corner Ornament (Acanthus Leaves & Rococo Scrolls)
 */
export const FiligreeCornerOrnament: React.FC<{ 
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}> = ({ position = 'top-left', className = "w-10 h-10" }) => {
  let transform = "";
  if (position === 'top-right') transform = "scale(-1, 1)";
  if (position === 'bottom-left') transform = "scale(1, -1)";
  if (position === 'bottom-right') transform = "scale(-1, -1)";

  return (
    <svg 
      viewBox="0 0 60 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 pointer-events-none select-none ${className}`}
      style={{ transform, transformOrigin: 'center center' }}
    >
      <defs>
        <linearGradient id="filigreeGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff2c2" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8d6928" />
        </linearGradient>
      </defs>
      {/* Outer L-Frame Border */}
      <path d="M4 56 L4 8 C4 5.8, 5.8 4, 8 4 L56 4" stroke="url(#filigreeGold)" strokeWidth="1.6" strokeLinecap="round" />
      {/* Inner Accent Line */}
      <path d="M10 50 L10 12 C10 10.9, 10.9 10, 12 10 L50 10" stroke="url(#filigreeGold)" strokeWidth="0.8" strokeOpacity="0.75" />
      {/* Acanthus Leaf Scroll */}
      <path 
        d="M6 6 C12 6, 20 10, 24 18 C28 26, 24 34, 16 34 C10 34, 6 28, 8 22 C10 16, 16 16, 18 20" 
        stroke="url(#filigreeGold)" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
      />
      <path d="M16 16 C22 14, 30 18, 34 26 C36 30, 36 36, 32 38" stroke="url(#filigreeGold)" strokeWidth="1.2" strokeLinecap="round" />
      {/* Rosette Stud */}
      <circle cx="10" cy="10" r="3" fill="url(#filigreeGold)" stroke="#6b4c12" strokeWidth="0.6" />
      <circle cx="10" cy="10" r="1" fill="#ffffff" />
    </svg>
  );
};

/**
 * Imperial Brass POI Medallion Emblem
 */
export const POIMedallionEmblem: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 ${className}`}>
    <defs>
      <radialGradient id="poiMedallionGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fff8e1" />
        <stop offset="40%" stopColor="#f5df9b" />
        <stop offset="75%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#7a5513" />
      </radialGradient>
    </defs>
    <circle cx="16" cy="16" r="15" fill="url(#poiMedallionGrad)" stroke="#c5a059" strokeWidth="1.5" />
    <circle cx="16" cy="16" r="12" fill="none" stroke="#68470c" strokeWidth="1" strokeDasharray="1.5 2" />
    {/* Roman Laurel Accent inside Seal */}
    <path d="M9 16 C9 12, 12 9, 16 9 C20 9, 23 12, 23 16" stroke="#4a3207" strokeWidth="1.2" strokeLinecap="round" />
    {/* Raised Hand of Interjection */}
    <path 
      d="M14 11 C14 10.4, 14.4 10, 15 10 C15.6 10, 16 10.4, 16 11 L16 15 L17 13 C17.3 12.5, 17.9 12.3, 18.4 12.6 C18.8 12.9, 19 13.4, 18.9 13.9 L18 17 C17.6 18.5, 16.3 19.5, 14.7 19.5 L13 19.5 C11.9 19.5, 11 18.6, 11 17.5 L11 14 C11 13.4, 11.4 13, 12 13 C12.6 13, 13 13.4, 13 14 L13 15" 
      fill="#4a3207" 
    />
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
    <path d="M30 40 C30 25, 55 20, 70 30 C85 40, 75 60, 55 60 C40 60, 30 50, 30 40" stroke="currentColor" strokeWidth="2.5" />
    <path d="M170 40 C170 25, 145 20, 130 30 C115 40, 125 60, 145 60 C160 60, 170 50, 170 40" stroke="currentColor" strokeWidth="2.5" />
    <path d="M40 30 L160 30" stroke="currentColor" strokeWidth="3" />
    <path d="M35 45 L165 45" stroke="currentColor" strokeWidth="2" />
    <path d="M50 60 L150 60" stroke="currentColor" strokeWidth="2.5" />
    <line x1="60" y1="65" x2="60" y2="260" stroke="currentColor" strokeWidth="2" />
    <line x1="75" y1="65" x2="75" y2="260" stroke="currentColor" strokeWidth="2" />
    <line x1="90" y1="65" x2="90" y2="260" stroke="currentColor" strokeWidth="2" />
    <line x1="100" y1="65" x2="100" y2="260" stroke="currentColor" strokeWidth="2.5" />
    <line x1="110" y1="65" x2="110" y2="260" stroke="currentColor" strokeWidth="2" />
    <line x1="125" y1="65" x2="125" y2="260" stroke="currentColor" strokeWidth="2" />
    <line x1="140" y1="65" x2="140" y2="260" stroke="currentColor" strokeWidth="2" />
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
    <path 
      d="M150 50 C120 50, 100 80, 100 110 C100 135, 110 150, 115 170 C100 185, 80 210, 70 240 C60 270, 65 310, 70 350 L230 350 C235 310, 240 270, 230 240 C220 210, 200 185, 185 170 C190 150, 200 135, 200 110 C200 80, 180 50, 150 50 Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
    />
  </svg>
);

/**
 * Masterpiece Symmetrical Dual Laurel Base for Central Chronometer
 * Wraps gracefully around the bottom circumference of the circular dial
 */
export const ChronometerLaurelBase: React.FC<{ className?: string }> = ({ className = "w-[380px] h-[95px]" }) => (
  <svg viewBox="0 0 500 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 pointer-events-none select-none ${className}`}>
    <defs>
      <linearGradient id="chronoLaurelGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fffdf0" />
        <stop offset="25%" stopColor="#f7e199" />
        <stop offset="60%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#8d681c" />
      </linearGradient>
      <linearGradient id="chronoLaurelGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d4af37" />
        <stop offset="50%" stopColor="#9a7322" />
        <stop offset="100%" stopColor="#5e420d" />
      </linearGradient>
      <radialGradient id="chronoBerryGold" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#fae5a2" />
        <stop offset="85%" stopColor="#b38728" />
        <stop offset="100%" stopColor="#68470a" />
      </radialGradient>
      <filter id="chronoLaurelGlow" x="-10%" y="-15%" width="120%" height="135%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1a1408" floodOpacity="0.22" />
      </filter>
    </defs>
    <g filter="url(#chronoLaurelGlow)">
      {/* Left Laurel Branch sweeping up around the circular dial */}
      <path 
        d="M240 92 C200 92, 140 82, 90 54 C58 36, 32 12, 20 -10" 
        stroke="url(#chronoLaurelGoldDark)" 
        strokeWidth="3.2" 
        strokeLinecap="round" 
      />
      {/* Left Laurel Leaves */}
      <path d="M220 86 C210 74, 192 78, 185 86 C198 94, 214 94, 220 86 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M190 80 C182 66, 162 70, 154 78 C168 87, 184 86, 190 80 Z" fill="url(#chronoLaurelGoldDark)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M158 68 C152 52, 130 56, 122 65 C136 74, 152 74, 158 68 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M126 54 C120 38, 98 42, 90 51 C104 60, 120 60, 126 54 Z" fill="url(#chronoLaurelGoldDark)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M96 40 C90 24, 68 28, 60 37 C74 46, 90 46, 96 40 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M68 26 C62 10, 40 14, 32 23 C46 32, 62 32, 68 26 Z" fill="url(#chronoLaurelGoldDark)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M42 12 C36 -4, 16 0, 10 9 C22 18, 38 18, 42 12 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.8" />
      {/* Outer Counter-Leaves */}
      <path d="M200 96 C195 106, 180 110, 172 104 C175 94, 190 90, 200 96 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.6" />
      <path d="M165 90 C158 100, 142 103, 135 96 C139 87, 155 83, 165 90 Z" fill="url(#chronoLaurelGoldDark)" stroke="#7e5d18" strokeWidth="0.6" />
      <path d="M130 78 C122 88, 106 90, 100 82 C105 73, 120 70, 130 78 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.6" />
      <path d="M98 64 C90 73, 74 74, 68 66 C74 58, 88 56, 98 64 Z" fill="url(#chronoLaurelGoldDark)" stroke="#7e5d18" strokeWidth="0.6" />
      {/* Berries on Left Branch */}
      <circle cx="210" cy="80" r="2.8" fill="url(#chronoBerryGold)" />
      <circle cx="178" cy="72" r="2.8" fill="url(#chronoBerryGold)" />
      <circle cx="144" cy="58" r="2.8" fill="url(#chronoBerryGold)" />
      <circle cx="112" cy="44" r="2.8" fill="url(#chronoBerryGold)" />
      <circle cx="80" cy="30" r="2.8" fill="url(#chronoBerryGold)" />
      <circle cx="50" cy="16" r="2.8" fill="url(#chronoBerryGold)" />

      {/* Right Laurel Branch (Mirrored) */}
      <path 
        d="M260 92 C300 92, 360 82, 410 54 C442 36, 468 12, 480 -10" 
        stroke="url(#chronoLaurelGoldDark)" 
        strokeWidth="3.2" 
        strokeLinecap="round" 
      />
      {/* Right Laurel Leaves */}
      <path d="M280 86 C290 74, 308 78, 315 86 C302 94, 286 94, 280 86 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M310 80 C318 66, 338 70, 346 78 C332 87, 316 86, 310 80 Z" fill="url(#chronoLaurelGoldDark)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M342 68 C348 52, 370 56, 378 65 C364 74, 348 74, 342 68 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M374 54 C380 38, 402 42, 410 51 C396 60, 380 60, 374 54 Z" fill="url(#chronoLaurelGoldDark)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M404 40 C410 24, 432 28, 440 37 C426 46, 410 46, 404 40 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M432 26 C438 10, 460 14, 468 23 C454 32, 438 32, 432 26 Z" fill="url(#chronoLaurelGoldDark)" stroke="#7e5d18" strokeWidth="0.8" />
      <path d="M458 12 C464 -4, 484 0, 490 9 C478 18, 462 18, 458 12 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.8" />
      {/* Outer Counter-Leaves */}
      <path d="M300 96 C305 106, 320 110, 328 104 C325 94, 310 90, 300 96 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.6" />
      <path d="M335 90 C342 100, 358 103, 365 96 C361 87, 345 83, 335 90 Z" fill="url(#chronoLaurelGoldDark)" stroke="#7e5d18" strokeWidth="0.6" />
      <path d="M370 78 C378 88, 394 90, 400 82 C395 73, 380 70, 370 78 Z" fill="url(#chronoLaurelGoldLight)" stroke="#7e5d18" strokeWidth="0.6" />
      <path d="M402 64 C410 73, 426 74, 432 66 C426 58, 412 56, 402 64 Z" fill="url(#chronoLaurelGoldDark)" stroke="#7e5d18" strokeWidth="0.6" />
      {/* Berries on Right Branch */}
      <circle cx="290" cy="80" r="2.8" fill="url(#chronoBerryGold)" />
      <circle cx="322" cy="72" r="2.8" fill="url(#chronoBerryGold)" />
      <circle cx="356" cy="58" r="2.8" fill="url(#chronoBerryGold)" />
      <circle cx="388" cy="44" r="2.8" fill="url(#chronoBerryGold)" />
      <circle cx="420" cy="30" r="2.8" fill="url(#chronoBerryGold)" />
      <circle cx="450" cy="16" r="2.8" fill="url(#chronoBerryGold)" />

      {/* Central Tie Ribbon Knot & Medallion Rosette */}
      <path 
        d="M236 90 C226 95, 215 105, 210 114 C222 110, 235 106, 244 104 C247 108, 253 108, 256 104 C265 106, 278 110, 290 114 C285 105, 274 95, 264 90 Z" 
        fill="url(#chronoLaurelGoldDark)" 
        stroke="#5e420d" 
        strokeWidth="0.8" 
      />
      {/* Rosette Center Jewel */}
      <circle cx="250" cy="92" r="7" fill="url(#chronoLaurelGoldLight)" stroke="#68470a" strokeWidth="1.2" />
      <polygon points="250,86 252,90 256,92 252,94 250,98 248,94 244,92 248,90" fill="#ffffff" />
      <circle cx="250" cy="92" r="2" fill="#fffdf0" />
    </g>
  </svg>
);

/**
 * Grand Neoclassical Motion Cartouche Plaque
 * Surrounds the debate motion in a carved gilded temple plaque
 */
export const NeoclassicalMotionCartouche: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`relative group cursor-pointer w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all duration-300 ${className}`}
  >
    {/* Background Sculpted Marble Plaque with Gold Inset */}
    <div className="absolute inset-0 bg-[#fefdfa]/92 backdrop-blur-md rounded-2xl sm:rounded-3xl border-2 border-[#c5a059]/60 shadow-[0_16px_40px_-12px_rgba(25,20,12,0.18),0_0_0_1px_rgba(255,255,255,0.9)_inset] group-hover:border-[#c5a059] group-hover:shadow-[0_20px_50px_-10px_rgba(197,160,89,0.32),0_0_0_1px_rgba(255,255,255,0.95)_inset] transition-all duration-300" />
    
    {/* Inner Gilded Hairline Inset */}
    <div className="absolute inset-1.5 sm:inset-2.5 rounded-xl sm:rounded-2xl border border-[#c5a059]/30 pointer-events-none" />

    {/* Classical Corner Flourishes */}
    <FiligreeCornerOrnament position="top-left" className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 opacity-75 group-hover:opacity-100 transition-opacity" />
    <FiligreeCornerOrnament position="top-right" className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 opacity-75 group-hover:opacity-100 transition-opacity" />
    <FiligreeCornerOrnament position="bottom-left" className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 w-6 h-6 sm:w-8 sm:h-8 opacity-75 group-hover:opacity-100 transition-opacity" />
    <FiligreeCornerOrnament position="bottom-right" className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-6 h-6 sm:w-8 sm:h-8 opacity-75 group-hover:opacity-100 transition-opacity" />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center">
      {children}
    </div>
  </div>
);

/**
 * Classical Fluted Corinthian Pilaster Column Capital
 * Applied to the flanking edges of the Extravagant Podium for architectural dignity
 */
export const CorinthianCapitalPilaster: React.FC<{ 
  side?: 'left' | 'right';
  className?: string;
}> = ({ side = 'left', className = "w-4 h-full" }) => {
  const isRight = side === 'right';
  return (
    <svg 
      viewBox="0 0 32 300" 
      preserveAspectRatio="none"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 pointer-events-none select-none ${className}`}
      style={{ transform: isRight ? 'scaleX(-1)' : undefined }}
    >
      <defs>
        <linearGradient id="pilasterGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff6d6" />
          <stop offset="35%" stopColor="#f3dd9e" />
          <stop offset="70%" stopColor="#c5a059" />
          <stop offset="100%" stopColor="#7e5d1d" />
        </linearGradient>
        <linearGradient id="pilasterFlute" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ded5c4" />
          <stop offset="30%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#ded5c4" />
          <stop offset="100%" stopColor="#b6a892" />
        </linearGradient>
      </defs>
      {/* Abacus Top Slab */}
      <rect x="2" y="2" width="28" height="6" rx="1.5" fill="url(#pilasterGold)" stroke="#68470a" strokeWidth="0.8" />
      {/* Corinthian Volute Scroll */}
      <path 
        d="M6 8 C2 8, 0 14, 4 18 C8 22, 16 18, 14 12 C12 8, 8 10, 8 12" 
        stroke="url(#pilasterGold)" 
        strokeWidth="1.6" 
        strokeLinecap="round" 
      />
      {/* Acanthus Leaf Fan on Capital */}
      <path d="M12 10 C14 16, 20 20, 26 14 C22 10, 16 8, 12 10 Z" fill="url(#pilasterGold)" />
      <path d="M16 16 C18 22, 24 24, 28 20 C24 16, 20 15, 16 16 Z" fill="url(#pilasterGold)" opacity="0.85" />
      {/* Astragal Ring Bead */}
      <rect x="4" y="26" width="24" height="4" rx="2" fill="url(#pilasterGold)" stroke="#68470a" strokeWidth="0.6" />
      {/* Fluted Vertical Shaft Lines */}
      <rect x="5" y="32" width="22" height="250" fill="url(#pilasterFlute)" opacity="0.4" />
      <line x1="8" y1="32" x2="8" y2="282" stroke="url(#pilasterGold)" strokeWidth="1" opacity="0.7" />
      <line x1="14" y1="32" x2="14" y2="282" stroke="url(#pilasterGold)" strokeWidth="1.2" opacity="0.8" />
      <line x1="18" y1="32" x2="18" y2="282" stroke="url(#pilasterGold)" strokeWidth="1.2" opacity="0.8" />
      <line x1="24" y1="32" x2="24" y2="282" stroke="url(#pilasterGold)" strokeWidth="1" opacity="0.7" />
      {/* Base Torus Ring & Plinth */}
      <rect x="4" y="284" width="24" height="5" rx="2" fill="url(#pilasterGold)" stroke="#68470a" strokeWidth="0.6" />
      <rect x="2" y="290" width="28" height="8" rx="1.5" fill="url(#pilasterGold)" stroke="#68470a" strokeWidth="0.8" />
    </svg>
  );
};

/**
 * Official Imperial Debate Seal Medallion
 * Championship wax/gilded stamp with Classical Scales of Justice & Torch of Reason
 */
export const ImperialDebateSeal: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`shrink-0 select-none ${className}`}>
    <defs>
      <radialGradient id="sealGoldGrad" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fffdf0" />
        <stop offset="25%" stopColor="#fce4a6" />
        <stop offset="60%" stopColor="#d4af37" />
        <stop offset="90%" stopColor="#8d681c" />
        <stop offset="100%" stopColor="#533a0b" />
      </radialGradient>
      <linearGradient id="sealRimBevel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff7db" />
        <stop offset="50%" stopColor="#c5a059" />
        <stop offset="100%" stopColor="#68470a" />
      </linearGradient>
      <filter id="sealShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1a1408" floodOpacity="0.25" />
      </filter>
    </defs>
    <g filter="url(#sealShadow)">
      {/* Outer Coin Edge Rim */}
      <circle cx="50" cy="50" r="47" fill="url(#sealRimBevel)" />
      <circle cx="50" cy="50" r="44" fill="url(#sealGoldGrad)" stroke="#583d0c" strokeWidth="0.8" />
      
      {/* Beaded Granulation Ring */}
      <circle cx="50" cy="50" r="41" fill="none" stroke="#755212" strokeWidth="1.2" strokeDasharray="1.5 2.5" />
      
      {/* Inner Concentric Hairline Ring */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="#68470a" strokeWidth="0.7" />

      {/* Classical Scales of Justice & Torch Iconography */}
      {/* Vertical Torch Handle */}
      <path d="M48 24 L52 24 L51 68 L49 68 Z" fill="#4d3408" />
      {/* Flame of Reason */}
      <path d="M50 14 C54 18, 55 22, 50 25 C45 22, 46 18, 50 14 Z" fill="#ffffff" stroke="#755212" strokeWidth="0.6" />
      {/* Horizontal Balance Beam */}
      <line x1="28" y1="36" x2="72" y2="36" stroke="#4d3408" strokeWidth="2" strokeLinecap="round" />
      {/* Central Fulcrum Diamond */}
      <polygon points="50,32 53,36 50,40 47,36" fill="#fff" stroke="#4d3408" strokeWidth="0.8" />
      {/* Left Pan Chains & Pan */}
      <line x1="30" y1="36" x2="25" y2="48" stroke="#4d3408" strokeWidth="1" />
      <line x1="30" y1="36" x2="35" y2="48" stroke="#4d3408" strokeWidth="1" />
      <path d="M22 48 C25 54, 35 54, 38 48 Z" fill="#4d3408" />
      {/* Right Pan Chains & Pan */}
      <line x1="70" y1="36" x2="65" y2="48" stroke="#4d3408" strokeWidth="1" />
      <line x1="70" y1="36" x2="75" y2="48" stroke="#4d3408" strokeWidth="1" />
      <path d="M62 48 C65 54, 75 54, 78 48 Z" fill="#4d3408" />

      {/* Lower Laurel Sprigs within Seal */}
      <path d="M30 68 C38 78, 62 78, 70 68" stroke="#4d3408" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="50" cy="74" r="2.2" fill="#fff" stroke="#4d3408" strokeWidth="0.8" />

      {/* Official Roman Inscription Tag */}
      <text 
        x="50" 
        y="86" 
        textAnchor="middle" 
        fontFamily="'Cinzel', Georgia, serif" 
        fontSize="5.5" 
        fontWeight="bold" 
        letterSpacing="0.18em" 
        fill="#3d2805"
      >
        ECHOES OF REASON
      </text>
    </g>
  </svg>
);
