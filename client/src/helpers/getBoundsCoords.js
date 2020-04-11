export default function getBoundsCoords(coords) {
  const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
  const checkArr = arr => (Array.isArray(arr) ? arr : coords)

  return coords.reduce(
    (bounds, coord) => bounds.extend(coord),
    new mapboxgl.LngLatBounds(checkArr(coords[0]), checkArr(coords[0]))
  )
}
