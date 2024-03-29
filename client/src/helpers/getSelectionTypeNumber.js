const types = [
  {
    value: 1,
    t: ['submarine', 'cable', 'subsea', 'terrestrial-network', 'subsea-cable']
  },
  {
    value: 2,
    t: ['cls']
  },
  {
    value: 3,
    t: [
      'fac',
      'facility',
      'facilities',
      'facs',
      'datacenters',
      'data centers',
      'data-center'
    ]
  },
  {
    value: 4,
    t: ['ixp', 'ixps']
  },
  {
    value: 5,
    t: []
  },
  {
    value: 6,
    t: ['net', 'networks', 'network']
  },
  // 'owners'
  {
    value: 7,
    t: ['org', 'organizations', 'organization']
  }
]

export function getSelectionTypeNumber(type) {
  for (let t of types) {
    if (t.t.includes(type)) return t.value
    else continue
  }
}
