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
  },
  {
    label: 'alerts',
    value: 'alerts',
    showTable: true
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
    value: 'capacityTBPS',
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
  { label: 'urls', value: 'urls', showSidebar: true },
  {
    label: 'alerts',
    value: 'alerts',
    showTable: true
  }
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
  {
    label: 'name',
    value: 'name',
    showTable: true
  },
  {
    label: 'websites',
    value: 'websites',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'facilities',
    value: 'facilities',
    showSidebar: true
  },
  {
    label: 'cables',
    value: 'cables',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'cls',
    value: 'cls',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'organizations',
    value: 'orgs',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'alerts',
    value: 'alerts',
    showTable: true
  }
]

export const orgsColumns = [
  {
    label: 'name',
    value: 'name',
    showTable: true
  },
  {
    label: 'logo',
    value: 'logo',
    showTable: true
  },
  {
    label: 'address',
    value: 'address',
    showTable: true,
    showSidebar: true
  },
  {
    label: 'URL',
    value: 'url',
    showTable: true,
    showSidebar: true
  },
  {
    label: 'networks',
    value: 'networks',
    showSidebar: true
  },
  {
    label: 'alerts',
    value: 'alerts',
    showTable: true
  }
]
