import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
import { fCollectionFormat } from '../../helpers/featureCollection'
// eslint-disable-next-line
var url
var form

export const createCable = async ({
  name,
  systemLength,
  activationDateTime,
  urls,
  terrestrial,
  capacityTBPS,
  fiberPairs,
  facilities,
  notes,
  cls,
  user_id,
  geom
}) => {
  url = `${apiConfig.url}/auth/cables/add`
  form = new FormData()

  form.append('name', name)
  form.append('systemLength', systemLength)
  form.append('activationDateTime', activationDateTime)

  form.append('capacityTBPS', capacityTBPS)
  form.append('terrestrial', terrestrial) // Bool
  form.append('fiberPairs', fiberPairs)
  form.append('notes', notes)

  if (cls.length) {
    cls.forEach((c, i) => {
      form.append(`cls[${i}]`, c)
    })
  } else form.append('cls', JSON.stringify([]))

  if (urls.length) {
    urls.forEach((url, i) => {
      form.append(`urls[${i}]`, url)
    })
  } else form.append('urls', JSON.stringify([]))

  if (facilities.length) {
    facilities.forEach((fac, i) => {
      form.append(`facilities[${i}]`, fac)
    })
  } else form.append('facilities', '')

  if (geom) {
    form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  } else form.append('geom', '')

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

export const editCable = async ({
  _id,
  name,
  systemLength,
  activationDateTime,
  urls,
  terrestrial,
  capacityTBPS,
  fiberPairs,
  facilities,
  notes,
  cls,
  user_id,
  geom
}) => {
  url = `${apiConfig.url}/auth/cables/edit`
  form = new FormData()

  form.append('_id', _id)
  form.append('name', name)
  form.append('systemLength', systemLength)
  form.append('activationDateTime', activationDateTime)

  form.append('capacityTBPS', capacityTBPS)
  form.append('terrestrial', terrestrial) // Bool
  form.append('fiberPairs', fiberPairs)
  form.append('notes', notes)

  if (cls.length) {
    cls.forEach((c, i) => {
      form.append(`cls[${i}]`, c)
    })
  } else form.append('cls', JSON.stringify([]))

  if (urls.length) {
    urls.forEach((url, i) => {
      form.append(`urls[${i}]`, url)
    })
  } else form.append('urls', JSON.stringify([]))

  if (facilities.length) {
    facilities.forEach((fac, i) => {
      form.append(`facilities[${i}]`, fac)
    })
  } else form.append('facilities', '')

  if (geom) {
    form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  } else form.append('geom', '')

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

export const getCables = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/cables/all`
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

export const deleteCable = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cables/delete/${_id}`
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

export const viewCable = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cables/owner/${_id}`
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
