/**
 * Formats a duration in milliseconds to a mm:ss string.
 */
export function formatDuration(ms: number): string {
  if (!ms || ms <= 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Generates a human-readable label for a new recording.
 */
export function generateLabel(index: number): string {
  return `Voice Note ${index}`;
}

/**
 * Returns a Recording id based on current timestamp.
 */
export function generateId(): string {
  return Date.now().toString();
}

/**
 * Formats the current time as HH:MM AM/PM.
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Formats the current date as "Jan 1, 2025".
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}