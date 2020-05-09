export default function sortAlphabetically(a, b, property) {
  const prop = property ? property : 'name'
  if (a[prop] && b[prop]) {
    const aSort = a[prop].toLowerCase()
    const bSort = b[prop].toLowerCase()
    if (aSort < bSort) return -1
    if (aSort > bSort) return 1
  }
  return 0
}
