import { mapConfig } from '../../config/mapConfig'
import { CURRENT_MAP_FILTER, MAP_FOCUS_ON } from '../../store/actionTypes/map'

function highlightCable({ id, dark, map }) {
  const unselectedColor = dark ? 'rgba(50,50,50,0.24)' : 'rgba(18,18,18, 0.1)'
  const currentFilter = mapConfig.highlightFeatureState
  // I need to change the ID property to be matched dynamically for the colors-change to work
  currentFilter[1][2] = id
  // Cables need to be kinda less visible when one is selected
  currentFilter[3] = unselectedColor

  map.setPaintProperty(mapConfig.cables, 'line-color', currentFilter)
  map.setPaintProperty(mapConfig.cables, 'line-width', [
    'case',
    ['==', ['get', '_id'], id],
    3,
    ['!=', ['get', '_id'], id],
    1,
    1
  ])
}

function highlightCls({ id, dark, map }) {
  map.setPaintProperty(mapConfig.cls, 'circle-color', [
    'case',
    ['==', ['get', '_id'], id],
    dark ? 'yellow' : 'red',
    ['!=', ['get', '_id'], id],
    '#ffffff',
    '#ffffff'
  ])
}

function highlightFacility({ id, dark, map }) {
  map.setPaintProperty(mapConfig.facilities, 'fill-extrusion-color', [
    'case',
    ['==', ['get', '_id'], id],
    dark ? 'yellow' : 'red',
    ['!=', ['get', '_id'], id],
    '#666666',
    '#666666'
  ])
}

function highlightIXP({ id, dark, map }) {
  map.setPaintProperty(mapConfig.ixps, 'circle-color', [
    'case',
    ['==', ['get', '_id'], id],
    dark ? 'yellow' : 'purple',
    ['!=', ['get', '_id'], id],
    '#b10f0f',
    '#b10f0f'
  ])
}

export default function highlightCurrentSelection({
  id,
  map,
  name,
  dark,
  commit,
  focusType
}) {
  const args = { dark, id, map }
  switch (focusType.toLowerCase()) {
    case 'cls':
      highlightCls(args)
      break
    case 'facilities':
      highlightFacility(args)
      break
    case 'facility':
      highlightFacility(args)
      break
    case 'ixps':
      highlightIXP(args)
      break
    default:
      highlightCable(args)
      break
  }

  // Keeping record of the selection and map current filter
  commit(`${CURRENT_MAP_FILTER}`, ['==', ['get', '_id'], id])
  commit(`${MAP_FOCUS_ON}`, {
    type: focusType,
    id,
    name
  })
}
