import { setCookie } from '../../helpers/cookies'
import { queryCookieName } from '../../config/sharedViewCookieName'

/**
 *
 * @param { ctx } Object - Reference to the vue this context
 * @param { map } Object - Map Reference
 */
async function boundsChange({ map }) {
  if (!map) {
    throw {
      message: `boundsChange.js module line 9. \n
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
    if (!window.localStorage.getItem('__easePointData')) {
      if (!this.focus) {
        setCookie(
          queryCookieName,
          `?neLng=${bounds._ne.lng}&neLat=${bounds._ne.lat}&swLng=${
            bounds._sw.lng
          }&swLat=${bounds._sw.lat}&zoom=${center.zoom}&bearing=${bearing ||
            0}&pitch=${pitch}&centerLng=${center.center.lng}&centerLat=${
            center.center.lat
          }&sharedView=true`,
          1
        )
      } else {
        const { id, type, name } = this.focus

        if (id && type) {
          setCookie(
            queryCookieName,
            `?neLng=${bounds._ne.lng}&neLat=${bounds._ne.lat}&swLng=${
              bounds._sw.lng
            }&swLat=${bounds._sw.lat}&zoom=${center.zoom}&bearing=${bearing ||
              center.bearing ||
              0}&pitch=${pitch}&centerLng=${center.center.lng}&centerLat=${
              center.center.lat
            }&name=${name || ''}&type=${type}&id=${id}&sharedView=true`,
            1
          )
        }
      }
    }

    // if (
    //   this.$route.query.sharedView &&
    //   window.localStorage.getItem('__easePointDataLoaded') == 'true'
    // ) {
    //   this.$router.replace(this.$route.path)
    //   deleteCookie(queryCookieName)
    // }
  } catch (err) {
    console.error(err, 'boundsChange.js err')
  }
}

export default boundsChange
