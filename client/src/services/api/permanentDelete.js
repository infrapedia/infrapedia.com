import $axios from '../axios'
import apiConfig from '../../config/apiConfig'
// eslint-disable-next-line
var url

export const deleteCablePermanently = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cables/permanentdelete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const deleteIxpPermanently = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/ixps/permanentdelete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const deleteClsPermanently = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/cls/permanentdelete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const deleteGroupPermanently = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/networks/permanentdelete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const deleteFacilityPermanently = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/facilities/permanentdelete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const deleteOrgPermanently = async ({ user_id, _id }) => {
  url = `${apiConfig.url}/auth/organization/permanentdelete/${_id}`
  const res = await $axios.delete(url, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}
