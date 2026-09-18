import React, { useState } from 'react';
import { X, BookOpen, Scale, ShieldAlert, Users, MessagesSquare } from 'lucide-react';
import { GoldDiamond } from './ClassicalDecors';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Speaking order exactly as set out in the official rules and regulations. */
const ROLE_ROWS = [
  {
    num: '1',
    role: 'Prime Minister (PM)',
    team: 'Proposition',
    isProp: true,
    speak: '3 min',
    qa: '1 min',
    reply: '1 min',
    job: 'Define the motion, set the framework, build the Proposition opening case (min. 2 developed arguments).',
  },
  {
    num: '2',
    role: 'Leader of Opposition (LO)',
    team: 'Opposition',
    isProp: false,
    speak: '3 min',
    qa: '1 min',
    reply: '1 min',
    job: 'Rebut the PM, challenge the definition if unreasonable, build the Opposition counter-case.',
  },
  {
    num: '3',
    role: 'Deputy PM (DPM)',
    team: 'Proposition',
    isProp: true,
    speak: '3 min',
    qa: '1 min',
    reply: '1 min',
    job: 'Rebut the LO point by point, defend the PM, extend Proposition with new material.',
  },
  {
    num: '4',
    role: 'Deputy Leader of Opp (DLO)',
    team: 'Opposition',
    isProp: false,
    speak: '3 min',
    qa: '1 min',
    reply: '1 min',
    job: 'Rebut the DPM, defend the LO, extend the Opposition case further.',
  },
  {
    num: '5',
    role: 'Opposition Closing',
    team: 'Opposition',
    isProp: false,
    speak: '3 min',
    qa: '—',
    reply: '—',
    job: 'Summarise & weigh the debate from Opposition. No new arguments.',
  },
  {
    num: '6',
    role: 'Proposition Closing',
    team: 'Proposition',
    isProp: true,
    speak: '3 min',
    qa: '—',
    reply: '—',
    job: 'Mirror the Opposition Closing, favouring Proposition. No new arguments. Last word.',
  },
];

const GROUND_RULES = [
  {
    num: '1',
    title: 'No Religion or Theology, Ever',
    text: 'Instant disqualification. No appeal.',
  },
  {
    num: '2',
    title: 'Scientifically Grounded Claims',
    text: 'A fabricated or illogical claim stands unless the opposing team catches it — via cross-questioning or a later speech. If caught and fabricated, the argument is disregarded.',
  },
  {
    num: '3',
    title: 'No Hate Speech or Discrimination',
    text: 'Instant disqualification. No appeal.',
  },
  {
    num: '4',
    title: 'Respect the Room',
    text: 'Inattention is fine; disruptive audible noise gets a formal warning.',
  },
  {
    num: '5',
    title: "Judges' Decisions Are Final",
    text: 'Feedback may be requested after the round, not contested in-room.',
  },
  {
    num: '6',
    title: 'Rounds Begin at Approximately 2:15 PM',
    text: 'Be at the room and ready before the round is called.',
  },
  {
    num: '7',
    title: 'No Printed Material of Any Kind',
    text: 'One page of handwritten, bullet-point notes only — no full sentences or paragraphs — capped at 75 words per speaker. Phones and other devices are surrendered before each round.',
    penalty:
      'Penalty: violating notes are confiscated on sight for the rest of the debate; a repeat offence by the same speaker costs a Method score penalty.',
  },
];

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'ground' | 'roles' | 'cross' | 'judging'>('roles');

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
              Official Rules &amp; Regulations
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
            { id: 'cross', label: 'Cross-Questioning', icon: MessagesSquare },
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
                  2 teams of 3 speakers, no coalitions, judged by appointed judges only (no public
                  voting). 4 rounds across 2 days, single-elimination: Round 1 &amp; 2 (Qualifiers),
                  Round 3 (Semifinal), Round 4 (Grand Final). Winners of Rounds 1 &amp; 2 advance;
                  Grand Final sides are set by a live coin toss shortly before the debate.
                </p>
                <p className="text-[#4b5465] leading-relaxed mt-2">
                  Every speech is <strong>3 minutes</strong>. The four main speeches each add{' '}
                  <strong>1 minute of cross-questioning</strong> and <strong>1 minute of reply</strong>:{' '}
                  <strong>4 × 5 min + 2 × 3 min closings = 26 minutes</strong> of speaking time.
                </p>
              </div>

              {/* Table of roles */}
              <div className="overflow-x-auto border border-[#c5a059]/20 rounded-2xl">
                <table className="w-full text-left border-collapse min-w-[520px]">
                  <thead className="bg-[#e7e0d3] font-cinzel text-[11px] tracking-wider text-[#1a1f28]">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Role</th>
                      <th className="p-2.5">Speak</th>
                      <th className="p-2.5">Q&amp;A</th>
                      <th className="p-2.5">Reply</th>
                      <th className="p-2.5">Job</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5a059]/15">
                    {ROLE_ROWS.map((r) => (
                      <tr
                        key={r.num}
                        className={`hover:bg-white/40 ${r.num === '6' ? 'bg-amber-500/5' : ''}`}
                      >
                        <td className="p-2.5 font-bold">{r.num}</td>
                        <td
                          className={`p-2.5 font-semibold ${
                            r.isProp ? 'text-blue-900' : 'text-rose-900'
                          }`}
                        >
                          {r.role}
                          <span className="block text-[10px] font-normal text-[#6b7484]">{r.team}</span>
                        </td>
                        <td className="p-2.5 font-num whitespace-nowrap">{r.speak}</td>
                        <td className="p-2.5 font-num whitespace-nowrap">{r.qa}</td>
                        <td className="p-2.5 font-num whitespace-nowrap">{r.reply}</td>
                        <td className="p-2.5">{r.job}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CROSS-QUESTIONING */}
          {activeTab === 'cross' && (
            <div className="space-y-3">
              <div className="bg-[#ede6da]/70 border border-[#c5a059]/25 rounded-2xl p-4 space-y-2.5">
                <h4 className="font-cinzel tracking-wider text-xs font-bold text-[#1a1f28] uppercase">
                  Cross-Questioning <span className="normal-case font-normal">(replaces Points of Information)</span>
                </h4>
                <ul className="space-y-2 list-disc list-inside text-[#333b49] leading-relaxed">
                  <li>
                    <strong>When:</strong> after each of the four main speeches (PM, LO, DPM, DLO),
                    the opposing team gets <strong>1 minute</strong> to question the speaker.
                  </li>
                  <li>
                    <strong>Who asks:</strong> any of the three opposing teammates may ask questions,
                    but <strong>only one may speak at a time</strong> — no overlapping or simultaneous
                    questioning.
                  </li>
                  <li>
                    <strong>The reply:</strong> the original speaker then gets <strong>1 minute</strong>{' '}
                    to reply, <strong>uninterrupted</strong>.
                  </li>
                  <li>
                    <strong>Closings are exempt:</strong> no cross-questioning during the Opposition
                    Closing or Proposition Closing — these run straight through with no interruption.
                  </li>
                  <li>
                    <strong>Judges' discretion:</strong> whether the full minute must be used or time
                    can be ceded early, and any penalty for speaking out of turn during the Q&amp;A or
                    reply window, is decided by the judges on the day.
                  </li>
                </ul>
              </div>

              <div className="bg-[#181d26] text-amber-100 rounded-2xl p-4">
                <h4 className="font-cinzel tracking-wider text-[11px] font-bold uppercase mb-2 text-amber-300">
                  Phase Clock
                </h4>
                <div className="flex items-center justify-between gap-2 text-center font-cinzel text-[10px] uppercase tracking-wider">
                  <div className="flex-1 py-2 rounded-xl bg-white/10 border border-amber-300/30">
                    Speech
                    <span className="block font-num text-base tracking-normal mt-0.5">3:00</span>
                  </div>
                  <span className="text-amber-300">→</span>
                  <div className="flex-1 py-2 rounded-xl bg-white/10 border border-amber-300/30">
                    Cross-Questioning
                    <span className="block font-num text-base tracking-normal mt-0.5">1:00</span>
                  </div>
                  <span className="text-amber-300">→</span>
                  <div className="flex-1 py-2 rounded-xl bg-white/10 border border-amber-300/30">
                    Reply
                    <span className="block font-num text-base tracking-normal mt-0.5">1:00</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GROUND RULES */}
          {activeTab === 'ground' && (
            <div className="space-y-2.5">
              {GROUND_RULES.map((gr) => (
                <div
                  key={gr.num}
                  className="p-3 bg-[#ede6da]/60 rounded-xl border border-[#c5a059]/20 flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#181d26] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {gr.num}
                  </span>
                  <div>
                    <h5 className="font-semibold text-[#181d26]">{gr.title}</h5>
                    <p className="text-[#515a6b] text-[11px] mt-0.5">{gr.text}</p>
                    {gr.penalty && (
                      <p className="text-[11px] mt-1.5 px-2 py-1 rounded-lg bg-rose-900/8 border border-rose-900/20 text-rose-900 font-medium">
                        {gr.penalty}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: JUDGING */}
          {activeTab === 'judging' && (
            <div className="space-y-3">
              <p className="text-[#4b5465] leading-relaxed">
                Judges score each speaker <strong>50–100</strong> (baseline <strong>75</strong>) across
                5 criteria, voting as an <em>“ordinary intelligent voter”</em>: smart, fair-minded, no
                specialist knowledge, no bias.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { name: 'Matter', desc: 'Argument quality and depth.' },
                  { name: 'Manner', desc: 'Clarity of delivery (accents are ignored).' },
                  { name: 'Method', desc: "Fulfilment of the speaker's role." },
                  { name: 'Engagement', desc: 'Rebuttal quality and cross-questioning participation.' },
                  { name: 'Impact Calculus', desc: 'Weighing of harms and benefits.' },
                  {
                    name: 'Argument Structure',
                    desc: 'Claim (what) + Warrant (why/data) + Impact (why it matters). Two or three developed arguments beat five shallow ones.',
                  },
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
