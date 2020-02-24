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
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}

export const viewFacility = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/facilities/view/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })
  return res
}

export const viewFacilityBBox = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/facilities/box/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })
  return res
}

export const getFacilityGeom = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/facilities/geom/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
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
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}
