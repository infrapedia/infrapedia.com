import { mapConfig } from '../../config/mapConfig'
import { CURRENT_MAP_FILTER, MAP_FOCUS_ON } from '../../store/actionTypes/map'

export default function highlightCurrentCable({ dark, cable, map, commit }) {
  if (!cable || !map || !commit || typeof dark == 'undefined') {
    throw {
      message: `highlightCable.js module line 7. \n
        expected 'cable' to be an Object reference to currentSelection, found:${typeof cable};\n
        expected 'map' to be an Object reference to Mapbox map instance, found: ${typeof map}.\n
        expected 'commit' to be an Object reference to 'this.$store.commit', found: ${typeof commit}.
        expected 'dark' to be an Object reference to 'this.$store.state.isDark', found: ${typeof dark}.`
    }
  }

  const unselectedColor = dark ? 'rgba(50,50,50,0.35)' : 'rgba(23,23,23, 0.2)'

  // I need to change the ID property to be matched dynamically for the colors-change to work
  const filter = mapConfig.highlightFeatureState
  filter[1][2] = cable.id
  // Cables need to be kinda less visible when one is selected
  filter[3] = unselectedColor

  map.setPaintProperty(mapConfig.cables, 'line-color', filter)

  // There's no need to show the facilities clusters if you want to see a specific cable
  // map.setLayoutProperty(mapConfig.facilitiesCount, 'visibility', 'none')
  // map.setLayoutProperty(mapConfig.facilitiesClusters, 'visibility', 'none')
  // map.setLayoutProperty(mapConfig.facilitiesSinglePoints, 'visibility', 'none')

  // Keeping record of the selection and map current filter
  commit(`${CURRENT_MAP_FILTER}`, ['==', ['get', '_id'], cable._id])
  commit(`${MAP_FOCUS_ON}`, {
    type: 'cable',
    id: cable._id,
    name: cable.name
  })
}
