// BUY REQUEST
import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
import { getFacilitiesGeom, getFacilitiesGeomPoints } from './facs'
import { getCablesGeom } from './cables'
import { getIxpsGeoms } from './ixps'
import { getClsGeoms } from './cls'
import { fCollectionFormat } from '../../helpers/featureCollection'

export const buyRequest = async data => {
  const { type, cable, email, lastname, name, capacity } = data

  const res = await $axios.post(
    'https://mandrillapp.com/api/1.0/messages/send.json',
    JSON.stringify({
      key: process.env.MANDRILL_KEY,
      message: {
        from_email: 'admin@infrapedia.net',
        to: [
          {
            email: 'admin@infrapedia.com',
            type: 'to'
          }
        ],
        headers: {
          'Reply-To': email
        },
        subject: `Infrapedia Buy Request - ${type} ${cable})`,
        text: `Hi, ${name} ${lastname} (${email})
        , you asked to buy an amount of ${capacity} for ${cable}(${type})`
      }
    })
  )

  return res
}

// ISSUE REQUEST

export const issueRequest = async data => {
  const res = await $axios.post(
    'https://mandrillapp.com/api/1.0/messages/send.json',
    JSON.stringify({
      key: process.env.VUE_APP_MANDRILL_KEY,
      message: {
        from_email: 'admin@infrapedia.net',
        to: [
          {
            email: 'admin@infrapedia.com',
            type: 'to'
          }
        ],
        headers: {
          'Reply-To': data.email
        },
        ...data.data
      }
    })
  )

  return res
}

export async function getGeometries(t, ids, userID) {
  let fc = {}
  switch (t) {
    case 'facilities':
      fc = await handleGetFacsGeomPoints(ids, userID)
      break
    case 'cls':
      fc = await handleGetClsGeom(ids, userID)
      break
    case 'ixps':
      fc = await handleGetIxpsGeom(ids, userID)
      break
    default:
      fc = await handleGetCablesGeom(ids, userID)
      break
  }
  return fc
}

export async function handleGetCablesGeom(ids, user_id) {
  const res = await getCablesGeom({
    user_id,
    ids
  })
  return res && res.data && res.data.r ? res.data.r : fCollectionFormat()
}

export async function handleGetFacsGeom(ids, user_id) {
  const res = await getFacilitiesGeom({
    user_id,
    ids
  })
  return res && res.data && res.data.r ? res.data.r : fCollectionFormat()
}

export async function handleGetFacsGeomPoints(ids, user_id) {
  const res = await getFacilitiesGeomPoints({
    user_id,
    ids
  })
  return res && res.data && res.data.r ? res.data.r : fCollectionFormat()
}

export async function handleGetClsGeom(ids, user_id) {
  const res = await getClsGeoms({
    user_id,
    ids
  })
  return res && res.data && res.data.r ? res.data.r : fCollectionFormat()
}

export async function handleGetIxpsGeom(ids, user_id) {
  const res = await getIxpsGeoms({
    user_id,
    ids
  })
  return res && res.data && res.data.r ? res.data.r : fCollectionFormat()
}

export async function getElementIdByType({ type, slug }) {
  const res = await $axios.get(`${apiConfig.url}/${type}/${slug}`)
  return res
}

export async function getElementImgByType({ slug }) {
  const res = await $axios.get(`${apiConfig.url}/elm/map/${slug}.jpg`)
  return res ? res : ''
}
