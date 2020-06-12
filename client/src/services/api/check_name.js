import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

// eslint-disable-next-line
var url
var form

export async function checkCableNameExistence({ name, user_id }) {
  url = `${apiConfig.url}/cables/checkname?n=${name}`
  const res = await $axios.get(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })

  return res
}

export async function checkClsNameExistence({ name, user_id }) {
  url = `${apiConfig.url}/cls/checkname?n=${name}`
  const res = await $axios.get(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export async function checkIxpsNameExistence({ name, user_id }) {
  url = `${apiConfig.url}/ixps/checkname?n=${name}`
  const res = await $axios.get(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export async function checkNetworkNameExistence({ name, user_id }) {
  url = `${apiConfig.url}/network/checkname?n=${name}`
  const res = await $axios.get(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export async function checkOrganizationNameExistence({ name, user_id }) {
  url = `${apiConfig.url}/organization/checkname?n=${name}`
  const res = await $axios.get(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export async function checkFacilityNameExistence({ name, user_id }) {
  url = `${apiConfig.url}/facilities/checkname?n=${name}`
  const res = await $axios.get(url, form, {
    withCredentials: true,
    headers: {
      userid: user_id,
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}
