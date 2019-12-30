import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
// eslint-disable-next-line
var url
var form

export const createNetwork = async ({
  cls,
  name,
  ixps,
  cables,
  user_id,
  websites,
  facilities,
  organizations
}) => {
  url = `${apiConfig.url}/auth/network/add`

  form = new FormData()
  form.append('name', name)

  if (websites.length) {
    websites.forEach((a, i) => {
      form.append(`websites[${i}]`, a)
    })
  } else form.append('websites', [])

  if (organizations.length) {
    organizations.forEach((a, i) => {
      form.append(`organizations[${i}]`, a)
    })
  } else form.append('organizations', [])

  if (facilities.length) {
    facilities.forEach((a, i) => {
      form.append(`facilities[${i}]`, a)
    })
  } else form.append('facilities', [])

  if (ixps.length) {
    ixps.forEach((a, i) => {
      form.append(`ixps[${i}]`, a)
    })
  } else form.append('ixps', [])

  if (cls.length) {
    cls.forEach((a, i) => {
      form.append(`cls[${i}]`, a)
    })
  } else form.append('cls', [])

  if (cables.length) {
    cables.forEach((a, i) => {
      form.append(`cables[${i}]`, a)
    })
  } else form.append('cables', [])

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

export const editNetwork = async ({
  name,
  _id,
  cls,
  ixps,
  cables,
  user_id,
  websites,
  facilities,
  organizations
}) => {
  url = `${apiConfig.url}/auth/network/edit`
  form = new FormData()
  form.append('_id', _id)
  form.append('name', name)

  if (websites.length) {
    websites.forEach((a, i) => {
      form.append(`websites[${i}]`, a)
    })
  } else form.append('websites', JSON.stringify([]))

  if (organizations.length) {
    organizations.forEach((a, i) => {
      form.append(`organizations[${i}]`, a)
    })
  } else form.append('organizations', [])

  if (facilities.length) {
    facilities.forEach((a, i) => {
      form.append(`facilities[${i}]`, a)
    })
  } else form.append('facilities', [])

  if (ixps.length) {
    ixps.forEach((a, i) => {
      form.append(`ixps[${i}]`, a)
    })
  } else form.append('ixps', [])

  if (cls.length) {
    cls.forEach((a, i) => {
      form.append(`cls[${i}]`, a)
    })
  } else form.append('cls', [])

  if (cables.length) {
    cables.forEach((a, i) => {
      form.append(`cables[${i}]`, a)
    })
  } else form.append('cables', [])

  const res = await $axios.put(url, form, {
    withCredentials: true,
    headers: {
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}

export const getNetworks = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/network/all`
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

export const deleteNetwork = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/network/delete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      user_id,
      Authorization:
        'Bearer ' + window.localStorage.getItem('auth.token-session')
    }
  })

  return res
}

export const viewNetwork = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/network/owner/${_id}`
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
