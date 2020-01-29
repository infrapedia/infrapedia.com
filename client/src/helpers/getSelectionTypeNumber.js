const types = [
  {
    value: 1,
    t: ['submarine', 'cable']
  },
  {
    value: 2,
    t: ['cls']
  },
  {
    value: 3,
    t: ['fac', 'facility', 'datacenters', 'data centers']
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
  {
    value: 7,
    t: ['org', 'organizations']
  }
]

export const getSelectionTypeNumber = type => {
  for (let t of types) {
    if (t.t.includes(type)) return t.value
    else continue
  }
}
