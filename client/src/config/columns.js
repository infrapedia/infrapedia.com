export const clsColumns = [
  { label: 'Name', value: 'name', showSidebar: true, showTable: true },
  { label: 'Status', value: 'state', showSidebar: true },
  { label: 'Slug', value: 'slug', showSidebar: true },
  { label: 'Geom', value: 'geom' },
  {
    label: 'Subsea cables',
    value: 'cables',
    showSidebar: true,
    filter: arr => arr.filter(item => !item.terrestrial)
  },
  {
    label: 'Terrestrial networks',
    value: 'cables',
    showSidebar: true,
    filter: arr => arr.filter(item => item.terrestrial)
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
  },
  {
    label: 'Created at',
    value: 'rgDate',
    showTable: true
  },
  {
    label: 'Updated at',
    value: 'uDate',
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
    value: 'systemLength'
    // showSidebar: true
  },
  {
    label: 'Length',
    value: 'systemLength',
    showSidebar: true
  },
  {
    label: 'RFS',
    value: 'activationDateTime',
    showTable: true
  },
  {
    label: 'RFS',
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
    label: 'Known Users',
    value: 'knownUsers',
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
  },
  {
    label: 'Created at',
    value: 'rgDate',
    showTable: true
  },
  {
    label: 'Updated at',
    value: 'uDate',
    showTable: true
  }
  // 'facilities', // (Array)
]

export const cspColumns = [
  {
    label: 'Color',
    value: 'color',
    showTable: true
  },
  {
    label: 'Name',
    value: 'name',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Established in (year)',
    value: 'establismentYear',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'URL',
    value: 'url',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Status page (url)',
    value: 'statusPage',
    showSidebar: true,
    showTable: true
  }
]

//==========================
//==========================
//==========================
// FACILITIES COLUMNS START
//==========================
//==========================
//==========================

export const facsColumns = [
  {
    label: 'Name',
    value: 'name',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Type',
    value: 't',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'PeeringDB',
    value: 'fac_id',
    showSidebar: true,
    link: id => `https://www.peeringdb.com/fac/${id}`
  },
  {
    label: 'Address',
    value: 'address',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'In Service',
    value: 'StartDate',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Gross Building Size',
    value: 'grossBuildingSize',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'Total Power',
    value: 'totalPower',
    showSidebar: true,
    showTable: true,
    valueMetric: 'MW'
  },
  {
    label: 'Created at',
    value: 'rgDate',
    showTable: true
  },
  {
    label: 'Updated at',
    value: 'uDate',
    showTable: true
  }
]

export const facilitiesBuildingDetailsColumns = [
  {
    label: 'Gross Building Size',
    value: 'buildingSize',
    valueMetric: 'sq m'
  },
  {
    label: 'Gross Colocation Size',
    value: 'grossColocationSize',
    valueMetric: 'sq m'
  },
  {
    label: 'Floor Loading Capacity',
    value: 'floorLoadingCapacity',
    valueMetric: 'kg/sq m'
  },
  {
    label: 'Carrier Neutral',
    value: 'isCarrierNeutral'
  },
  {
    label: 'Loading Docks',
    value: 'isLoadingDocks'
  },
  {
    label: 'Rack Height',
    value: 'rackHeight',
    valueMetric: 'U'
  },
  {
    label: 'Meet me rooms',
    value: 'meetMeRooms'
  },
  {
    label: 'Satellite/Antenna Platform',
    value: 'platform'
  }
]

export const facilitiesPowerAndCoolingDetailsColumns = [
  {
    label: 'Total Power',
    value: 'totalPower'
  },
  {
    label: 'PUE',
    value: 'pue'
  },
  {
    label: 'Utility Connection Redundancy',
    value: 'utilityConnectionRedundancy'
  },
  {
    label: 'Max Rack Power',
    value: 'maxRackPower',
    valueMetric: 'KW'
  },
  {
    label: 'Backup Power Duration',
    value: 'backupPowerDuration',
    valueMetric: 'hours'
  },
  {
    label: 'Backup Power Redundancy',
    value: 'backupPowerRedundancy'
  },
  {
    label: 'Cooling Capacity',
    value: 'coolingCapacity',
    valueMetric: 'MW'
  },
  {
    label: 'Temperature',
    value: 'temperature',
    valueMetric: '°C'
  },
  {
    label: 'Humidity',
    value: 'humidity',
    valueMetric: '%'
  }
]

export const facilitiesSecurityAndOnsiteServicesColumns = [
  {
    label: 'Bullet Proof Glass',
    value: 'bulletProffGlass'
  },
  {
    label: 'CCTV',
    value: 'cctv'
  },
  {
    label: 'Security Guards',
    value: 'securityGuards'
  },
  {
    label: 'Mantrap',
    value: 'mantrap'
  },
  {
    label: 'Biometric',
    value: 'biometric'
  },
  {
    label: 'Authentication',
    value: 'authentication'
  },
  {
    label: 'Meeting Rooms',
    value: 'meetingRooms'
  },
  {
    label: 'Break Rooms',
    value: 'breakRooms'
  },
  {
    label: 'Car Parking',
    value: 'carParking'
  },
  {
    label: 'Spare Parts',
    value: 'spareParts'
  },
  {
    label: 'Staging Rooms',
    value: 'stagingRooms'
  },
  {
    label: 'Office Space',
    value: 'officeSpace'
  },
  {
    label: 'Internet Access',
    value: 'internetAccess'
  }
]

export const facilitiesColumnsAfterMoreInfo = [
  {
    label: 'Owners',
    value: 'owners',
    showSidebar: true
  },
  {
    label: 'Terrestrial Networks',
    value: 'terrestrials'
  },
  {
    label: 'Subsea Cables',
    value: 'subsea'
  },
  {
    label: 'IXPs',
    value: 'ixps'
  },
  {
    label: 'Known Tenants',
    value: 'sProviders'
  }
]

//==========================
//==========================
//==========================
// FACILITIES COLUMNS END
//==========================
//==========================
//==========================

export const ixpsColumns = [
  {
    label: 'Name',
    value: 'name',
    showSidebar: true,
    showTable: true
  },
  {
    label: 'PeeringDB',
    value: 'ix_id',
    showSidebar: true,
    link: id => `https://www.peeringdb.com/ix/${id}`
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
    label: 'Proto IPv6',
    value: 'proto_ipv6',
    showSidebar: true
  },
  {
    label: 'Proto Multicast',
    value: 'proto_multicast',
    showSidebar: true
  },
  {
    label: 'Proto Unicast',
    value: 'proto_unicast',
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
    label: 'Created at',
    value: 'rgDate',
    showTable: true
  },
  {
    label: 'Updated at',
    value: 'uDate',
    showTable: true
  },
  {
    label: 'Locations',
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
    showTable: true,
    showSidebar: true
  },
  {
    label: 'Logo',
    value: 'logo',
    showTable: true
  },
  {
    label: 'PeeringDB',
    value: 'ooid',
    showSidebar: true,
    link: id => `https://www.peeringdb.com/org/${id}`
  },
  {
    label: 'ASN',
    value: 'asn',
    showSidebar: true
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
  },
  {
    label: 'Created at',
    value: 'rgDate',
    showTable: true
  },
  {
    label: 'Updated at',
    value: 'uDate',
    showTable: true
  }
]
