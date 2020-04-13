import { DateTime } from 'luxon'

export default function convertToYear(date) {
  return DateTime.fromISO(date).toLocaleString({ year: 'numeric' })
}
