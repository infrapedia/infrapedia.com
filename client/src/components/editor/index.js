import bbox from '@turf/bbox'
import { fCollectionFormat } from '../../helpers/featureCollection'
import { mapConfig } from '../../config/mapConfig'
import Dictionary from '../../lib/Dictionary'
import { v4 as uuidv4 } from 'uuid'

const sceneDictionary = new Dictionary({
  debug: process.env.NODE_ENV != 'production'
})

function zoomToFeature({ fc, map, type }) {
  if (fc.features.length <= 0) return

  const bounds = bbox(fc)
  const boundsConfig = {
    animate: true,
    speed: 1.75,
    padding: 90,
    pan: {
      duration: 25
    }
  }
  const zoomLevels = {
    facilities: 16.8,
    ixps: 12.8,
    cls: 14.52
  }

  zoomLevels[type] ? (boundsConfig.zoom = zoomLevels[type]) : null
  map.fitBounds(bounds, boundsConfig)
  return map
}

function toggleDarkMode({ dark, map }) {
  map.setStyle(dark ? mapConfig.darkBasemap : mapConfig.default)
  return map
}

function setFeatureEditorID(feat) {
  const feature = { ...feat }
  let id = `${feat.properties.name}.${uuidv4()}`
  feature.editorID = id
  feature.properties.editorID = id
  return feature
}

/**
 *
 * @param { object } map - mapboxgl map reference
 * @param { array } featureList - a list containing all of features in the drawn source
 */
async function updateDrawnFeatureDataSource(map, featureList) {
  if (!map || !featureList) return
  if (featureList.length <= 0) {
    map.getSource('drawn-features').setData(fCollectionFormat())
    return
  }
  const sourceName = 'drawn-features'
  const source = map.getSource(sourceName)

  if (source) source.setData(fCollectionFormat(featureList))
  else {
    setTimeout(
      async () => await updateDrawnFeatureDataSource(map, featureList),
      1200
    )
  }
}

function setFeaturesIntoDataSource({ list, map, reset }) {
  if (reset) {
    map.getSource('nondrawn-features').setData(fCollectionFormat())
    return
  }

  const sourceName = 'nondrawn-features'
  const source = map.getSource(sourceName)

  if (source) source.setData(fCollectionFormat(list))
  else {
    setTimeout(() => setFeaturesIntoDataSource({ list, map, reset }), 1200)
  }
}

export {
  zoomToFeature,
  toggleDarkMode,
  sceneDictionary,
  setFeatureEditorID,
  setFeaturesIntoDataSource,
  updateDrawnFeatureDataSource
}
