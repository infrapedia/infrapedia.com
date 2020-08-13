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

function categoryDataChange(categories, feature) {
  return categories.map(cat => {
    if (cat._id == feature.properties.category) {
      if (
        feature.geometry.type == 'Point' &&
        cat.types.includes('custom points')
      ) {
        ////////////////////////////////
        //////----  POINTS ----////////
        //////////////////////////////
        const data = cat.data['custom points'].map(it => it.__editorID)
        if (!data.includes(feature.properties.__editorID)) {
          cat.data['custom points'].push(feature)
        } else {
          for (let i = 0; i < data.length; i++) {
            if (
              cat.data['custom points'][i].__editorID ==
              feature.properties.__editorID
            ) {
              cat.data['custom points'][i] = { ...feature }
              break
            }
          }
        }
      } else if (
        feature.geometry.type == 'Polygon' &&
        cat.types.includes('custom polygons')
      ) {
        ////////////////////////////////
        //////---  POLYGONS ---////////
        //////////////////////////////
        const data = cat.data['custom polygons'].map(it => it.__editorID)
        if (!data.includes(feature.properties.__editorID)) {
          cat.data['custom polygons'].push(feature)
        } else {
          for (let i = 0; i < data.length; i++) {
            if (
              cat.data['custom polygons'][i].__editorID ==
              feature.properties.__editorID
            ) {
              cat.data['custom polygons'][i] = { ...feature }
              break
            }
          }
        }
      } else if (
        feature.geometry.type == 'LineString' &&
        cat.types.includes('custom lines')
      ) {
        ////////////////////////////////
        ///////----  LINES ----////////
        //////////////////////////////
        const data = cat.data['custom lines'].map(it => it.__editorID)
        if (!data.includes(feature.properties.__editorID)) {
          cat.data['custom lines'].push(feature)
        } else {
          for (let i = 0; i < data.length; i++) {
            if (
              cat.data['custom lines'][i].__editorID ==
              feature.properties.__editorID
            ) {
              cat.data['custom lines'][i] = { ...feature }
              break
            }
          }
        }
      }
    }
    return cat
  })
}

export {
  zoomToFeature,
  categoryDataChange,
  setFeaturesIntoDataSource,
  setFeaturesIntoDrawnDataSource
}
