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

  const unselectedColor = dark ? 'rgba(50,50,50,0.35)' : 'rgba(23,23,23, 0.2)'

  // Cables need to be kinda less visible when one is selected
  map.setPaintProperty(mapConfig.cables, 'line-color', unselectedColor)
  // map.setFeatureState(
  //   {
  //     id: cable._id,
  //     source: mapConfig.cables,
  //     sourceLayer: mapConfig.cables
  //   },
  //   { highlight: true }
  // )
  // map.setPaintProperty(
  //   mapConfig.cables,
  //   'line-color',
  //   mapConfig.highlightFeatureState
  // )

  // There's no need to show the facilities clusters if you want to see a specific cable
  // map.setLayoutProperty(mapConfig.facilitiesCount, 'visibility', 'none')
  // map.setLayoutProperty(mapConfig.facilitiesClusters, 'visibility', 'none')
  // map.setLayoutProperty(mapConfig.facilitiesSinglePoints, 'visibility', 'none')

  // Showing only the selected cable on the highlight layer
  map.setFilter(mapConfig.cablesHighlight, ['==', ['get', '_id'], cable._id])

  // Keeping record of the selection and map current filter
  commit(`${CURRENT_MAP_FILTER}`, ['==', ['get', '_id'], cable._id])
  commit(`${MAP_FOCUS_ON}`, {
    type: 'cable',
    id: cable._id,
    name: cable.name
  })
}

export default highlightCurrentCable
