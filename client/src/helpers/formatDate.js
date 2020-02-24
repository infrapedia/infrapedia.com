import { DateTime } from 'luxon'

export const formatDate = date => DateTime.fromISO(date).toLocaleString()
