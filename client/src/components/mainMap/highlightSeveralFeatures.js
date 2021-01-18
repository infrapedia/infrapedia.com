export default function highlightSeveralFeatures({ map, elements, layerName }) {
  if (map) {
    for (let id of elements) {
      map.setFeatureState(
        { source: layerName, sourceLayer: layerName, id },
        { active: true }
      )
    }
  }
}

export function disableHighlightSeveralFeatures({ map, ids, layerName }) {
  if (map) {
    for (let id of ids) {
      map.setFeatureState(
        { source: layerName, sourceLayer: layerName, id },
        { active: false }
      )
    }
  }
}
