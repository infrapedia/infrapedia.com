import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

export const getMarketPlaceList = async () => {
  const res = await $axios.get(`${apiConfig.url}/marketplace/list`)
  return res
}
