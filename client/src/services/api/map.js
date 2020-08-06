import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
import { fCollectionFormat } from '../../helpers/featureCollection'

// eslint-disable-next-line
var url
var form

export const mapStatistics = async query => {
  url = `${apiConfig.url}/mps?${query}`
  const res = await $axios.get(url, {
    withCredentials: false
  })
  return res
}

export const getMyMap = async ({ user_id }) => {
  url = `${apiConfig.url}/auth/map/mymap`
  const res = await $axios.get(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const setMyMap = async ({
  subdomain,
  googleID,
  facilities,
  cls,
  owners,
  techEmail,
  techPhone,
  saleEmail,
  salePhone,
  address,
  subsea,
  terrestrials,
  logo,
  geom,
  ixps,
  config,
  user_id
}) => {
  url = `${apiConfig.url}/auth/map/mymap`
  form = new FormData()

  form.append('googleID', googleID)
  form.append('subdomain', subdomain)
  form.append('techEmail', techEmail)
  form.append('techPhone', techPhone)
  form.append('saleEmail', saleEmail)
  form.append('salePhone', salePhone)
  form.append('config', JSON.stringify(config))
  form.append('logos', logo.length > 0 ? logo[0] : '')
  form.append('draw', JSON.stringify(fCollectionFormat(geom)))

  if (facilities && facilities.length > 0) {
    facilities.forEach((fac, i) => form.append(`facilities[${i}]`, fac._id))
  } else form.append('facilities', [])

  if (owners && owners.length > 0) {
    owners.forEach((owner, i) => form.append(`owners[${i}]`, owner._id))
  } else form.append('owners', [])

  if (ixps && ixps.length > 0) {
    ixps.forEach((ixp, i) => form.append(`ixps[${i}]`, ixp._id))
  } else form.append('ixps', [])

  if (cls && cls.length > 0) {
    cls.forEach((cls, i) => form.append(`cls[${i}]`, cls._id))
  } else form.append('cls', [])

  if (subsea && subsea.length > 0) {
    subsea.forEach((subsea, i) => form.append(`subsea[${i}]`, subsea._id))
  } else form.append('subsea', [])

  if (terrestrials && terrestrials.length > 0) {
    terrestrials.forEach((terrestrial, i) =>
      form.append(`terrestrials[${i}]`, terrestrial._id)
    )
  } else form.append('terrestrials', [])

  if (address && address.length > 0) {
    address.forEach((address, i) => {
      form.append(`address[${i}]`, JSON.stringify(address))
    })
  } else form.append('address', [])

  const res = await $axios.post(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export async function setupMyMapIxps(sub) {
  url = `${apiConfig.url}/map/ixps/${sub}`
  const res = await $axios.get(url)
  return res
}

export async function setupMyMapFacs(sub) {
  url = `${apiConfig.url}/map/facilities/${sub}`
  const res = await $axios.get(url)
  return res
}

export async function setupMyMapCLS(sub) {
  url = `${apiConfig.url}/map/cls/${sub}`
  const res = await $axios.get(url)
  return res
}

export async function setupMyMapDraw(sub) {
  url = `${apiConfig.url}/map/draw/${sub}`
  const res = await $axios.get(url)
  return res
}

export async function setupMyMapCables(sub) {
  url = `${apiConfig.url}/map/cables/${sub}`
  const res = await $axios.get(url)
  return res
}

export async function setupMyMapSubdomain(sub) {
  url = `${apiConfig.url}/map/setinfo/${sub}`
  const res = await $axios.get(url)
  return res
}

export const setupMyMapArchives = async subdomain => {
  url = `${apiConfig.url}/map/ixps/${subdomain}`
  const res = await Promise.all([
    setupMyMapCLS(subdomain),
    setupMyMapIxps(subdomain),
    setupMyMapFacs(subdomain),
    setupMyMapCables(subdomain),
    setupMyMapDraw(subdomain),
    setupMyMapSubdomain(subdomain)
  ])
  return res
}
