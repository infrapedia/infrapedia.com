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
  references,
  asn = '',
  info_ipv6 = '',
  info_multicast = '',
  prefixes4 = '',
  info_ratio = '',
  info_scope = '',
  info_traffic = '',
  info_type = '',
  info_unicast = '',
  irr_as_set = '',
  looking_glass = '',
  policy_contrats = '',
  policy_general = '',
  policy_locations = '',
  policy_ratio = '',
  policy_url = '',
  route_server = ''
}) => {
  url = `${apiConfig.url}/auth/network/add`

  form = new FormData()
  form.append('name', name)
  form.append('asn', asn)
  form.append('info_ipv6', info_ipv6)
  form.append('info_multicast', info_multicast)
  form.append('info_ratio', info_ratio)
  form.append('info_unicast', info_unicast)
  form.append('info_type', info_type)
  form.append('info_scope', info_scope)
  form.append('info_traffic', info_traffic)
  form.append('prefixes4', prefixes4)
  form.append('irr_as_set', irr_as_set)
  form.append('looking_glass', looking_glass)
  form.append('policy_contrats', policy_contrats)
  form.append('policy_general', policy_general)
  form.append('policy_locations', policy_locations)
  form.append('policy_ratio', policy_ratio)
  form.append('policy_url', policy_url)
  form.append('route_server', route_server)

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
  references,
  asn = '',
  info_ipv6 = '',
  info_multicast = '',
  prefixes4 = '',
  info_ratio = '',
  info_scope = '',
  info_traffic = '',
  info_type = '',
  info_unicast = '',
  irr_as_set = '',
  looking_glass = '',
  policy_contrats = '',
  policy_general = '',
  policy_locations = '',
  policy_ratio = '',
  policy_url = '',
  route_server = ''
}) => {
  url = `${apiConfig.url}/auth/network/edit`
  form = new FormData()
  form.append('_id', _id)
  form.append('name', name)
  form.append('asn', asn)
  form.append('info_ipv6', info_ipv6)
  form.append('info_multicast', info_multicast)
  form.append('info_ratio', info_ratio)
  form.append('info_unicast', info_unicast)
  form.append('info_type', info_type)
  form.append('info_scope', info_scope)
  form.append('info_traffic', info_traffic)
  form.append('prefixes4', prefixes4)
  form.append('irr_as_set', irr_as_set)
  form.append('looking_glass', looking_glass)
  form.append('policy_contrats', policy_contrats)
  form.append('policy_general', policy_general)
  form.append('policy_locations', policy_locations)
  form.append('policy_ratio', policy_ratio)
  form.append('policy_url', policy_url)
  form.append('route_server', route_server)

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

export const searchNetwork = async ({ user_id, s, psz }) => {
  url = `${apiConfig.url}/network/search?s=${s}`
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
