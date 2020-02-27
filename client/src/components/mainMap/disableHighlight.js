import { mapConfig } from '../../config/mapConfig'
import { CURRENT_MAP_FILTER, MAP_FOCUS_ON } from '../../store/actionTypes/map'
import { TOGGLE_SIDEBAR } from '../../store/actionTypes'

function disableCurrentHighlight({
  handleBoundsChange,
  closesSidebar,
  commit,
  map
}) {
  if (
    !handleBoundsChange ||
    !map ||
    !commit ||
    typeof closesSidebar === 'undefined'
  ) {
    throw {
      message: `disableHighlight.js module line 7. \n
        expected 'handleBoundsChange' to be a reference to 'this.handleBoundsChange' function, found:${typeof handleBoundsChange};\n
        expected 'map' to be an Object reference to Mapbox map instance, found: ${typeof map}.\n
        expected 'commit' to be an Object reference to 'this.$store.commit', found: ${typeof commit}.
        expected 'closesSidebar' to be a Boolean, found: ${typeof closesSidebar}.`
    }
  }

  if (closesSidebar) {
    commit(`${TOGGLE_SIDEBAR}`, false)
    commit(`${MAP_FOCUS_ON}`, null)
    handleBoundsChange()
  }

  commit(`${CURRENT_MAP_FILTER}`, mapConfig.filter.all)

  // Removing highlight layer filter
  map.setFilter(mapConfig.cableSubseaHighlight, ['in', '_id', false])
  map.setFilter(mapConfig.cableTerrestrialHighlight, ['in', '_id', false])

  // Changing cables colors back to normal
  map.setPaintProperty(
    mapConfig.cableTerrestrial,
    'line-color',
    mapConfig.data.layers[0].paint['line-color']
  )
  map.setPaintProperty(
    mapConfig.cableSubsea,
    'line-color',
    mapConfig.data.layers[3].paint['line-color']
  )
}

export default disableCurrentHighlight
