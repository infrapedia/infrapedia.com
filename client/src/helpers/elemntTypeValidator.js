const allowedCreationTypes = [
  'cls',
  'map',
  'ixp',
  'csp',
  'ixps',
  'organization',
  'subsea cable',
  'facilities',
  'terrestrial-network',
  'network',
  'subsea'
]

export default function elemntTypeValidator(e) {
  return allowedCreationTypes.indexOf(e.toLowerCase()) != -1
}
