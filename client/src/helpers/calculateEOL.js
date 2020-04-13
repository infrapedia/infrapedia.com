import { DateTime } from 'luxon'

export default function calculateEOL(date) {
  return DateTime.fromISO(date).plus({ years: 25 })
}
