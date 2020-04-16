export default function getBoundsCoords(coords) {
  function getArrayDepth(value) {
    return Array.isArray(value) ? 1 + Math.max(...value.map(getArrayDepth)) : 0
  }

  return getArrayDepth(coords) > 2
    ? [coords.flat(1)[0], coords.flat(1)[parseInt(coords.length - 1)]]
    : getArrayDepth(coords) >= 1
    ? [coords, coords]
    : coords
}
