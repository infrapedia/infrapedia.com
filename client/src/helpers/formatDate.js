import { DateTime } from 'luxon'

export function formatDate(date) {
  return DateTime.fromISO(date).toLocaleString()
}
