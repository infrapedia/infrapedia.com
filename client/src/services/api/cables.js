import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
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
  geometry
}) => {
  url = `${apiConfig.url}/auth/cables/add`
  form = new FormData()

  form.append('name', name)
  form.append('systemLength', systemLength)
  form.append('activationDateTime', activationDateTime)
  form.append('urls', urls) // Array
  form.append('terrestrial', terrestrial) // Boolean
  form.append('capacityTBPS', capacityTBPS)
  form.append('fiberPairs', fiberPairs)
  form.append('facilities', facilities)
  form.append('notes', notes)
  form.append('cls', cls)
  form.append('geometry', geometry)

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
  geometry
}) => {
  url = `${apiConfig.url}/auth/cables/edit`
  form = new FormData()

  form.append('_id', _id)
  form.append('name', name)
  form.append('systemLength', systemLength)
  form.append('activationDateTime', activationDateTime)
  form.append('urls', urls) // Array
  form.append('terrestrial', terrestrial) // Bool
  form.append('capacityTBPS', capacityTBPS)
  form.append('fiberPairs', fiberPairs)
  form.append('facilities', facilities)
  form.append('notes', notes)
  form.append('cls', cls)
  form.append('geometry', geometry)

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

export const viewCls = async ({ user_id, _id }) => {
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
