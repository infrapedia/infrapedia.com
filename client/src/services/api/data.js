import $axios from '../axios'

// MAP CABLE SELECTION
export const getSelectionData = async id => {
  if (!id) throw "YOU'RE MISSING THE ID PARAMETER"
  const res = await $axios.get(`/cable/byid/${id}`)
  return res
}

// MAP FACILITY SELECTION - Buildings and dots
export const getFacility = async id => {
  if (!id) throw "YOU'RE MISSING THE ID PARAMETER"
  const res = await $axios.get(`/facility/byid/${id}`)
  return res
}

// NAVBAR OPTIONS GETTERS
export const getPremium = async () => {
  const res = await $axios.get('/org/premium')
  return res
}

export const getSubsea = async () => {
  const res = await $axios.get('/cable/subsea')
  return res
}

export const getDataCenters = async () => {
  const res = await $axios.get('/facility')
  return res
}

export const getIxps = async () => {
  const res = await $axios.get('/ix/withFacility')
  return res
}

export const getNetworks = async () => {
  const res = await $axios.get('/network/withFacility')
  return res
}
