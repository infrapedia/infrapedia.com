import { getFacilitiesGeom } from '../services/api/facs'
import { getCablesGeom } from '../services/api/cables'
import { getIxpsGeoms } from '../services/api/ixps'
import { getClsGeoms } from '../services/api/cls'
import { fCollectionFormat } from './featureCollection'

export async function getGeometries(t, ids, userID) {
  let fc = {}
  switch (t) {
    case 'facilities':
      fc = await handleGetFacsGeom(ids, userID)
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
