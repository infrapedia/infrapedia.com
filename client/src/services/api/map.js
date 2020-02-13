import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

// eslint-disable-next-line
var url
// var form

export const mapStatistics = async query => {
  url = `${apiConfig.url}/mps?${query}`
  const res = await $axios.get(url, {
    withCredentials: false
  })
  return res
}
