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
