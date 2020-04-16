import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

export const getClustersPointsNetworks = async ({ user_id, _id }) => {
  const res = await $axios.get(`${apiConfig.url}/cluster/network/${_id}`, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}

export const getClustersPointsOrgs = async ({ user_id, _id }) => {
  const res = await $axios.get(`${apiConfig.url}/cluster/organization/${_id}`, {
    withCredentials: true,
    headers: {
      userid: user_id,
      Authorization: 'Bearer ' + apiConfig.bearer()
    }
  })
  return res
}
