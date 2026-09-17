import React, { useState } from 'react';
import { X, BookOpen, Scale, ShieldAlert, Users, MessageSquare } from 'lucide-react';
import { GoldDiamond } from './ClassicalDecors';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ground' | 'roles' | 'pois' | 'judging'>('roles');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#f7f3ec] border border-[#c5a059]/40 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#606a7c] hover:text-[#181d26] hover:bg-black/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-1">
          <BookOpen className="w-5 h-5 text-[#9e7939]" />
          <div>
            <h3 className="font-cinzel text-base sm:text-lg tracking-[0.2em] uppercase font-bold text-[#1a1f28]">
              Official Rules & Regulations
            </h3>
            <span className="font-serif-display italic text-xs text-[#636c7e]">
              Echoes of Reason · Modified Asian Parliamentary Format
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-[#c5a059]/25 mt-3 mb-4 overflow-x-auto pb-1">
          {[
            { id: 'roles', label: 'Speaking Order & Roles', icon: Users },
            { id: 'pois', label: 'POI Rules', icon: MessageSquare },
            { id: 'ground', label: 'Ground Rules', icon: ShieldAlert },
            { id: 'judging', label: 'Judging Criteria', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#181d26] text-white shadow-xs font-semibold'
                    : 'text-[#555f72] hover:bg-[#ede6da]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="overflow-y-auto pr-1 text-xs text-[#2c3342] space-y-4 font-sans-ui flex-1">
          {/* TAB 1: ROLES & ORDER */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="bg-[#ede6da]/70 border border-[#c5a059]/25 rounded-2xl p-3.5">
                <h4 className="font-cinzel tracking-wider text-xs font-bold text-[#1a1f28] uppercase mb-1">
                  Format Overview
                </h4>
                <p className="text-[#4b5465] leading-relaxed">
                  2 teams of 3 speakers per debate. 4 rounds across 2 days, single-elimination: Round 1 & 2 (Qualifiers), Round 3 (Semifinal), Round 4 (Grand Final). Each speaker gets exactly <strong>4 minutes</strong>.
                </p>
              </div>

              {/* Table of roles */}
              <div className="overflow-hidden border border-[#c5a059]/20 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#e7e0d3] font-cinzel text-[11px] tracking-wider text-[#1a1f28]">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Role</th>
                      <th className="p-2.5">Team</th>
                      <th className="p-2.5">Time</th>
                      <th className="p-2.5">Core Objective</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5a059]/15">
                    <tr className="hover:bg-white/40">
                      <td className="p-2.5 font-bold">1</td>
                      <td className="p-2.5 font-semibold text-blue-900">Prime Minister (PM)</td>
                      <td className="p-2.5">Proposition</td>
                      <td className="p-2.5 font-num">4 min</td>
                      <td className="p-2.5">Define motion, build Proposition opening case (min 2 arguments).</td>
                    </tr>
                    <tr className="hover:bg-white/40">
                      <td className="p-2.5 font-bold">2</td>
                      <td className="p-2.5 font-semibold text-rose-900">Leader of Opposition (LO)</td>
                      <td className="p-2.5">Opposition</td>
                      <td className="p-2.5 font-num">4 min</td>
                      <td className="p-2.5">Respond to PM definition, rebut Prop case, build Opp case.</td>
                    </tr>
                    <tr className="hover:bg-white/40">
                      <td className="p-2.5 font-bold">3</td>
                      <td className="p-2.5 font-semibold text-blue-900">Deputy PM (DPM)</td>
                      <td className="p-2.5">Proposition</td>
                      <td className="p-2.5 font-num">4 min</td>
                      <td className="p-2.5">Rebut LO point-by-point, defend PM, extend Proposition case.</td>
                    </tr>
                    <tr className="hover:bg-white/40">
                      <td className="p-2.5 font-bold">4</td>
                      <td className="p-2.5 font-semibold text-rose-900">Deputy Leader of Opp (DLO)</td>
                      <td className="p-2.5">Opposition</td>
                      <td className="p-2.5 font-num">4 min</td>
                      <td className="p-2.5">Rebut DPM, defend LO, extend Opposition case further.</td>
                    </tr>
                    <tr className="hover:bg-white/40">
                      <td className="p-2.5 font-bold">5</td>
                      <td className="p-2.5 font-semibold text-rose-900">Opposition Closing</td>
                      <td className="p-2.5">Opposition</td>
                      <td className="p-2.5 font-num">4 min</td>
                      <td className="p-2.5">Summarise & weigh clashes. <strong>No new arguments.</strong></td>
                    </tr>
                    <tr className="hover:bg-white/40 bg-amber-500/5">
                      <td className="p-2.5 font-bold">6</td>
                      <td className="p-2.5 font-semibold text-blue-900">Proposition Closing</td>
                      <td className="p-2.5">Proposition</td>
                      <td className="p-2.5 font-num">4 min</td>
                      <td className="p-2.5">Summarise & weigh debate. <strong>No new arguments. Gets final word.</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: POI RULES */}
          {activeTab === 'pois' && (
            <div className="space-y-3">
              <div className="bg-[#ede6da]/70 border border-[#c5a059]/25 rounded-2xl p-4 space-y-2.5">
                <h4 className="font-cinzel tracking-wider text-xs font-bold text-[#1a1f28] uppercase">
                  Points of Information (POIs) Regulations
                </h4>
                <ul className="space-y-2 list-disc list-inside text-[#333b49] leading-relaxed">
                  <li>
                    <strong>Timing Window:</strong> Points of Information may be offered by the opposing team at any time during an opponent's address while the clock is running.
                  </li>
                  <li>
                    <strong>Offering a POI:</strong> Stand and say <em>“Point of Information”</em> or signal via the podium button. Do not reveal content before it is accepted.
                  </li>
                  <li>
                    <strong>Forms:</strong> Question, comment, or rebuttal (all are fair game). Always address as <em>“Proposition”</em> or <em>“Opposition”</em>, never by name.
                  </li>
                  <li>
                    <strong>15-Second Maximum:</strong> Speaker or moderator ends after 15 seconds. If declined, sit down immediately; the main speaker continues uninterrupted.
                  </li>
                  <li>
                    <strong>Mandatory Acceptance:</strong> Each speaker <strong>must accept at least one POI per speech</strong>; judges enforce this directly. Refusing all POIs lowers the score.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: GROUND RULES */}
          {activeTab === 'ground' && (
            <div className="space-y-2.5">
              {[
                { num: '1', title: 'No Religion or Theology, Ever', text: 'Instant disqualification. No appeal.' },
                { num: '2', title: 'Scientifically Grounded Claims', text: 'Fabricated or illogical claims must be caught by the opposing team via POI or later speech. If caught and data is fabricated, the argument is disregarded.' },
                { num: '3', title: 'No Hate Speech or Discrimination', text: 'Instant disqualification. No appeal.' },
                { num: '4', title: 'Respect the Room', text: 'Audible noise disrupting the speaker is forbidden and results in a formal warning.' },
                { num: '5', title: 'Judges\' Decisions are Final', text: 'Feedback may be requested after the round; do not contest decisions in the room.' },
                { num: '6', title: 'Surrender Devices', text: 'Phones and electronic devices must be surrendered before each round. Speakers may use pre-prepared paper notes.' },
              ].map((gr) => (
                <div key={gr.num} className="p-3 bg-[#ede6da]/60 rounded-xl border border-[#c5a059]/20 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#181d26] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {gr.num}
                  </span>
                  <div>
                    <h5 className="font-semibold text-[#181d26]">{gr.title}</h5>
                    <p className="text-[#515a6b] text-[11px] mt-0.5">{gr.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: JUDGING */}
          {activeTab === 'judging' && (
            <div className="space-y-3">
              <p className="text-[#4b5465] leading-relaxed">
                Judges score each speaker <strong>50–100</strong> (baseline <strong>75</strong>) across 5 criteria, voting as an <em>“ordinary intelligent voter”</em>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { name: 'Matter', desc: 'Argument quality, scientific depth, and logic.' },
                  { name: 'Manner', desc: 'Clarity and persuasiveness of delivery (accents ignored).' },
                  { name: 'Method', desc: 'Fulfillment of speaker’s structural role in the team.' },
                  { name: 'Engagement', desc: 'Rebuttal quality and POI participation (giving & accepting).' },
                  { name: 'Impact Calculus', desc: 'Weighing of harms, benefits, and probability.' },
                  { name: 'Argument Structure', desc: 'Claim (what) + Warrant (why/data) + Impact (why it matters).' },
                ].map((c) => (
                  <div key={c.name} className="p-3 rounded-xl bg-[#ede6da]/60 border border-[#c5a059]/20">
                    <h5 className="font-cinzel font-bold text-[11px] text-[#181d26] uppercase">{c.name}</h5>
                    <p className="text-[11px] text-[#555f72] mt-0.5">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-4 pt-3 border-t border-[#c5a059]/20 flex items-center justify-between text-[11px] text-[#717b8e]">
          <div className="flex items-center gap-1.5">
            <GoldDiamond className="w-2 h-2 opacity-60" />
            <span className="font-cinzel tracking-wider">SCIENCE CLUB, ASIET</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#181d26] text-white font-cinzel text-xs uppercase tracking-wider font-semibold hover:bg-[#2c3545] transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
