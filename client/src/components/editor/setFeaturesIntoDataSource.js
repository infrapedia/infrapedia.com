import { fCollectionFormat } from '../../helpers/featureCollection'
// import { editorMapConfig } from '../../config/editorMapConfig'

export function setFeaturesIntoDrawnDataSource({
  feature,
  list,
  map,
  reset,
  isCustomMap = true
}) {
  if (reset) {
    map.getSource('drawn-features').setData(fCollectionFormat())
    return
  }

  if (isCustomMap) {
    const featureType = feature.geometry.type
    const categoryColor = feature.properties.category
      ? feature.properties.category.color
      : null
    let layerType = null
    let colorProp = ''

    switch (featureType.toLowerCase()) {
      case 'point':
        layerType = 'cls'
        colorProp = 'circle-color'
        break
      case 'polygon':
        layerType = 'facilities'
        colorProp = 'fill-extrusion-color'
        break
      default:
        layerType = 'cables'
        colorProp = 'line-color'
        break
    }

    {
      let layerName = `drawn-${layerType}-layer`
      if (layerName && categoryColor) {
        map.setPaintProperty(layerName, colorProp, categoryColor)
      }
    }
  }

  {
    let source = map.getSource('drawn-features')
    if (source) source.setData(fCollectionFormat(list))
  }
}

export function setFeaturesIntoDataSource({ list, map, reset }) {
  if (reset) {
    map.getSource('nondrawn-features').setData(fCollectionFormat())
    return
  }
  const source = map.getSource('drawn-features')
  if (source) source.setData(fCollectionFormat(list))
}
