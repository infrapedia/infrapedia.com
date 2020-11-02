import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
import { fCollectionFormat } from '../../helpers/featureCollection'

// eslint-disable-next-line
var url
var form

export async function searchCloudServiceProvider({
  user_id,
  sortBy,
  page,
  psz,
  s
}) {
  url = `${apiConfig.url}/cloud/search?s=${s}&sortBy=${sortBy}&page=${page}`
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

export async function getCloudServiceProviders({ user_id, page }) {
  url = `${apiConfig.url}/auth/cloud/all?p=${page}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export async function viewCloudServiceProviderOwner({ user_id, _id }) {
  url = `${apiConfig.url}/auth/cloud/owner/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export async function viewCloudServiceProvider({ user_id, _id }) {
  url = `${apiConfig.url}/auth/cloud/view/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export async function viewCloudServiceProviderBBox({ user_id, _id }) {
  url = `${apiConfig.url}/cloud/box/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export async function getCloudServiceProviderGeom({ user_id, _id }) {
  url = `${apiConfig.url}/cloud/geom/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export async function createCloudServiceProvider({
  url: website,
  name,
  geom,
  ramps,
  color,
  user_id,
  regions,
  statusUrl,
  knownUsers,
  establishmentYear
}) {
  url = `${apiConfig.url}/auth/cloud/add`
  form = new FormData()

  form.append('name', name)
  form.append('color', color)
  form.append('url', website)
  form.append('statusUrl', statusUrl)
  form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  form.append('establishmentYear', establishmentYear)

  if (knownUsers.length) {
    knownUsers.forEach((usr, i) => {
      form.append(`knownUsers[${i}]`, usr._id ? usr._id : usr)
    })
  } else form.append('knownUsers', [])

  if (regions.length) {
    regions.forEach((usr, i) => {
      form.append(`regions[${i}]`, usr._id ? usr._id : usr)
    })
  } else form.append('regions', [])

  if (ramps.length) {
    ramps.forEach((usr, i) => {
      form.append(`ramps[${i}]`, usr._id ? usr._id : usr)
    })
  } else form.append('ramps', [])

  const res = await $axios.get(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export async function editCloudServiceProvider({
  url: website,
  name,
  _id,
  geom,
  ramps,
  color,
  user_id,
  regions,
  statusUrl,
  knownUsers,
  establishmentYear
}) {
  url = `${apiConfig.url}/auth/cloud/edit`
  form = new FormData()

  form.append('_id', _id)
  form.append('name', name)
  form.append('color', color)
  form.append('url', website)
  form.append('statusUrl', statusUrl)
  form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  form.append('establishmentYear', establishmentYear)

  if (knownUsers.length) {
    knownUsers.forEach((usr, i) => {
      form.append(`knownUsers[${i}]`, usr._id ? usr._id : usr)
    })
  } else form.append('knownUsers', [])

  if (regions.length) {
    regions.forEach((usr, i) => {
      form.append(`regions[${i}]`, usr._id ? usr._id : usr)
    })
  } else form.append('regions', [])

  if (ramps.length) {
    ramps.forEach((usr, i) => {
      form.append(`ramps[${i}]`, usr._id ? usr._id : usr)
    })
  } else form.append('ramps', [])

  const res = await $axios.get(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export async function deleteCloudServiceProvider({ user_id, _id }) {
  url = `${apiConfig.url}/auth/cloud/delete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}
