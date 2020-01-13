import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
import { fCollectionFormat } from '../../helpers/featureCollection'

// eslint-disable-next-line
var url
var form

export const createCls = async ({
  name,
  cables,
  geom,
  state,
  slug,
  user_id
}) => {
  url = `${apiConfig.url}/auth/cls/add`
  form = new FormData()

  form.append('name', name)
  form.append('state', state)
  form.append('slug', slug)

  if (geom) {
    form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  } else form.append('geom', '')

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

export const editCls = async ({
  name,
  cables,
  geom,
  state,
  slug,
  user_id,
  _id
}) => {
  url = `${apiConfig.url}/auth/cls/edit`
  form = new FormData()

  form.append('_id', _id)
  form.append('name', name)
  form.append('state', state)
  form.append('slug', slug)

  if (geom) {
    form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  } else form.append('geom', '')

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

export const getClss = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/cls/all`
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

export const deleteCls = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cls/delete/${_id}`
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

export const viewClsOwner = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cls/owner/${_id}`
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

export const viewCls = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/cls/view/${_id}`
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

export const viewClsBBox = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/cls/box/${_id}`
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
