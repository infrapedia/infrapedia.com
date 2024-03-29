import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
import { fCollectionFormat } from '../../helpers/featureCollection'

// eslint-disable-next-line
var url
var form

export const searchIxps = async ({ s, user_id, psz, sortBy, page }) => {
  url = `${apiConfig.url}/ixps/search?s=${s}&sortBy=${sortBy}&page=${page}`
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

export const viewIxps = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/ixps/view/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const viewIxpsBBox = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/ixps/box/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const getIxpsGeom = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/ixps/geom/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const getIxpsGeoms = async ({ user_id, ids }) => {
  url = `${apiConfig.url}/ixps/geoms`
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

export const getIxps = async ({ user_id, page }) => {
  url = `${apiConfig.url}/auth/ixps/all?p=${page}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const viewIXPOwner = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/ixps/owner/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const createIXP = async ({
  user_id,
  name,
  tags,
  nameLong,
  policyEmail,
  policyPhone,
  proto_ipv6,
  geom,
  owners,
  techPhone,
  techEmail,
  media,
  ix_id,
  facilities,
  proto_multicast,
  proto_unicast
}) => {
  url = `${apiConfig.url}/auth/ixps/add`
  form = new FormData()

  form.append('name', name)
  form.append('ix_id', ix_id)
  form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  form.append('nameLong', nameLong)
  form.append('policyEmail', policyEmail)
  form.append('policyPhone', policyPhone)
  form.append('proto_unicast', proto_unicast)
  form.append('proto_multicast', proto_multicast)
  form.append('proto_ipv6', proto_ipv6)
  form.append('techEmail', techEmail)
  form.append('techPhone', techPhone)
  form.append('media', media)

  if (tags.length > 0) {
    tags.forEach((tag, i) => {
      form.append(`tags[${i}]`, tag)
    })
  } else form.append('tags', tags)

  if (facilities && facilities.length > 0) {
    facilities.forEach((fac, i) => {
      form.append(`facilities[${i}]`, fac._id)
    })
  } else form.append('facilities', [])

  if (owners && owners.length > 0) {
    owners.forEach((owner, i) => {
      form.append(`owners[${i}]`, owner._id)
    })
  } else form.append('owners', [])

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const editIXP = async ({
  user_id,
  name,
  _id,
  tags,
  geom,
  nameLong,
  policyEmail,
  policyPhone,
  proto_ipv6,
  techPhone,
  techEmail,
  media,
  facilities,
  owners,
  ix_id,
  proto_multicast,
  proto_unicast
}) => {
  url = `${apiConfig.url}/auth/ixps/edit`
  form = new FormData()

  form.append('_id', _id)
  form.append('name', name)
  form.append('ix_id', ix_id)
  form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  form.append('nameLong', nameLong)
  form.append('policyEmail', policyEmail)
  form.append('policyPhone', policyPhone)
  form.append('proto_unicast', proto_unicast)
  form.append('proto_multicast', proto_multicast)
  form.append('proto_ipv6', proto_ipv6)
  form.append('techEmail', techEmail)
  form.append('techPhone', techPhone)
  form.append('media', media)

  if (tags.length > 0) {
    tags.forEach((tag, i) => {
      form.append(`tags[${i}]`, tag)
    })
  } else form.append('tags', tags)

  if (facilities && facilities.length > 0) {
    facilities.forEach((fac, i) => {
      form.append(`facilities[${i}]`, fac._id)
    })
  } else form.append('facilities', [])

  if (owners && owners.length > 0) {
    owners.forEach((owner, i) => {
      form.append(`owners[${i}]`, owner._id)
    })
  } else form.append('owners', [])

  const res = await $axios.put(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const getIxpInterconnections = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/ixps/clusterfacilityconnection/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const deleteIXP = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/ixps/delete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const checkIxpPeeringDBId = async ({ _id, user_id }) => {
  url = `${apiConfig.url}/ixps/checkpeeringdb?p=${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}
