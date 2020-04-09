/**
 *
 * @param { ctx } Object - Reference to the vue this context
 * @param { map } Object - Map Reference
 */
async function boundsChange({ map }) {
  if (!map) {
    throw {
      message: `boundsChange.js module line 9. \n
        expected 'ctx' to be an Object reference to vue .this instance, found:${typeof ctx};\n
        expected 'map' to be an Object reference to Mapbox map instance, found: ${typeof map}.`
    }
  }

  const pitch = map.getPitch()
  const bounds = map.getBounds()
  const bearing = map.getBearing()
  const center = map.cameraForBounds(bounds, {
    padding: { top: 10, bottom: 25, left: 15, right: 5 }
  })

  if (!bounds && !center) return
  try {
    if (!this.focus) {
      await this.$router.replace(
        `?neLng=${bounds._ne.lng}&neLat=${bounds._ne.lat}&swLng=${
          bounds._sw.lng
        }&swLat=${bounds._sw.lat}&zoom=${center.zoom}&bearing=${bearing ||
          0}&pitch=${pitch}&centerLng=${center.center.lng}&centerLat=${
          center.center.lat
        }`
      )
    } else {
      const { id, type, name } = this.focus

      if (!this.$router.fullPath.contains('/api')) {
        if (id && type) {
          await this.$router.replace(
            `?neLng=${bounds._ne.lng}&neLat=${bounds._ne.lat}&swLng=${
              bounds._sw.lng
            }&swLat=${bounds._sw.lat}&zoom=${center.zoom}&bearing=${bearing ||
              center.bearing ||
              0}&pitch=${pitch}&centerLng=${center.center.lng}&centerLat=${
              center.center.lat
            }&name=${name}&type=${type}&id=${id}`
          )
        }
      }
    }
  } catch {
    // Ignore
  }
}

export default boundsChange
