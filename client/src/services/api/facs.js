import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

// eslint-disable-next-line
var url
var form

export const searchFacilities = async ({ s, user_id }) => {
  url = `${apiConfig.url}/auth/facilities/search?s=${s}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
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
      Authorization: apiConfig.bearer()
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
      Authorization: apiConfig.bearer()
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
      Authorization: apiConfig.bearer()
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
      Authorization: apiConfig.bearer()
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
      Authorization: apiConfig.bearer()
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
      Authorization: apiConfig.bearer()
    }
  })
  return res
}

export const editFacility = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/facilities/edit`
  form = new FormData()

  const res = await $axios.put(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })
  return res
}

export const createFacility = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/facilities/edit`
  form = new FormData()

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })
  return res
}
