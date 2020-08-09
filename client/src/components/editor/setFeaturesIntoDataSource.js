import { fCollectionFormat } from '../../helpers/featureCollection'
import { editorMapConfig } from '../../config/editorMapConfig'

export default function setFeaturesIntoDataSource({
  feature,
  list,
  map,
  reset
}) {
  if (reset) {
    const drawnSources = editorMapConfig.sources.filter(source =>
      source.includes('drawn')
    )
    for (let src of drawnSources) {
      map.getSource(src).setData(fCollectionFormat())
    }
    return
  }

  const featureType = feature.geometry.type
  const categoryColor = feature.properties.category
    ? feature.properties.category.color
    : null
  const features = list.filter(item => item.geometry.type == featureType)
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
    let source = map.getSource('drawn-features')
    if (source) source.setData(fCollectionFormat(features))
  }
  {
    let layerName = `drawn-${layerType}-layer`
    if (layerName && categoryColor) {
      map.setPaintProperty(layerName, colorProp, categoryColor)
    }
  }
}
