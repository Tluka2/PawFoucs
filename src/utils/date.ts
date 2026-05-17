/**
 * Format a Date to local YYYY-MM-DD string.
 * Unlike toISOString() which uses UTC, this respects the user's timezone.
 */
export function toLocalDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
