import { DateTime } from 'luxon'

function convertToYear(date) {
  return DateTime.fromISO(date).toLocaleString({ year: 'numeric' })
}

export default convertToYear
