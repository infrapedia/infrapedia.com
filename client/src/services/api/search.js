import $axios from '../axios'
import apiConfig from '../../config/apiConfig'

export const getSearch = async s => {
  const res = await $axios.get(`${apiConfig.url}/search/field/?s=${s}`)
  return res
}

export const getSearchByCables = async s => {
  const res = await $axios.get(`${apiConfig.url}/search/field/cables/?s=${s}`)
  return res
}

export const getSearchByCls = async s => {
  const res = await $axios.get(`${apiConfig.url}/search/field/cls/?s=${s}`)
  return res
}

export const getSearchByNet = async s => {
  const res = await $axios.get(`${apiConfig.url}/search/field/networks/?s=${s}`)
  return res
}

export const getSearchByOrg = async s => {
  const res = await $axios.get(`${apiConfig.url}/search/field/orgs?s=${s}`)
  return res
}

export const getSearchByFacility = async s => {
  const res = await $axios.get(`${apiConfig.url}/facilities/search?s=${s}`)
  return res
}

export const getSearchByIxps = async s => {
  const res = await $axios.get(`${apiConfig.url}/ixps/search?s=${s}`)
  return res
}
