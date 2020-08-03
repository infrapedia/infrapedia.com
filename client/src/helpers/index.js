import getMetaDataTagsFromSelectionType from './getMetaDataTagsFromType'

function getCategoriesByType({ t, categories }) {
  const result = []
  for (let category of categories) {
    for (let categoryType of category.types) {
      if (t == categoryType) {
        result.push(category)
      }
    }
  }
  return result
}

export { getMetaDataTagsFromSelectionType, getCategoriesByType }
