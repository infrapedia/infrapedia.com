import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
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
  form.append('geom', geom)
  if (cables.length) {
    cables.forEach((a, i) => {
      form.append(`cables[${i}]`, a)
    })
  } else form.append('cables', [])

  const res = await $axios.post(url, form, {
    headers: { user_id }
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
  form.append('geom', geom)
  if (cables.length) {
    cables.forEach((a, i) => {
      form.append(`cables[${i}]`, a)
    })
  } else form.append('cables', [])

  const res = await $axios.put(url, form, {
    headers: { user_id }
  })

  return res
}

export const getClss = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/cls/all`
  const res = await $axios.get(url, {
    headers: { user_id }
  })

  return res
}

export const deleteCls = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cls/delete/${_id}`
  const res = await $axios.delete(url, {
    headers: { user_id }
  })

  return res
}

export const viewCls = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cls/owner/${_id}`
  const res = await $axios.get(url, {
    headers: { user_id }
  })
  return res
}
