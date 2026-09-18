import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { GoldDiamond } from './ClassicalDecors';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Start / Pause the phase on the clock' },
    { key: 'R', desc: 'Reset the current phase to its full length' },
    { key: 'N', desc: 'Advance one phase (Speech → Q&A → Reply → next speaker)' },
    { key: 'B', desc: 'Step back one phase' },
    { key: 'Esc', desc: 'Dismiss the open dialogue' },
    { key: 'M', desc: 'Toggle debate bell sounds' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-[#f7f3ec] border border-[#c5a059]/40 rounded-3xl p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#606a7c] hover:text-[#181d26] hover:bg-black/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <Keyboard className="w-5 h-5 text-[#c5a059]" />
          <h3 className="font-cinzel text-base tracking-[0.2em] uppercase font-bold text-[#1a1f28]">
            Moderator Controls
          </h3>
        </div>
        <p className="font-serif-display italic text-xs text-[#636c7e] mb-4">
          Quick keyboard shortcuts for seamless stage management
        </p>

        <div className="divide-y divide-[#c5a059]/20 border-y border-[#c5a059]/20 my-2">
          {shortcuts.map((sc) => (
            <div key={sc.key} className="py-2.5 flex items-center justify-between gap-3">
              <span className="font-sans-ui text-xs text-[#303746] font-medium">{sc.desc}</span>
              <kbd className="px-2.5 py-1 bg-[#ede6da] border border-[#c5a059]/30 rounded-md font-mono text-xs font-semibold text-[#181d26] shadow-xs shrink-0">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Running order reminder */}
        <div className="mt-3 p-3 rounded-xl bg-[#ede6da]/70 border border-[#c5a059]/25">
          <h4 className="font-cinzel text-[10px] tracking-wider font-bold text-[#1a1f28] uppercase mb-1">
            Running Order · 14 Phases · 26 Minutes
          </h4>
          <p className="text-[11px] text-[#4b5465] leading-relaxed font-sans-ui">
            PM · LO · DPM · DLO each run <strong>3:00 speech → 1:00 cross-questioning → 1:00 reply</strong>.
            The two closings run <strong>3:00 straight through</strong>, with no questions.
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-serif-display italic text-[#727c8e]">
          <GoldDiamond className="w-2 h-2 opacity-70" />
          <span>Echoes of Reason · Official Debate Stage Controller</span>
          <GoldDiamond className="w-2 h-2 opacity-70" />
        </div>
      </div>
    </div>
  );
};
