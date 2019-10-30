import $axios from '../axios'

export const getSelectionData = async id => {
  if (!id) throw "YOU'RE MISSING THE ID PARAMETER"
  const res = await $axios.get(`/cable/byid/${id}`)
  return res
}

export const getFacility = async id => {
  if (!id) throw "YOU'RE MISSING THE ID PARAMETER"
  const res = await $axios.get(`/facility/byid/${id}`)
  return res
}
