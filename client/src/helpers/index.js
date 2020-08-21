export function getCategoriesByType({ t, categories }) {
  const result = []
  for (let key in categories) {
    if (categories[key].types.includes(t)) {
      result.push(categories[key])
    }
  }
  return result
}
