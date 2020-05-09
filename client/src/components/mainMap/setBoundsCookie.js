import { setCookie } from '../../helpers/cookies'
import { queryCookieName } from '../../config/sharedViewCookieName'

/**
 *
 * @param { pitch } Number
 * @param { bounds } Array of coordinates
 * @param { bearing } Number
 * @param { center } Array of coordinates
 * @param { focus } object with id, type and name of the current selection of the map
 */

export default async function setBoundsCookie({
  pitch,
  bounds,
  bearing,
  center,
  focus
}) {
  try {
    let queryString = `?neLng=${bounds._ne.lng}&neLat=${bounds._ne.lat}&swLng=${
      bounds._sw.lng
    }&swLat=${bounds._sw.lat}&zoom=${center.zoom}&bearing=${bearing ||
      0}&pitch=${pitch}&centerLng=${center.center.lng}&centerLat=${
      center.center.lat
    }`
    let daysTillExpiration = 1

    if (!window.localStorage.getItem('__easePointData')) {
      if (focus) {
        const { id, type, name = '' } = focus

        if (id && type) {
          queryString = `
            ${queryString}&name=${name}&type=${type}&id=${id}
          `
        }
      }

      setCookie(
        queryCookieName,
        `${queryString}&sharedView=true`,
        daysTillExpiration
      )
    }
  } catch (err) {
    console.error('setBoundsCookie.js err', err, JSON.stringify(err))
  }
}
