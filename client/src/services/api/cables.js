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
  owners,
  category,
  user_id,
  geom,
  litCapacity,
  tags,
  cc
}) => {
  url = `${apiConfig.url}/auth/cables/add`
  form = new URLSearchParams()

  try {
    form.append('category', category)
    form.append('name', name)
    form.append('systemLength', systemLength)
    form.append('activationDateTime', activationDateTime)

    form.append('capacityTBPS', capacityTBPS)
    form.append('terrestrial', terrestrial) // Bool
    form.append('fiberPairs', fiberPairs)
    form.append('notes', notes)
    form.append('cc', cc)

    if (tags && tags.length) {
      tags.forEach((t, i) => {
        form.append(`tags[${i}]`, t)
      })
    } else form.append('tags', [])

    if (litCapacity && litCapacity.length) {
      litCapacity.forEach((cap, i) => {
        form.append(`litCapacity[${i}]`, JSON.stringify(cap))
      })
    } else form.append('litCapacity', [])

    if (owners.length) {
      owners.forEach((c, i) => {
        form.append(`owners[${i}]`, c._id ? c._id : c)
      })
    } else form.append('owners', [])

    if (urls.length) {
      urls.forEach((url, i) => {
        form.append(`urls[${i}]`, url)
      })
    } else form.append('urls', [])

    if (facilities.length) {
      facilities.forEach((fac, i) => {
        form.append(`facilities[${i}]`, fac._id)
      })
    } else form.append('facilities', [])

    if (geom) {
      form.append('geom', JSON.stringify(fCollectionFormat(geom)))
    } else form.append('geom', '')
  } catch (err) {
    console.error(err)
  }

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: apiConfig.bearer()
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
  owners,
  category,
  user_id,
  geom,
  tags,
  cc,
  litCapacity
}) => {
  url = `${apiConfig.url}/auth/cables/edit`
  form = new URLSearchParams()

  try {
    form.append('_id', _id)
    form.append('name', name)
    form.append('category', category)
    form.append('systemLength', systemLength)
    form.append('activationDateTime', activationDateTime)

    form.append('capacityTBPS', capacityTBPS)
    form.append('terrestrial', terrestrial) // Bool
    form.append('fiberPairs', fiberPairs)
    form.append('notes', notes)
    form.append('cc', cc)

    if (tags && tags.length) {
      tags.forEach((t, i) => {
        form.append(`tags[${i}]`, t)
      })
    } else form.append('tags', [])

    if (litCapacity && litCapacity.length) {
      litCapacity.forEach((cap, i) => {
        form.append(`litCapacity[${i}]`, JSON.stringify(cap))
      })
    } else form.append('litCapacity', [])

    if (owners.length) {
      owners.forEach((c, i) => {
        form.append(`owners[${i}]`, c._id ? c._id : c)
      })
    } else form.append('owners', [])

    if (urls.length) {
      urls.forEach((url, i) => {
        form.append(`urls[${i}]`, url)
      })
    } else form.append('urls', [])

    if (facilities.length) {
      facilities.forEach((fac, i) => {
        form.append(`facilities[${i}]`, fac._id ? fac._id : fac)
      })
    } else form.append('facilities', [])

    if (geom) {
      form.append('geom', JSON.stringify(fCollectionFormat(geom)))
    } else form.append('geom', '')
  } catch (err) {
    console.error(err)
  }

  const res = await $axios.put(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: apiConfig.bearer()
    }
  })

  return res
}

export const getCables = async ({ user_id, page }) => {
  url = `${apiConfig.url}/auth/cables/all?p=${page}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })

  return res
}

export const getCablesShortList = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/cables/shortlist`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })

  return res
}

export const deleteCable = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cables/delete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })

  return res
}

export const viewCableOwner = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cables/owner/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })
  return res
}

export const viewCable = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/cables/view/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })
  return res
}

export const viewCableBBox = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/cables/box/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })
  return res
}

export const searchCables = async ({ user_id, s }) => {
  url = `${apiConfig.url}/cables/search?s=${s}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })
  return res
}

export const getCableGeom = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/cables/geom/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })

  return res
}

export const getCablesGeom = async ({ user_id, ids }) => {
  url = `${apiConfig.url}/cables/geoms`
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
      Authorization: apiConfig.bearer()
    }
  })

  return res
}

export const getTerrestrialNetworks = async ({ user_id, page }) => {
  url = `${apiConfig.url}/auth/cables/terrestrial/all?p=${page}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })

  return res
}

export const getSubseaCables = async ({ user_id, page }) => {
  url = `${apiConfig.url}/auth/cables/subsea/all?p=${page}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: apiConfig.bearer()
    }
  })

  return res
}
