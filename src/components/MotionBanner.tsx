import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check, X } from 'lucide-react';
import { GoldDiamond } from './ClassicalDecors';

export interface MotionPreset {
  id: string;
  roundName: string;
  matchTitle: string;
  propTeam: string;
  oppTeam: string;
  motion: string;
  explainer: string;
}

export const SEMIFINAL_MOTIONS: MotionPreset[] = [
  {
    id: 'semi-1',
    roundName: 'Round 3: Semifinal',
    matchTitle: 'Semifinal 1: Neutron vs Futures',
    propTeam: 'Team Neutron',
    oppTeam: 'Team Futures',
    motion: 'This house would let people legally erase specific traumatic memories if the technology existed.',
    explainer: 'This debate looks at whether people should be allowed to permanently erase specific memories of trauma if science made it possible. It balances the promise of relief from suffering against the risk of losing part of what makes a person who they are.',
  },
  {
    id: 'semi-2',
    roundName: 'Round 3: Semifinal',
    matchTitle: 'Semifinal 2: Utopia vs She He He',
    propTeam: 'Team Utopia',
    oppTeam: 'Team She He He',
    motion: "This house would allow governments to use captured criminals' brain data (with consent, in exchange for reduced sentences) to train crime-prediction AI.",
    explainer: 'This debate looks at whether the state should be allowed to use consenting prisoners\' brain data to build AI systems that predict future crime. It balances the potential to prevent crime before it happens against the risk of exploiting people who have little real power to refuse.',
  },
];

interface MotionBannerProps {
  motion: string;
  onUpdateMotion: (newMotion: string) => void;
  onSelectMatchPreset?: (preset: MotionPreset) => void;
}

export const MotionBanner: React.FC<MotionBannerProps> = ({ motion, onUpdateMotion, onSelectMatchPreset }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputVal, setInputVal] = useState(motion);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('semi-1');
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

  const handleChoosePreset = (preset: MotionPreset) => {
    setInputVal(preset.motion);
    setSelectedPresetId(preset.id);
    onSelectMatchPreset?.(preset);
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
      <div className="flex items-center gap-2.5 opacity-90 mb-0.5 animate-subtle-float">
        <div className="h-[0.5px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#c5a059]" />
        <GoldDiamond className="w-2 h-2 opacity-80" />
        <span className="font-cinzel text-[9px] sm:text-[10px] tracking-[0.3em] font-extrabold uppercase shimmer-gold-text">
          THE MOTION BEFORE THE HOUSE
        </span>
        <GoldDiamond className="w-2 h-2 opacity-80" />
        <div className="h-[0.5px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#c5a059]" />
      </div>

      {/* 2. Grand Way-Bigger Motion Display (Tight Vertical Padding) */}
      {isEditing ? (
        <div className="w-full max-w-3xl bg-[#faf7f2]/98 backdrop-blur-md border-2 border-[#c5a059] rounded-2xl p-4 sm:p-5 shadow-2xl animate-in zoom-in-95 duration-200 mt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#7c5f27] font-bold">
              Official Semifinal Motions
            </span>
            <span className="text-[10px] font-sans-ui text-gray-500">Click a match card to load</span>
          </div>

          {/* Quick Match Preset Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {SEMIFINAL_MOTIONS.map((preset) => {
              const isCurrent = inputVal === preset.motion || selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleChoosePreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#18202d] text-white border-[#c5a059] shadow-sm ring-1 ring-[#c5a059]/40'
                      : 'bg-[#ede5d8]/70 hover:bg-[#ede5d8] text-[#2c3342] border-[#c5a059]/30 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-[10px] font-cinzel font-bold uppercase tracking-wider ${isCurrent ? 'text-amber-300' : 'text-[#7a5c24]'}`}>
                      {preset.matchTitle}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-sans-ui ${isCurrent ? 'bg-white/15 text-gray-200' : 'bg-black/5 text-gray-600'}`}>
                      {preset.propTeam} vs {preset.oppTeam}
                    </span>
                  </div>
                  <p className={`text-xs font-serif-display italic line-clamp-2 ${isCurrent ? 'text-amber-100/90' : 'text-[#1c222e]'}`}>
                    “{preset.motion}”
                  </p>
                  {preset.explainer && (
                    <p className={`text-[10px] mt-1.5 leading-snug line-clamp-2 ${isCurrent ? 'text-amber-200/70' : 'text-gray-600'}`}>
                      <span className="font-semibold">Explainer:</span> {preset.explainer}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          <label className="block text-[10px] font-cinzel uppercase tracking-widest text-[#7c5f27] font-bold mb-1">
            Motion Text (Customizable)
          </label>
          <textarea
            ref={textareaRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Type or paste debate motion here..."
            className="w-full bg-white border border-[#c5a059]/40 rounded-xl p-2.5 font-serif-display text-base sm:text-lg md:text-xl text-[#10141c] text-center italic leading-snug outline-none resize-none focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/20 transition-all shadow-inner"
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-2.5 mt-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setInputVal(motion);
              }}
              className="px-4 py-1.5 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-cinzel text-[11px] uppercase font-bold flex items-center gap-1 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <X className="w-3 h-3" /> Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-1.5 rounded-full bg-[#141820] hover:bg-[#283244] text-white font-cinzel text-[11px] uppercase font-bold shadow-md flex items-center gap-1 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Check className="w-3 h-3 text-amber-300" /> Apply Motion
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleOpenEdit}
          title="Click to edit debate motion"
          className="group relative cursor-pointer px-5 py-1.5 rounded-2xl hover:bg-white/50 border border-transparent hover:border-[#c5a059]/30 shadow-none hover:shadow-md transition-all duration-300 flex flex-col items-center"
        >
          {/* Big Majestic Motion Display without excessive vertical footprint */}
          <h2 className="font-serif-display motion-text-responsive font-normal text-[#0d1118] italic text-center max-w-4xl tracking-tight transition-all duration-300 group-hover:scale-[1.01] group-hover:text-black">
            “{motion}”
          </h2>

          {/* Subdued hover edit prompt with spring entrance */}
          <div className="flex items-center gap-1 text-[10px] font-cinzel text-[#886729] font-bold mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
            <Edit3 className="w-2.5 h-2.5 text-[#c5a059]" />
            <span>Click to Edit</span>
          </div>
        </div>
      )}
    </section>
  );
};
