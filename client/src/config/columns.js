export const clsColumns = [
  { label: 'Name', value: 'name', showSidebar: true, showTable: true },
  { label: 'State', value: 'state', showSidebar: true },
  { label: 'Slug', value: 'slug', showSidebar: true, showTable: true },
  { label: 'Geom', value: 'geom' },
  {
    label: 'Cables',
    value: 'cables',
    showSidebar: true
  },
  {
    label: 'Networks',
    value: 'networks',
    showSidebar: true
  },
  {
    label: 'Organizations',
    value: 'organizations',
    showSidebar: true
  },
  {
    label: 'Configured alerts',
    value: 'alerts',
    showTable: true
  }
]

// name, activation time, cls, facilities, operations
export const cablesColumns = [
  { label: 'Name', value: 'name', showSidebar: true, showTable: true },
  {
    label: 'Latency',
    value: 'systemLength',
    showSidebar: true
  },
  {
    label: 'Activation date',
    value: 'activationDateTime',
    showSidebar: true,
    showTable: true
  },
  // 'terrestrial', // (Bool)
  {
    label: 'Capacity tbps',
    value: 'capacityTBPS',
    showSidebar: true
  },
  {
    label: 'FiberPairs',
    value: 'fiberPairs',
    showSidebar: true
  },
  { label: 'Notes', value: 'notes' },
  { label: 'Cls', value: 'cls', showSidebar: true },
  {
    label: 'Facilities',
    value: 'facilities',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Networks',
    value: 'networks',
    showSidebar: true
  },
  {
    label: 'Organizations',
    value: 'organizations',
    showSidebar: true
  },
  { label: 'Urls', value: 'urls', showSidebar: true },
  {
    label: 'Configured alerts',
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
    label: 'Name',
    value: 'name',
    showTable: true
  },
  {
    label: 'Websites',
    value: 'websites',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Facilities',
    value: 'facilities',
    showSidebar: true
  },
  {
    label: 'Cables',
    value: 'cables',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Cls',
    value: 'cls',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Organizations',
    value: 'orgs',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Configured alerts',
    value: 'alerts',
    showTable: true
  }
]

export const orgsColumns = [
  {
    label: 'Name',
    value: 'name',
    showTable: true
  },
  {
    label: 'Logo',
    value: 'logo',
    showTable: true
  },
  {
    label: 'Address',
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
    label: 'Networks',
    value: 'networks',
    showSidebar: true
  },
  {
    label: 'Configured alerts',
    value: 'alerts',
    showTable: true
  }
]
