/* eslint-disable no-unreachable */
import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
// eslint-disable-next-line
var url
var form

export const createNetwork = async ({
  cls,
  name,
  // ixps,
  cables,
  user_id,
  websites,
  facilities,
  organizations,
  tags,
  references
}) => {
  url = `${apiConfig.url}/auth/network/add`

  form = new FormData()
  form.append('name', name)

  if (websites.length) {
    websites.forEach((a, i) => {
      form.append(`websites[${i}]`, a)
    })
  } else form.append('websites', [])

  if (organizations.length) {
    organizations.forEach((o, i) => {
      form.append(`organizations[${i}]`, o._id)
    })
  } else form.append('organizations', [])

  if (facilities.length) {
    facilities.forEach((f, i) => {
      form.append(`facilities[${i}]`, f._id)
    })
  } else form.append('facilities', [])

  // if (ixps.length) {
  //   ixps.forEach((a, i) => {
  //     form.append(`ixps[${i}]`, a)
  //   })
  // } else form.append('ixps', [])

  if (cls.length) {
    cls.forEach((c, i) => {
      form.append(`cls[${i}]`, c._id)
    })
  } else form.append('cls', [])

  if (cables.length) {
    cables.forEach((c, i) => {
      form.append(`cables[${i}]`, c._id)
    })
  } else form.append('cables', [])

  if (tags && tags.length) {
    tags.forEach((t, i) => {
      form.append(`tags[${i}]`, t)
    })
  } else form.append('tags', [])

  if (references && references.length) {
    const rels = references[0].options.map(opt => opt.relation)
    form.append('references', rels ? JSON.stringify(rels) : '')
  }

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const editNetwork = async ({
  name,
  _id,
  cls,
  // ixps,
  cables,
  user_id,
  websites,
  facilities,
  organizations,
  tags,
  references
}) => {
  url = `${apiConfig.url}/auth/network/edit`
  form = new FormData()
  form.append('_id', _id)
  form.append('name', name)

  if (websites.length) {
    websites.forEach((a, i) => {
      form.append(`websites[${i}]`, a)
    })
  } else form.append('websites', [])

  if (organizations.length) {
    organizations.forEach((o, i) => {
      form.append(`organizations[${i}]`, o._id)
    })
  } else form.append('organizations', [])

  if (facilities.length) {
    facilities.forEach((f, i) => {
      form.append(`facilities[${i}]`, f._id ? f._id : f)
    })
  } else form.append('facilities', [])

  // if (ixps.length) {
  //   ixps.forEach((a, i) => {
  //     form.append(`ixps[${i}]`, a)
  //   })
  // } else form.append('ixps', [])

  if (cls.length) {
    cls.forEach((c, i) => {
      form.append(`cls[${i}]`, c._id ? c._id : c)
    })
  } else form.append('cls', [])

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

  if (references && references.length) {
    const rels = references[0].options.map(opt => opt.relation)
    form.append('references', rels ? JSON.stringify(rels) : '')
  }

  const res = await $axios.put(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const getNetworks = async ({ user_id, page }) => {
  url = `${apiConfig.url}/auth/network/all?p=${page}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const deleteNetwork = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/network/delete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const viewNetworkOwner = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/network/owner/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const viewNetwork = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/network/view/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const searchNetwork = async ({ user_id, s }) => {
  url = `${apiConfig.url}/network/search?s=${s}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}
