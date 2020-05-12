import { mapConfig } from '../../config/mapConfig'
import { CURRENT_MAP_FILTER, MAP_FOCUS_ON } from '../../store/actionTypes/map'
import { TOGGLE_SIDEBAR } from '../../store/actionTypes'

function disableCurrentHighlight({
  handleBoundsChange,
  closesSidebar,
  focus,
  commit,
  map
}) {
  if (
    !handleBoundsChange ||
    !map ||
    !commit ||
    typeof closesSidebar == 'undefined'
  ) {
    throw {
      message: `disableHighlight.js module line 7. \n
        expected 'focus' to be a reference to 'this.handleBoundsChange' function, found:${typeof focus};\n
        expected 'handleBoundsChange' to be a reference to 'this.handleBoundsChange' function, found:${typeof handleBoundsChange};\n
        expected 'map' to be an Object reference to Mapbox map instance, found: ${typeof map}.\n
        expected 'commit' to be an Object reference to 'this.$store.commit', found: ${typeof commit}.
        expected 'closesSidebar' to be a Boolean, found: ${typeof closesSidebar}.`
    }
  }
  // Previous selection id, I need this to set line-width back to normal
  // If it was a cable selection
  const cableid = focus ? focus.id : false

  if (closesSidebar) {
    commit(`${TOGGLE_SIDEBAR}`, false)
    commit(`${MAP_FOCUS_ON}`, null)
    handleBoundsChange()
  }

  commit(`${CURRENT_MAP_FILTER}`, mapConfig.filter.all)

  // Changing cables colors back to normal
  map.setPaintProperty(
    mapConfig.cables,
    'line-color',
    mapConfig.data.layers[0].paint['line-color']
  )

  if (cableid) {
    // Changing cable line-width back to normal
    map.setPaintProperty(mapConfig.cables, 'line-width', [
      'match',
      ['get', 'id'],
      cableid,
      1.62,
      1.62
    ])
  }
}

export default disableCurrentHighlight
