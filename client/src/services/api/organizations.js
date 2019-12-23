import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
// eslint-disable-next-line
var url
var form

export const createOrganization = async ({ name, notes, address, user_id }) => {
  url = `${apiConfig.url}/auth/organization/add`

  form = new FormData()
  form.append('name', name)
  form.append('notes', notes)
  form.append('address', address)

  const res = await $axios.post(apiConfig.url, form, {
    headers: { user_id }
  })

  return res
}

export const editOrganization = async ({
  name,
  _id,
  notes,
  address,
  user_id
}) => {
  url = `${apiConfig.url}/auth/organization/edit`
  form = new FormData()
  form.append('_id', _id)
  form.append('name', name)
  form.append('notes', notes)
  form.append('address', address)

  const res = await $axios.post(apiConfig.url, form, {
    headers: { user_id }
  })

  return res
}

export const getOrganizations = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/organization/all`
  const res = await $axios.get(apiConfig.url, {
    headers: { user_id }
  })

  return res
}

export const deleteOrganization = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/organization/delete/${_id}`
  const res = await $axios.delete(apiConfig.url, {
    headers: { user_id }
  })

  return res
}
