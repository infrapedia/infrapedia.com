export function fCollectionFormat(features) {
  return {
    type: 'FeatureCollection',
    features: Array.isArray(features) ? features : []
  }
}
