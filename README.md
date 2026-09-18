# Echoes of Reason — Live Debate Stage Timer

Stage-facing timer and moderator console for the **Echoes of Reason** debate
competition (Science Club, ASIET). Built with React 19, TypeScript, Vite and
Tailwind CSS 4.

The app implements the competition's **Modified Asian Parliamentary** format
exactly as written in `echoes-of-reason-rules-and-regulations.pdf`, which ships
alongside the source.

## The running order

A debate is **14 timed phases totalling 26 minutes**. Every speech is 3 minutes;
the four main speeches each add a minute of cross-questioning and a minute of
reply.

| # | Role | Team | Speak | Q&A | Reply |
|---|------|------|-------|-----|-------|
| 1 | Prime Minister (PM) | Proposition | 3:00 | 1:00 | 1:00 |
| 2 | Leader of Opposition (LO) | Opposition | 3:00 | 1:00 | 1:00 |
| 3 | Deputy Prime Minister (DPM) | Proposition | 3:00 | 1:00 | 1:00 |
| 4 | Deputy Leader of Opposition (DLO) | Opposition | 3:00 | 1:00 | 1:00 |
| 5 | Opposition Closing | Opposition | 3:00 | — | — |
| 6 | Proposition Closing | Proposition | 3:00 | — | — |

**Cross-questioning** (which replaced Points of Information) runs as its own
phase on the main clock: after each main speech the opposing bench gets one
minute to question the speaker — any of the three teammates may ask, but only
one at a time — and the speaker then gets one uninterrupted minute to reply.
The two closing speeches run straight through with no questions.

## Moderator controls

| Key | Action |
|-----|--------|
| `Space` | Start / pause the phase on the clock |
| `R` | Reset the current phase to its full length |
| `N` | Advance one phase (Speech → Q&A → Reply → next speaker) |
| `B` | Step back one phase |
| `M` | Toggle debate bell sounds |
| `Esc` | Dismiss the open dialogue |

Phases advance manually, so the room gets a beat between a speech and the
questions that follow it. The bell rings once as a phase enters its final
stretch — a minute out on a 3:00 speech, thirty seconds out on the 1:00
phases — and rings twice at 0:00.

Any phase length can be overridden live from the dial (quick ±30s / ±1m, or the
MM:SS editor) when the judges adjust timings on the day.

## Screens

- **Semifinals** — classical stage layout with the motion banner and both podiums.
- **Grand Finale** — the ceremonial screen, with monument podiums and the gold chronometer.

Both share one debate clock, so switching screens never loses the running order.

## Development

```bash
npm install
npm run dev      # Vite dev server
npm run build    # tsc -b && vite build
npm run lint     # oxlint
```

## Source layout

```
src/
  types/debate.ts        Speaker, DebateSegment and the phase model
  utils/segments.ts      Official durations; expands the roster into 14 phases
  utils/time.ts          MM:SS formatting
  utils/audio.ts         Web Audio debate bells
  components/
    DebateTimer.tsx      Main dial, phase labels and control deck
    GrandFinalScreen.tsx Grand Finale stage
    CrossExamPanel.tsx   Non-blocking cross-questioning / reply ribbon
    TeamPanel.tsx        Podium with per-speaker S/Q/R phase pips
    ExtravagantPodium.tsx Grand Finale podium
    ProgressIndicator.tsx 14-bead running order
    RulesModal.tsx       The rules, in full
```
