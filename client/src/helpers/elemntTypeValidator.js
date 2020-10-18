const allowedCreationTypes = [
  'cls',
  'map',
  'ixp',
  'csp',
  'ixps',
  'organization',
  'subsea cable',
  'facilities',
  'network'
]

export default function elemntTypeValidator(e) {
  return allowedCreationTypes.indexOf(e.toLowerCase()) != -1
}
