import { mapConfig } from '../../config/mapConfig'
import { CURRENT_MAP_FILTER, MAP_FOCUS_ON } from '../../store/actionTypes/map'

function highlightCurrentCable({ dark, cable, map, commit }) {
  if (!cable || !map || !commit || typeof dark === 'undefined') {
    throw {
      message: `highlightCable.js module line 7. \n
        expected 'cable' to be an Object reference to currentSelection, found:${typeof cable};\n
        expected 'map' to be an Object reference to Mapbox map instance, found: ${typeof map}.\n
        expected 'commit' to be an Object reference to 'this.$store.commit', found: ${typeof commit}.
        expected 'dark' to be an Object reference to 'this.$store.state.isDark', found: ${typeof dark}.`
    }
  }

  const unselectedColor = dark
    ? 'rgba(219, 219, 219, 0.36)'
    : 'rgba(23,23,23, 0.2)'

  // Changing cables line colors
  map.setPaintProperty(
    mapConfig.cableTerrestrial,
    'line-color',
    unselectedColor
  )
  map.setPaintProperty(mapConfig.cableSubsea, 'line-color', unselectedColor)

  // Showing only the selected cable on the highlight layer
  map.setFilter(mapConfig.cableTerrestrialHighlight, [
    '==',
    ['get', '_id'],
    cable._id
  ])
  map.setFilter(mapConfig.cableSubseaHighlight, [
    '==',
    ['get', '_id'],
    cable._id
  ])

  // Keeping record of the selection and map current filter
  commit(`${CURRENT_MAP_FILTER}`, ['==', ['get', '_id'], cable._id])
  commit(`${MAP_FOCUS_ON}`, {
    type: 'cable',
    id: cable._id,
    name: cable.name
  })
}

export default highlightCurrentCable
