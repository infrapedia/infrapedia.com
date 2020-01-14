export const clsColumns = [
  { label: 'name', value: 'name', showSidebar: true, showTable: true },
  { label: 'state', value: 'state', showSidebar: true, showTable: true },
  { label: 'slug', value: 'slug', showSidebar: true, showTable: true },
  { label: 'geom', value: 'geom', showTable: true },
  {
    label: 'cables',
    value: 'cables',
    showSidebar: true
  },
  {
    label: 'networks',
    value: 'networks',
    showSidebar: true
  },
  {
    label: 'organizations',
    value: 'organizations',
    showSidebar: true
  }
]

// name, activation time, cls, facilities, operations
export const cablesColumns = [
  { label: 'name', value: 'name', showSidebar: true, showTable: true },
  {
    label: 'Latency',
    value: 'systemLength',
    showSidebar: true
  },
  {
    label: 'activation date',
    value: 'activationDateTime',
    showSidebar: true,
    showTable: true
  },
  // 'terrestrial', // (Bool)
  {
    label: 'capacity tbps',
    value: 'capacity_tbps',
    showSidebar: true
  },
  {
    label: 'fiberPairs',
    value: 'fiberPairs',
    showSidebar: true
  },
  { label: 'notes', value: 'notes' },
  { label: 'cls', value: 'cls', showSidebar: true },
  {
    label: 'facilities',
    value: 'facilities',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'networks',
    value: 'networks',
    showSidebar: true
  },
  {
    label: 'organizations',
    value: 'organizations',
    showSidebar: true
  },
  { label: 'urls', value: 'urls', showSidebar: true } // (Array)
  // 'facilities', // (Array)
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
