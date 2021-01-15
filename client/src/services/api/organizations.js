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
  user_id,
  asn,
  ooid
}) => {
  url = `${apiConfig.url}/auth/organization/add`

  form = new FormData()
  form.append('name', name)
  form.append('url', link)
  form.append('ooid', ooid)
  form.append('notes', notes)
  form.append('information', information)
  form.append('logo', logo)

  if (address.length) {
    address.forEach((a, i) => {
      form.append(`address[${i}]`, JSON.stringify(a))
    })
  } else form.append('address', [])

  if (asn && asn.length) {
    asn.forEach((a, i) => {
      form.append(`asn[${i}]`, a)
    })
  } else form.append('asn', [])

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
  user_id,
  asn,
  ooid
}) => {
  url = `${apiConfig.url}/auth/organization/edit`
  form = new FormData()
  form.append('_id', _id)
  form.append('name', name)
  form.append('url', link)
  form.append('notes', notes)
  form.append('logo', logo)
  form.append('ooid', ooid)
  form.append('information', information)

  if (address.length) {
    address.forEach((a, i) => {
      form.append(`address[${i}]`, JSON.stringify(a))
    })
  } else form.append('address', [])

  if (asn && asn.length) {
    asn.forEach((a, i) => {
      form.append(`asn[${i}]`, a)
    })
  } else form.append('asn', [])

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

export const searchOrganization = async ({ user_id, s, psz, sortBy, page }) => {
  url = `${apiConfig.url}/organization/search?s=${s}&sortBy=${sortBy}&page=${page}`
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

export const getOrgLinkedElements = async args => {
  const results = []
  const promises = [
    getOrgFacilitesAssociations,
    getOrgFacilityTenantsAssociations,
    getOrgSubseaAssociations,
    getOrgKnownUsersAssociations,
    getOrgClsAssociations,
    getOrgIxpsAssociations,
    getOrgTerrestrialsAssociations
  ]

  for (let promise of promises) {
    results.push(await promise(args))
  }
  return results.map(r => r.data)
}

export const getOrgFacilityTenantsAssociations = async ({ user_id, id }) => {
  url = `${apiConfig.url}/organization/facilities/ku/${id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const setOrgFacilityTenantsAssociations = async ({
  user_id,
  org_id,
  _id
}) => {
  url = `${apiConfig.url}/auth/updateknownuserFacility`
  form = new FormData()

  form.append('idFacility', _id)
  form.append('idorg', org_id)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const removeOrgFacilityTenantsAssociations = async ({
  user_id,
  org_id,
  _id
}) => {
  url = `${apiConfig.url}/auth/updateknownuserFacility`

  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    },
    data: {
      idFacility: _id,
      idorg: org_id
    }
  })
  return res
}

export const getOrgClsAssociations = async ({ user_id, id }) => {
  url = `${apiConfig.url}/organization/cls/${id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const setOrgClsAssociations = async ({ user_id, org_id, _id }) => {
  url = `${apiConfig.url}/auth/updateOrganizationCLS`
  form = new FormData()

  form.append('idcls', _id)
  form.append('idorg', org_id)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const removeOrgClsAssociations = async ({ user_id, org_id, _id }) => {
  url = `${apiConfig.url}/auth/updateOrganizationCLS`

  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    },
    data: {
      idcls: _id,
      idorg: org_id
    }
  })
  return res
}

export const getOrgSubseaAssociations = async ({ user_id, id }) => {
  url = `${apiConfig.url}/organization/subseas/${id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const setOrgSubseaAssociations = async ({ user_id, org_id, _id }) => {
  url = `${apiConfig.url}/auth/updateOrganizationCable`
  form = new FormData()

  form.append('idcable', _id)
  form.append('idorg', org_id)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const removeOrgSubseaAssociations = async ({ user_id, org_id, _id }) => {
  url = `${apiConfig.url}/auth/updateOrganizationCable`

  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    },
    data: {
      idcable: _id,
      idorg: org_id
    }
  })
  return res
}

export const getOrgTerrestrialsAssociations = async ({ user_id, id }) => {
  url = `${apiConfig.url}/organization/terrestrials/${id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const setOrgTerrestrialsAssociations = async ({
  user_id,
  org_id,
  _id
}) => {
  url = `${apiConfig.url}/auth/updateOrganizationCable`
  form = new FormData()

  form.append('idcable', _id)
  form.append('idorg', org_id)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const removeOrgTerrestrialsAssociations = async ({
  user_id,
  org_id,
  _id
}) => {
  url = `${apiConfig.url}/auth/updateOrganizationCable`

  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    },
    data: {
      idcable: _id,
      idorg: org_id
    }
  })
  return res
}

export const getOrgIxpsAssociations = async ({ user_id, id }) => {
  url = `${apiConfig.url}/organization/ixps/${id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const setOrgIxpsAssociations = async ({ user_id, org_id, _id }) => {
  url = `${apiConfig.url}/auth/updateOrganizationIXP`
  form = new FormData()

  form.append('idixp', _id)
  form.append('idorg', org_id)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const removeOrgIxpsAssociations = async ({ user_id, org_id, _id }) => {
  url = `${apiConfig.url}/auth/updateOrganizationIXP`

  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    },
    data: {
      idixp: _id,
      idorg: org_id
    }
  })
  return res
}

export const getOrgFacilitesAssociations = async ({ user_id, id }) => {
  url = `${apiConfig.url}/organization/facilities/${id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const setOrgFacilitiesAssociations = async ({
  user_id,
  org_id,
  _id
}) => {
  url = `${apiConfig.url}/auth/updateOrganizationFacility`
  form = new FormData()

  form.append('idfacility', _id)
  form.append('idorg', org_id)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const removeOrgFacilitiesAssociations = async ({
  user_id,
  org_id,
  _id
}) => {
  url = `${apiConfig.url}/auth/updateOrganizationFacility`

  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    },
    data: {
      idfacility: _id,
      idorg: org_id
    }
  })
  return res
}

export const getOrgKnownUsersAssociations = async ({ user_id, id }) => {
  url = `${apiConfig.url}/organization/subseas/ku/${id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const setOrgKnownUsersAssociations = async ({
  user_id,
  org_id,
  _id
}) => {
  url = `${apiConfig.url}/auth/updateknownuserCable`
  form = new FormData()

  form.append('idcable', _id)
  form.append('idorg', org_id)

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const removeOrgKnownUsersAssociations = async ({
  user_id,
  org_id,
  _id
}) => {
  url = `${apiConfig.url}/auth/updateknownuserCable`

  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    },
    data: {
      idcable: _id,
      idorg: org_id
    }
  })
  return res
}

export const getOrgGroupsAssociations = async ({ user_id, id }) => {
  url = `${apiConfig.url}/organization/groups/${id}`
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

export const getOrgClusters = async ({ id }) => {
  url = `${apiConfig.url}/cluster/organization/${id}`
  const res = await $axios.get(url)
  return res
}

export const checkOrganizationPeeringDBId = async ({ _id, user_id }) => {
  url = `${apiConfig.url}/organization/checkpeeringdb?p=${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}
