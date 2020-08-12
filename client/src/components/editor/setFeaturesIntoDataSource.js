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
    const featureType =
      feature && feature.geometry && feature.geometry.type
        ? feature.geometry.type
        : false
    const categoryColor =
      feature && feature.properties && feature.properties.category
        ? feature.properties.category.color
        : null
    let layerType = null
    let colorProp = ''

    if (featureType && categoryColor) {
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
  }

  {
    let sourceName = 'drawn-features'
    let source = map.getSource(sourceName)
    if (source && map.loaded()) {
      if (map.isSourceLoaded(sourceName)) {
        source.setData(fCollectionFormat(list))
      }
    } else {
      // map.addSource(sourceName, {
      //   type: 'geojson',
      //   data: fCollectionFormat(list)
      // })
      setTimeout(
        () =>
          setFeaturesIntoDrawnDataSource({
            feature,
            list,
            map,
            reset,
            isCustomMap: true
          }),
        320
      )
    }
  }
}

export function setFeaturesIntoDataSource({ list, map, reset }) {
  if (reset) {
    map.getSource('drawn-features').setData(fCollectionFormat())
    return
  }
  const sourceName = 'drawn-features'
  const source = map.getSource(sourceName)
  if (source && map.loaded()) {
    if (map.isSourceLoaded(sourceName)) {
      source.setData(fCollectionFormat(list))
    }
  } else {
    // map.addSource(sourceName, {
    //   type: 'geojson',
    //   data: fCollectionFormat(list)
    // })
    setTimeout(() => setFeaturesIntoDataSource({ list, map, reset }), 320)
  }
}
