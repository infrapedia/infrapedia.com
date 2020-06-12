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

    if (focus && focus.id && focus.type) {
      queryString = `${queryString}&name=${focus.name ? focus.name : ''}&type=${
        focus.type
      }&id=${focus.id}`
    }

    setCookie(
      queryCookieName,
      `${queryString}&sharedView=true`,
      daysTillExpiration
    )
  } catch (err) {
    console.error('setBoundsCookie.js err', err, JSON.stringify(err))
  }
}
