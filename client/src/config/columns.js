export const clsColumns = [
  'name',
  'state', // Bool
  'slug',
  'geom',
  'cables' // (Array)
]

export const cablesColumns = [
  { label: 'name', value: 'name' },
  { label: 'system length', value: 'system_length' },
  { label: 'activation date', value: 'activationDateTime' },
  { label: 'urls', value: 'urls' }, // (Array)
  // 'terrestrial', // (Bool)
  { label: 'capacity tbps', value: 'capacity_tbps' },
  { label: 'fiberPairs', value: 'fiberPairs' },
  { label: 'notes', value: 'notes' }
  // 'facilities', // (Array)
  // 'cls' // (Array)
]

export const facsColumns = [
  'name',
  'point', // Bool
  'address',
  'websites' // (Array)
]

export const ixpsColumns = [
  'name',
  'state', // Bool
  'slug',
  'geom',
  'cables' // (Array)
]

export const netColumns = [
  'name',
  'websites', // (Array)
  'organizations', // (Array)
  'facilities', // (Array)
  'ixps', // (Array)
  'cls', //(Array)
  'cables' //(Array)
]

export const orgsColumns = [
  'name',
  'logo',
  // 'notes',
  'address' // (Array)
]
