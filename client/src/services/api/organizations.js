import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
// eslint-disable-next-line
var url
var form

export const createOrganization = async ({
  name,
  logo,
  notes,
  address,
  user_id
}) => {
  url = `${apiConfig.url}/auth/organization/add`

  form = new FormData()
  form.append('name', name)
  form.append('notes', notes)
  form.append('logo', logo)
  if (address.length) {
    address.forEach((a, i) => {
      form.append(`address[${i}]`, JSON.stringify(a))
    })
  } else form.append('address', [])

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

export const editOrganization = async ({
  name,
  _id,
  logo,
  notes,
  address,
  user_id
}) => {
  url = `${apiConfig.url}/auth/organization/edit`
  form = new FormData()
  form.append('_id', _id)
  form.append('name', name)
  form.append('notes', notes)
  form.append('logo', logo)
  if (address.length) {
    address.forEach((a, i) => {
      form.append(`address[${i}]`, JSON.stringify(a))
    })
  } else form.append('address', [])

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

export const getOrganizations = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/organization/all`
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

export const deleteOrganization = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/organization/delete/${_id}`
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

export const viewOrganization = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/organization/owner/${_id}`
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
