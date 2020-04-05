export const clsColumns = [
  { label: 'Name', value: 'name', showSidebar: true, showTable: true },
  { label: 'State', value: 'state', showSidebar: true },
  { label: 'Slug', value: 'slug', showSidebar: true },
  { label: 'Geom', value: 'geom' },
  {
    label: 'Cables',
    value: 'cables',
    showTable: true,
    showSidebar: true,
    filter: arr => arr
  },
  {
    label: 'Groups',
    value: 'networks',
    showSidebar: true
  },
  {
    label: 'Owners',
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
    label: 'RFS (Ready for Service)',
    value: 'activationDateTime',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'EOL (End of Life)',
    value: 'activationDateTime',
    showSidebar: true
  },
  // 'terrestrial', // (Bool)
  {
    label: 'Design Capacity (Maximum Tbps of the system)',
    value: 'capacityTBPS'
  },
  {
    label: 'FiberPairs',
    value: 'fiberPairs',
    showSidebar: true
  },
  {
    label: 'Lit Capacity',
    value: 'litCapacity',
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
    label: 'Groups',
    value: 'networks',
    showSidebar: true
  },
  {
    label: 'Owners',
    value: 'owners',
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
  {
    label: 'Name',
    value: 'name',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Address',
    value: 'address',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Websites',
    value: 'websites',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Start date',
    value: 'startDate',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Ixps',
    value: 'ixps',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Type',
    value: 'building',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Cables',
    value: 'cables',
    showSidebar: true,
    filter: arr => arr,
    showTable: true
  },
  {
    label: 'Groups',
    value: 'networks',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Owners',
    value: 'organizations',
    showSidebar: true,
    showTable: true
  }
]

export const ixpsColumns = [
  {
    label: 'Name',
    value: 'name',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Address',
    value: 'address',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Media',
    value: 'media',
    showSidebar: true
  },
  {
    label: 'Websites',
    value: 'website',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Policy email',
    value: 'policyEmail',
    showSidebar: true
  },
  {
    label: 'Policy phone',
    value: 'policyPhone',
    showSidebar: true
  },
  {
    label: 'Tech email',
    value: 'techEmail',
    showSidebar: true
  },
  {
    label: 'Tech phone',
    value: 'techPhone',
    showSidebar: true
  },
  {
    label: 'Groups',
    value: 'networks',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Owners',
    value: 'organizations',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Facilities',
    value: 'facilities',
    showSidebar: true,
    showTable: true
  }
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
    label: 'Terrestrial Networks',
    value: 'cables',
    showSidebar: true,
    filter: arr => arr.filter(c => c.terrestrial)
  },
  {
    label: 'Subsea Cables',
    value: 'cables',
    showSidebar: true,
    filter: arr => arr.filter(c => !c.terrestrial)
  },
  {
    label: 'Cls',
    value: 'cls',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Owners',
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
    label: 'Groups',
    value: 'networks',
    showSidebar: true
  },
  {
    label: 'Configured alerts',
    value: 'alerts',
    showTable: true
  }
]
