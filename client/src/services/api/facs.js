import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
import { fCollectionFormat } from '../../helpers/featureCollection'

// eslint-disable-next-line
var url
var form

export const searchFacilities = async ({ s, user_id, psz }) => {
  url = `${apiConfig.url}/auth/facilities/search?s=${s}`
  if (psz) {
    url = url + '&psz=1'
  }
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const viewFacility = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/facilities/view/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const viewFacilityBBox = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/facilities/box/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const getFacilityGeom = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/facilities/geom/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const getFacilitiesGeom = async ({ user_id, ids }) => {
  url = `${apiConfig.url}/facilities/geoms`
  form = new FormData()

  if (ids && ids.length) {
    ids.forEach((id, i) => {
      form.append(`ids[${i}]`, id)
    })
  } else form.append('ids', '')

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const getFacilities = async ({ user_id, page }) => {
  url = `${apiConfig.url}/auth/facilities/all?p=${page}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const viewFacilityOwner = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/facilities/owner/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const createFacility = async ({
  user_id,
  ixps,
  name,
  website,
  geom,
  tags,
  t,
  building,
  startDate,
  address
}) => {
  url = `${apiConfig.url}/auth/facilities/add`
  form = new FormData()

  form.append('name', name)
  form.append('website', website)
  form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  form.append('t', t)
  form.append('startDate', startDate)
  form.append('building', building)

  if (ixps.length > 0) {
    ixps.forEach((ixp, i) => {
      form.append(`ixps[${i}]`, ixp._id)
    })
  } else form.append('ixps', [])

  if (address.length > 0) {
    address.forEach((a, i) => {
      form.append(`address[${i}]`, JSON.stringify(a))
    })
  } else form.append('address', [])

  if (tags.length > 0) {
    tags.forEach((tag, i) => {
      form.append(`tags[${i}]`, tag)
    })
  } else form.append('tags', tags)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const editFacility = async ({
  user_id,
  _id,
  ixps,
  name,
  website,
  geom,
  tags,
  t,
  building,
  StartDate,
  address
}) => {
  url = `${apiConfig.url}/auth/facilities/edit`
  form = new FormData()

  form.append('_id', _id)
  form.append('name', name)
  form.append('website', website)
  form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  form.append('t', t)
  form.append('StartDate', StartDate)
  form.append('building', building)

  if (ixps.length > 0) {
    ixps.forEach((ixp, i) => {
      form.append(`ixps[${i}]`, ixp._id)
    })
  } else form.append('ixps', [])

  if (address.length > 0) {
    address.forEach((a, i) => {
      form.append(`address[${i}]`, JSON.stringify(a))
    })
  } else form.append('address', [])

  if (tags.length > 0) {
    tags.forEach((tag, i) => {
      form.append(`tags[${i}]`, tag)
    })
  } else form.append('tags', tags)

  const res = await $axios.put(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}
