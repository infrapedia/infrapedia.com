import { mapConfig } from '../../config/mapConfig'
import {
  CURRENT_MAP_FILTER,
  MAP_FOCUS_ON,
  MAP_BOUNDS,
  EASE_POINT
} from '../../store/actionTypes/map'
import { TOGGLE_SIDEBAR } from '../../store/actionTypes'

function removeFacsHighlight(map) {
  map.setPaintProperty(
    mapConfig.facilities,
    'fill-extrusion-color',
    mapConfig.facsPaintConfig['fill-extrusion-color']
  )
}

function disableCurrentHighlight({
  handleBoundsChange,
  closesSidebar,
  focusType,
  commit,
  map
}) {
  if (!focusType) return
  commit(`${CURRENT_MAP_FILTER}`, mapConfig.filter.all)
  switch (focusType.toLowerCase()) {
    case 'cls':
      map.setPaintProperty(
        mapConfig.cls,
        'circle-color',
        mapConfig.clsPaintConfig['circle-color']
      )
      break
    case 'facilities':
      removeFacsHighlight(map)
      break
    case 'facility':
      removeFacsHighlight(map)
      break
    case 'ixps':
      map.setPaintProperty(
        mapConfig.ixps,
        'circle-color',
        mapConfig.ixpsPaintConfig['circle-color']
      )
      break
    default:
      // Changing cables colors and line-width back to normal
      map.setPaintProperty(
        mapConfig.cables,
        'line-color',
        mapConfig.cablesPaintConfig['line-color']
      )
      map.setPaintProperty(
        mapConfig.cables,
        'line-width',
        mapConfig.cablesPaintConfig['line-width']
      )
      break
  }

  if (closesSidebar) {
    commit(`${TOGGLE_SIDEBAR}`, false)
    commit(`${MAP_FOCUS_ON}`, null)
    commit(`${EASE_POINT}`, false)
    commit(`${MAP_BOUNDS}`, [])
    handleBoundsChange()
  }
}

export default disableCurrentHighlight
