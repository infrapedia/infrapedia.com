export const clsColumns = [
  { label: 'Name', value: 'name', showSidebar: true, showTable: true },
  { label: 'State', value: 'state', showSidebar: true },
  { label: 'Slug', value: 'slug', showSidebar: true },
  { label: 'Geom', value: 'geom' },
  {
    label: 'Cables',
    value: 'cables',
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
  {
    label: 'Name',
    value: 'name',
    showSidebar: true,
    showTable: true,
    sortable: true
  },
  { label: 'Status', value: 'category', showSidebar: true },
  {
    label: 'Latency',
    value: 'systemLength',
    showSidebar: true
  },
  {
    label: 'Length',
    value: 'systemLength',
    showSidebar: true
  },
  {
    label: 'RFS',
    value: 'activationDateTime',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'RFS Quarter',
    value: 'RFS',
    showSidebar: true
  },
  {
    label: 'EOL',
    value: 'activationDateTime',
    showSidebar: true
  },
  // 'terrestrial', // (Bool)
  {
    label: 'Design Capacity',
    value: 'capacityTBPS',
    showSidebar: true
  },
  {
    label: 'Fiber Pairs',
    value: 'fiberPairs',
    showSidebar: true
  },
  {
    label: 'Lit Capacity',
    value: 'litCapacity',
    showSidebar: true
  },
  { label: 'Notes', value: 'notes', showSidebar: true },
  { label: 'Cls', value: 'cls', showSidebar: true },
  {
    label: 'Facilities',
    value: 'facilities',
    showSidebar: true
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
    showSidebar: true
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
    showSidebar: true
  },
  {
    label: 'Owners',
    value: 'organizations',
    showSidebar: true
  },
  {
    label: 'Facilities',
    value: 'facilities',
    showSidebar: true
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
    label: 'Creation date',
    value: 'created',
    showSidebar: true
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
    showSidebar: true
  },
  {
    label: 'Owners',
    value: 'orgs',
    showSidebar: true
  },
  {
    label: 'Configured alerts',
    value: 'alerts',
    showTable: true
  },
  { label: 'asn', value: 'asn', showSidebar: true },
  { label: 'info ipv6', value: 'info_ipv6', showSidebar: true },
  {
    label: 'info multicast',
    value: 'info_multicast',
    showSidebar: true
  },
  { label: 'prefixes4', value: 'prefixes4', showSidebar: true },
  { label: 'info ratio', value: 'info_ratio', showSidebar: true },
  { label: 'info scope', value: 'info_scope', showSidebar: true },
  { label: 'info traffic', value: 'info_traffic', showSidebar: true },
  { label: 'info type', value: 'info_type', showSidebar: true },
  { label: 'info unicast', value: 'info_unicast', showSidebar: true },
  { label: 'irr as_set', value: 'irr_as_set', showSidebar: true },
  { label: 'looking glass', value: 'looking_glass', showSidebar: true },
  {
    label: 'policy contrats',
    value: 'policy_contrats',
    showSidebar: true
  },
  {
    label: 'policy general',
    value: 'policy_general',
    showSidebar: true
  },
  {
    label: 'policy locations',
    value: 'policy_locations',
    showSidebar: true
  },
  { label: 'policy ratio', value: 'policy_ratio', showSidebar: true },
  { label: 'policy url', value: 'policy_url', showSidebar: true },
  { label: 'route server', value: 'route_server', showSidebar: true }
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
