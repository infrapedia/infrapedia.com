import $axios from '../axios'

// // MAP CABLE SELECTION
// export const getSelectionData = async id => {
//   if (!id) throw ID_PARAM_ERROR
//   const res = await $axios.get(`/cable/byid/${id}`)
//   return res
// }

// // MAP FACILITY SELECTION - Buildings and dots
// export const getFacility = async id => {
//   if (!id) throw ID_PARAM_ERROR
//   const res = await $axios.get(`/facility/byid/${id}`)
//   return res
// }

// // NAVBAR OPTIONS GETTERS
// export const getSubsea = async () => {
//   const res = await $axios.get('/cable/subsea')
//   return res
// }

// export const getDataCenters = async () => {
//   const res = await $axios.get('/facility')
//   return res
// }

// export const getIxps = async () => {
//   const res = await $axios.get('/ix/withFacility')
//   return res
// }

// export const getNetworks = async () => {
//   const res = await $axios.get('/network/withFacility')
//   return res
// }
// // ---------------- END ---------------------

// // --- NAVBAR PREMIUM LIST ITEM SELECTION --- START
// export const getPremiumSelectedBounds = async id => {
//   if (!id) throw ID_PARAM_ERROR
//   const res = await $axios.get(`/org/childbbox/${id}`)
//   return res
// }

// export const getPremiumSelectedFeatures = async id => {
//   if (!id) throw ID_PARAM_ERROR
//   const res = await $axios.get(`/org/childPoints/${id}`)
//   return res
// }

// export const getOrganization = async id => {
//   if (!id) throw ID_PARAM_ERROR
//   const res = await $axios.get(`/cable/byorg/${id}`)
//   return res
// }
// // ---------------- END ---------------------

// // --- NAVBAR SUBMARINE CABLE SELECTION --- START
// export const getSubseaCableBounds = async id => {
//   if (!id) throw ID_PARAM_ERROR
//   const res = await $axios.get(`/cable/bboxbyid/${id}`)
//   return res
// }

// // ---------------- END ---------------------

// // --- NAVBAR DATA CENTER SELECTION --- START
// export const getFacilityBounds = async id => {
//   if (!id) throw ID_PARAM_ERROR
//   const res = await $axios.get(`/facility/bboxbyid/${id}`)
//   return res
// }

// // ---------------- END ---------------------

// export const getFacilityPoints = async ({ type, id }) => {
//   // Expected types are: ix, net.
//   // Ix for Ixps items and net for Networks items
//   const res = await $axios.get(`/facility/geojson/by${type}id/${id}`)
//   return res
// }

// // PLACES

// export const getSearchQueryResults = async s => {
//   const res = await $axios.get(`/search/${s}`)
//   return res
// }

// SEARCH PLACES MAPBOX API

export const searchPlace = async search => {
  const res = await $axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
      search
    )}.json?limit=10&proximity=-77.00909999999999%2C38.8899&access_token=${
      process.env.VUE_APP_MAPBOX_ACCESS_TOKEN
    }`
  )
  return res
}
