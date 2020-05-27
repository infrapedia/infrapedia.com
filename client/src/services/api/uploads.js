import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
// eslint-disable-next-line
var url
var form

export const uploadOrgLogo = async ({ logo, user_id }) => {
  url = `${apiConfig.url}/auth/upload/logo`
  form = new FormData()
  form.append('file', logo)
  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const uploadKmz = async ({ file, user_id }) => {
  url = `${apiConfig.url}/auth/upload/kmz`
  form = new FormData()
  form.append('file', file[0])
  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const kmzLinesToJSON = async ({ link, user_id }) => {
  url = `${apiConfig.url}/auth/kmz/lines/togeojson`
  form = new FormData()
  form.append('link', link)
  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const kmzPointsToJSON = async ({ link, user_id }) => {
  url = `${apiConfig.url}/auth/kmz/points/togeojson`
  form = new FormData()
  form.append('link', link)
  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const editElemnt = async ({ t, file, information, user_id }) => {
  url = `${apiConfig.url}/auth/elements/foredit`
  form = new FormData()

  form.append('t', t)
  form.append('file', file)
  form.append('information', information)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}
