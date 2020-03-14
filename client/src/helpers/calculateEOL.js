import { DateTime } from 'luxon'

function calculateEOL(date) {
  return DateTime.fromISO(date).plus({ years: 25 })
}

export default calculateEOL
