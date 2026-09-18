/**
 * Formats seconds into MM:SS (e.g. 180 -> "03:00", 9 -> "00:09")
 */
export const formatTime = (seconds: number): string => {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formats seconds into M:SS for compact speaker lists (e.g. 180 -> "3:00")
 */
export const formatTimeCompact = (seconds: number): string => {
  const clamped = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
