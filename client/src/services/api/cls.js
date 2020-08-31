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
  country,
  user_id,
  tags
}) => {
  url = `${apiConfig.url}/auth/cls/add`
  form = new FormData()

  form.append('name', name)
  form.append('country', country)
  form.append('state', state)
  form.append('slug', slug)

  if (geom) {
    form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  } else form.append('geom', '')

  if (cables.length) {
    cables.forEach((c, i) => {
      form.append(`cables[${i}]`, c._id ? c._id : c)
    })
  } else form.append('cables', [])

  if (tags && tags.length) {
    tags.forEach((t, i) => {
      form.append(`tags[${i}]`, t)
    })
  } else form.append('tags', [])

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const editCLS = async ({
  name,
  cables,
  geom,
  state,
  slug,
  user_id,
  _id,
  country,
  tags
}) => {
  url = `${apiConfig.url}/auth/cls/edit`
  form = new FormData()

  form.append('_id', _id)
  form.append('name', name)
  form.append('state', state)
  form.append('slug', slug)
  form.append('country', country)

  if (tags && tags.length) {
    tags.forEach((t, i) => {
      form.append(`tags[${i}]`, t)
    })
  } else form.append('tags', [])

  if (geom) {
    form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  } else form.append('geom', '')

  if (cables.length) {
    cables.forEach((c, i) => {
      form.append(`cables[${i}]`, c._id ? c._id : c)
    })
  } else form.append('cables', [])

  const res = await $axios.put(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const getClss = async ({ user_id, page }) => {
  url = `${apiConfig.url}/auth/cls/all?p=${page}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const deleteCls = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cls/delete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const viewClsOwner = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cls/owner/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const viewCls = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/cls/view/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const viewClsBBox = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/cls/box/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const searchCls = async ({ user_id, s, psz, sortBy }) => {
  url = `${apiConfig.url}/cls/search?s=${s}&sortBy=${sortBy}`
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

export const getClsGeom = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/cls/geom/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const getClsGeoms = async ({ user_id, ids }) => {
  url = `${apiConfig.url}/cls/geoms`
  form = new FormData()

  if (ids && ids.length) {
    ids.forEach((id, i) => {
      form.append(`ids[${i}]`, id)
    })
  } else form.append('ids', '')

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const clsUpdateCable = async ({ user_id, _id, cable_id }) => {
  url = `${apiConfig.url}/cls/update/cable`
  form = new FormData()

  form.append('cls', _id)
  form.append('cable', cable_id)
  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const clsRemoveCable = async ({ user_id, _id, cable_id }) => {
  url = `${apiConfig.url}/cls/remove/cable`
  form = new FormData()

  form.append('cls', _id)
  form.append('cable', cable_id)
  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const clsListConnectedToCable = async ({ user_id, cable_id }) => {
  url = `${apiConfig.url}/cls/list/connected/${cable_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}
