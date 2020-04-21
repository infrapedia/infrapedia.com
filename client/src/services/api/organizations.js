import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
// eslint-disable-next-line
var url
var form

export const createOrganization = async ({
  name,
  logo,
  notes,
  link,
  address,
  information,
  user_id
}) => {
  url = `${apiConfig.url}/auth/organization/add`

  form = new FormData()
  form.append('name', name)
  form.append('url', link)
  form.append('notes', notes)
  form.append('information', information)
  form.append('logo', logo)
  if (address.length) {
    address.forEach((a, i) => {
      form.append(`address[${i}]`, JSON.stringify(a))
    })
  } else form.append('address', [])

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const editOrganization = async ({
  name,
  _id,
  logo,
  notes,
  link,
  address,
  information,
  user_id
}) => {
  url = `${apiConfig.url}/auth/organization/edit`
  form = new FormData()
  form.append('_id', _id)
  form.append('name', name)
  form.append('url', link)
  form.append('notes', notes)
  form.append('logo', logo)
  form.append('information', information)
  if (address.length) {
    address.forEach((a, i) => {
      form.append(`address[${i}]`, JSON.stringify(a))
    })
  } else form.append('address', [])

  const res = await $axios.put(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const getOrganizations = async ({ user_id, page }) => {
  url = `${apiConfig.url}/auth/organization/all?p=${page}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const deleteOrganization = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/organization/delete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const viewOrganizationOwner = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/organization/owner/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const viewOrganization = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/organization/view/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const searchOrganization = async ({ user_id, s, psz }) => {
  url = `${apiConfig.url}/organization/search?s=${s}`
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

export const getPartners = async () => {
  url = `${apiConfig.url}/partners`
  const res = await $axios.get(url)
  return res
}

export const getTrustedBy = async () => {
  url = `${apiConfig.url}/istrusted`
  const res = await $axios.get(url)
  return res
}
