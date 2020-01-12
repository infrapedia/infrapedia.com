export const clsColumns = [
  'name',
  'state', // Bool
  'slug',
  'geom',
  'cables' // (Array)
]

export const cablesColumns = [
  'name',
  'system_length',
  'activationDateTime',
  'urls', // (Array)
  // 'terrestrial', // (Bool)
  'capacity_tbps',
  'fiberPairs',
  'notes'
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

export const getCurrentSelectionCols = type => {
  if (!type) return
  // if (!type) {
  //   throw { message: 'You are missing the type param. sidebarColumns - line 2' }
  // }

  let col = []

  if (type === 'cls') {
    col = [...clsColumns]
  } else if (type.includes('fac')) {
    col = [...facsColumns]
  } else if (type.includes('cable') || type.includes('submarine')) {
    col = [...cablesColumns]
  } else if (type.includes('ixp')) {
    col = [...ixpsColumns]
  } else if (type.includes('org')) {
    col = [...orgsColumns]
  } else if (type.includes('net')) {
    col = [...netColumns]
  }
  return col
}
