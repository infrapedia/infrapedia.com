import bbox from '@turf/bbox'
import {
  setFeaturesIntoDataSource,
  setFeaturesIntoDrawnDataSource
} from './setFeaturesIntoDataSource'

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

export {
  zoomToFeature,
  setFeaturesIntoDataSource,
  setFeaturesIntoDrawnDataSource
}
