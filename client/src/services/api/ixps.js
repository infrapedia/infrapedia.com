import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

// eslint-disable-next-line
var url
// var form

export const searchIxps = async ({ s, user_id }) => {
  url = `${apiConfig.url}/auth/ixps/search?s=${s}`
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

export const viewIxps = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/ixps/view/${_id}`
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

export const viewIxpsBBox = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/ixps/box/${_id}`
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
