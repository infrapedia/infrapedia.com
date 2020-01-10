import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

export const getSearch = async s => {
  const res = await $axios.get(`${apiConfig.url}/search/field/?s=${s}`)
  return res
}
