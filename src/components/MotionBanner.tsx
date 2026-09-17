import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check, X, Sparkles } from 'lucide-react';
import { GoldDiamond } from './ClassicalDecors';

interface MotionBannerProps {
  motion: string;
  onUpdateMotion: (newMotion: string) => void;
}

const MOTION_PRESETS = [
  'This House Believes That Scientific Truth Outweighs Societal Consensus',
  'This House Would Ban the Development of Autonomous Weapons Systems',
  'This House Believes That Climate Reparations Should Be Mandatory For Developed Nations',
  'This House Would Prohibit Algorithmic Content Recommendation for Minors',
];

export const MotionBanner: React.FC<MotionBannerProps> = ({ motion, onUpdateMotion }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState(motion);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleOpenEdit = () => {
    setInputVal(motion);
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (inputVal.trim()) {
      onUpdateMotion(inputVal.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputVal(motion);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-0.5 sm:my-1 select-none flex flex-col items-center justify-center">
      {/* 1. Compact Classical Heraldic Tag */}
      <div className="flex items-center gap-2.5 opacity-85 mb-0.5">
        <div className="h-[0.5px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#c5a059]" />
        <GoldDiamond className="w-2 h-2 opacity-80" />
        <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] font-extrabold uppercase text-[#886729]">
          THE MOTION BEFORE THE HOUSE
        </span>
        <GoldDiamond className="w-2 h-2 opacity-80" />
        <div className="h-[0.5px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#c5a059]" />
      </div>

      {/* 2. Grand Way-Bigger Motion Display (Tight Vertical Padding) */}
      {isEditing ? (
        <div className="w-full max-w-3xl bg-[#faf7f2]/95 backdrop-blur-md border-2 border-[#c5a059] rounded-2xl p-4 shadow-2xl animate-in zoom-in-95 duration-200 mt-1">
          <label className="block text-[10px] font-cinzel uppercase tracking-widest text-[#7c5f27] font-bold mb-1 text-center">
            Edit Debate Motion / Topic (Press Enter to Save)
          </label>
          <textarea
            ref={textareaRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Type or paste debate motion here..."
            className="w-full bg-white/80 border border-[#c5a059]/30 rounded-xl p-2.5 font-serif-display text-lg sm:text-xl md:text-2xl text-[#10141c] text-center italic leading-snug outline-none resize-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all"
          />

          {/* Quick Presets */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-1">
            <span className="text-[10px] font-cinzel text-[#837255] uppercase font-semibold mr-1 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5 text-[#c5a059]" /> Presets:
            </span>
            {MOTION_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputVal(preset)}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#ede5d8] hover:bg-[#e2d7c5] text-[#3e321e] font-serif-display italic border border-black/5 transition-colors cursor-pointer"
              >
                Preset {idx + 1}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2.5 mt-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setInputVal(motion);
              }}
              className="px-4 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-cinzel text-[11px] uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-1.5 rounded-full bg-[#141820] hover:bg-[#283244] text-white font-cinzel text-[11px] uppercase font-bold shadow-md flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Check className="w-3 h-3 text-amber-300" /> Save Motion
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleOpenEdit}
          title="Click to edit debate motion"
          className="group relative cursor-pointer px-4 py-1 rounded-2xl hover:bg-white/40 transition-all duration-200 flex flex-col items-center"
        >
          {/* Big Majestic Motion Display without excessive vertical footprint */}
          <h2 className="font-serif-display motion-text-responsive font-normal text-[#0d1118] italic text-center max-w-4xl tracking-tight transition-transform group-hover:scale-[1.006]">
            “{motion}”
          </h2>

          {/* Subdued hover edit prompt */}
          <div className="flex items-center gap-1 text-[10px] font-cinzel text-[#886729] font-bold mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-150">
            <Edit3 className="w-2.5 h-2.5 text-[#c5a059]" />
            <span>Click to Edit</span>
          </div>
        </div>
      )}
    </section>
  );
};
