import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
import { fCollectionFormat } from '../../helpers/featureCollection'

// eslint-disable-next-line
var url
var form

export const searchFacilities = async ({ s, user_id, psz, sortBy, page }) => {
  url = `${apiConfig.url}/auth/facilities/search?s=${s}&sortBy=${sortBy}&page=${page}`
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

export const viewFacility = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/facilities/view/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const viewFacilityBBox = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/facilities/box/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const getFacilityGeom = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/facilities/geom/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const getFacilitiesGeom = async ({ user_id, ids }) => {
  url = `${apiConfig.url}/facilities/geoms`
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

export const getFacilitiesGeomPoints = async ({ user_id, ids }) => {
  url = `${apiConfig.url}/facilities/geomspoints`
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

export const getFacilities = async ({ user_id, page }) => {
  url = `${apiConfig.url}/auth/facilities/all?p=${page}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export const viewFacilityOwner = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/facilities/owner/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const createFacility = async ({
  user_id,
  ixps,
  name,
  website,
  geom,
  tags,
  t,
  owners,
  building,
  StartDate,
  buildingSize,
  grossColocationSize,
  isCarrierNeutral,
  isLoadingDocks,
  pue,
  rackHeight,
  meetMeRooms,
  meetingRooms,
  platform,
  totalPower,
  floorLoadingCapacity,
  utilityConnectionRedundancy,
  maxRackPower,
  mantrap,
  backupPowerDuration,
  backupPowerRedundancy,
  coolingCapacity,
  temperature,
  humidity,
  bulletProffGlass,
  cctv,
  securityGuards,
  biometric,
  spareParts,
  carParking,
  officeSpace,
  stagingRooms,
  breakRooms,
  subsea,
  terrestrials,
  csp,
  sProviders,
  authentication,
  internetAccess,
  address,
  enType
}) => {
  url = `${apiConfig.url}/auth/facilities/add`
  form = new FormData()

  form.append('name', name)
  form.append('buildingSize', buildingSize)
  form.append('grossColocationSize', grossColocationSize)
  form.append('floorLoadingCapacity', floorLoadingCapacity)
  form.append('isCarrierNeutral', isCarrierNeutral)
  form.append('isLoadingDocks', isLoadingDocks)

  form.append('rackHeight', rackHeight)
  form.append('meetMeRooms', meetMeRooms)
  form.append('platform', platform)
  form.append('totalPower', totalPower)
  form.append('pue', pue)
  form.append('utilityConnectionRedundancy', utilityConnectionRedundancy)
  form.append('maxRackPower', maxRackPower)
  form.append('backupPowerDuration', backupPowerDuration)
  form.append('backupPowerRedundancy', backupPowerRedundancy)
  form.append('coolingCapacity', coolingCapacity)
  form.append('temperature', JSON.stringify(temperature))
  form.append('humidity', JSON.stringify(humidity))

  form.append('bulletProffGlass', bulletProffGlass)
  form.append('cctv', cctv)
  form.append('securityGuards', securityGuards)
  form.append('mantrap', mantrap)
  form.append('biometric', biometric)
  form.append('meetingRooms', meetingRooms)
  form.append('breakRooms', breakRooms)
  form.append('carParking', carParking)
  form.append('spareParts', spareParts)
  form.append('stagingRooms', stagingRooms)
  form.append('officeSpace', officeSpace)
  form.append('internetAccess', internetAccess)
  form.append('authentication', authentication)

  form.append('website', website)
  form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  form.append('t', t)
  form.append('StartDate', StartDate)
  form.append('building', building)

  if (ixps.length > 0) {
    ixps.forEach((ixp, i) => {
      form.append(`ixps[${i}]`, ixp._id)
    })
  } else form.append('ixps', [])

  if (owners.length > 0) {
    owners.forEach((ixp, i) => {
      form.append(`owners[${i}]`, ixp._id)
    })
  } else form.append('owners', [])

  if (address && address.fullAddress !== '') {
    form.append('address[0]', JSON.stringify(address))
  } else form.append('address', [])

  if (tags.length > 0) {
    tags.forEach((tag, i) => {
      form.append(`tags[${i}]`, tag)
    })
  } else form.append('tags', [])

  if (sProviders && sProviders.length > 0) {
    sProviders.forEach((sp, i) => {
      form.append(`sProviders[${i}]`, sp._id)
    })
  } else form.append('sProviders', [])

  if (subsea && subsea.length > 0) {
    subsea.forEach((s, i) => {
      form.append(`subsea[${i}]`, s._id)
    })
  } else form.append('subsea', [])

  if (terrestrials && terrestrials.length > 0) {
    terrestrials.forEach((t, i) => {
      form.append(`terrestrials[${i}]`, t._id)
    })
  } else form.append('terrestrials', [])

  if (csp && csp.length > 0) {
    csp.forEach((csp, i) => {
      form.append(`csp[${i}]`, csp._id)
    })
  } else form.append('csp', [])

  enType.forEach((t, i) => {
    form.append(`enType[${i}]`, t)
  })

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const editFacility = async ({
  user_id,
  _id,
  ixps,
  name,
  website,
  geom,
  tags,
  t,
  owners,
  building,
  StartDate,
  address,
  buildingSize,
  grossColocationSize,
  isCarrierNeutral,
  isLoadingDocks,
  pue,
  rackHeight,
  meetMeRooms,
  meetingRooms,
  platform,
  totalPower,
  floorLoadingCapacity,
  utilityConnectionRedundancy,
  maxRackPower,
  mantrap,
  backupPowerDuration,
  backupPowerRedundancy,
  coolingCapacity,
  temperature,
  humidity,
  bulletProffGlass,
  cctv,
  securityGuards,
  biometric,
  spareParts,
  carParking,
  officeSpace,
  stagingRooms,
  breakRooms,
  enType,
  internetAccess,
  subsea,
  terrestrials,
  csp,
  sProviders,
  authentication
}) => {
  url = `${apiConfig.url}/auth/facilities/edit`
  form = new FormData()

  form.append('_id', _id)
  form.append('name', name)

  form.append('buildingSize', buildingSize)
  form.append('grossColocationSize', grossColocationSize)
  form.append('floorLoadingCapacity', floorLoadingCapacity)
  form.append('isCarrierNeutral', isCarrierNeutral)
  form.append('isLoadingDocks', isLoadingDocks)

  form.append('rackHeight', rackHeight)
  form.append('meetMeRooms', meetMeRooms)
  form.append('platform', platform)
  form.append('totalPower', totalPower)
  form.append('pue', pue)
  form.append('utilityConnectionRedundancy', utilityConnectionRedundancy)
  form.append('maxRackPower', maxRackPower)
  form.append('backupPowerDuration', backupPowerDuration)
  form.append('backupPowerRedundancy', backupPowerRedundancy)
  form.append('coolingCapacity', coolingCapacity)
  form.append('temperature', JSON.stringify(temperature))
  form.append('humidity', JSON.stringify(humidity))
  form.append('authentication', authentication)

  form.append('bulletProffGlass', bulletProffGlass)
  form.append('cctv', cctv)
  form.append('securityGuards', securityGuards)
  form.append('mantrap', mantrap)
  form.append('biometric', biometric)
  form.append('meetingRooms', meetingRooms)
  form.append('breakRooms', breakRooms)
  form.append('carParking', carParking)
  form.append('spareParts', spareParts)
  form.append('stagingRooms', stagingRooms)
  form.append('officeSpace', officeSpace)
  form.append('internetAccess', internetAccess)

  form.append('website', website)
  form.append('geom', JSON.stringify(fCollectionFormat(geom)))
  form.append('t', t)
  form.append('StartDate', StartDate)
  form.append('building', building)

  if (ixps.length > 0) {
    ixps.forEach((ixp, i) => {
      form.append(`ixps[${i}]`, ixp._id)
    })
  } else form.append('ixps', [])

  if (owners.length > 0) {
    owners.forEach((ixp, i) => {
      form.append(`owners[${i}]`, ixp._id)
    })
  } else form.append('owners', [])

  if (address && address.fullAddress !== '') {
    form.append('address[0]', JSON.stringify(address))
  } else form.append('address', [])

  if (tags.length > 0) {
    tags.forEach((tag, i) => {
      form.append(`tags[${i}]`, tag)
    })
  } else form.append('tags', [])

  if (sProviders && sProviders.length > 0) {
    sProviders.forEach((sp, i) => {
      form.append(`sProviders[${i}]`, sp._id)
    })
  } else form.append('sProviders', [])

  if (subsea && subsea.length > 0) {
    subsea.forEach((s, i) => {
      form.append(`subsea[${i}]`, s._id)
    })
  } else form.append('subsea', [])

  if (terrestrials && terrestrials.length > 0) {
    terrestrials.forEach((t, i) => {
      form.append(`terrestrials[${i}]`, t._id)
    })
  } else form.append('terrestrials', [])

  if (csp && csp.length > 0) {
    csp.forEach((csp, i) => {
      form.append(`csp[${i}]`, csp._id)
    })
  } else form.append('csp', [])

  enType.forEach((t, i) => {
    form.append(`enType[${i}]`, t)
  })

  const res = await $axios.put(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const getFacilityInterconnections = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/facilities/clusterixpconnection/${_id}`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const deleteFacility = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/facilities/delete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}
