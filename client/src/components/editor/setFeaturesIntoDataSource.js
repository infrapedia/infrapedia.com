import { fCollectionFormat } from '../../helpers/featureCollection'
// import { editorMapConfig } from '../../config/editorMapConfig'

export function setFeaturesIntoDrawnDataSource({
  map,
  reset,
  feature,
  list = [],
  isCustomMap = true
}) {
  if (reset) {
    map.getSource('drawn-features').setData(fCollectionFormat())
    return
  }

  console.log(feature)
  // TODO: NEED TO CHECK EVERY CATEGORY COLOR, BEFORE STYLING THE CORRESPONDING LAYER
  if (isCustomMap) {
    const featureType =
      feature && feature.geometry && feature.geometry.type
        ? feature.geometry.type
        : list[0].geometry.type
        ? list[0].geometry.type
        : false
    const categoryColor =
      feature && feature.properties && feature.properties.category
        ? feature.properties.category.color
        : list[0].properties.category
        ? list[0].properties.category.color
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

      const styleLayer = async type => {
        map.on('load', function() {
          let layerName = `drawn-${type}-layer`
          if (layerName && categoryColor) {
            map.setPaintProperty(layerName, colorProp, categoryColor)
          }
        })
      }
      styleLayer(layerType)
    }
  }

  {
    let sourceName = 'drawn-features'
    let source = map.getSource(sourceName)

    if (source) {
      if (map.isSourceLoaded(sourceName)) {
        source.setData(fCollectionFormat(list))
      }
    } else {
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
    map.getSource('nondrawn-features').setData(fCollectionFormat())
    return
  }
  const sourceName = 'nondrawn-features'
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
