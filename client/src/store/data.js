import {
  getPremium,
  getSubsea,
  getDataCenters,
  getIxps,
  getNetworks,
  getFacility,
  getPremiumSelectedBounds,
  getPremiumSelectedFeatures,
  getOrganization,
  getSubseaCableBounds,
  getFacilityBounds,
  getFacilityPoints,
  searchPlace,
  getSearchQueryResults
} from '../services/api/data'
import * as types from './actionTypes'
import { MAP_BOUNDS, MAP_POINTS } from './actionTypes/map'

const NO_RES_ERR = { message: 'THERE WAS NO RESPONSE' }

export const dataMutations = {
  [types.GET_PREMIUM_DATA](state, data) {
    state.premium = data
  },
  [types.GET_SUBMARINE](state, data) {
    const submarine = []
    for (let i = 0; i < data.quantity; i++) {
      if (i === data.data.length) break
      else if (data.data[i]) submarine.push(data.data[i])
    }
    state.submarine = submarine
  },
  [types.GET_DATA_CENTERS](state, data) {
    const dataCenters = []
    for (let i = 0; i < data.quantity; i++) {
      if (i === data.data.length) break
      else if (data.data[i]) dataCenters.push(data.data[i])
    }
    state.dataCenters = dataCenters
  },
  [types.GET_IX_FACILITIES](state, data) {
    const ixps = []
    for (let i = 0; i < data.quantity; i++) {
      if (i === data.data.length) break
      else if (data.data[i]) ixps.push(data.data[i])
    }
    state.ixps = ixps
  },
  [types.GET_NETWORKS](state, data) {
    const networks = []
    for (let i = 0; i < data.quantity; i++) {
      if (i === data.data.length) break
      else if (data.data[i]) networks.push(data.data[i])
    }
    state.networks = networks
  },
  [types.GET_PREMIUM_SELECTED_BOUNDS](state) {
    return state
  },
  [types.GET_PREMIUM_SELECTED_FEATURES](state) {
    return state
  },
  [types.GET_SELECTION_DATA](state) {
    return state
  },
  [types.GET_CABLES_BY_ORG](state) {
    return state
  },
  [types.GET_SUBSEA_CABLE](state) {
    return state
  },
  [types.QUERY_RESULTS](state) {
    return state
  }
}

export const dataActions = {
  // NAVBAR OPTIONS GETTERS
  async getPremiumData({ commit }) {
    const res = await getPremium()
    if (res) commit(`${types.GET_PREMIUM_DATA}`, res)
  },

  async getSubseaData({ commit }, quantity) {
    const res = await getSubsea()
    if (res) commit(`${types.GET_SUBMARINE}`, { data: res, quantity })
  },

  async getDataCentersData({ commit }, quantity) {
    const res = await getDataCenters()
    if (res) commit(`${types.GET_DATA_CENTERS}`, { data: res, quantity })
  },

  async getIxpsData({ commit }, quantity) {
    const res = await getIxps()
    if (res) commit(`${types.GET_IX_FACILITIES}`, { data: res, quantity })
  },

  async getNetworksData({ commit }, quantity) {
    const res = await getNetworks()
    if (res) commit(`${types.GET_NETWORKS}`, { data: res, quantity })
  },

  // ---------------- END ---------------------

  // --- NAVBAR PREMIUM ITEM SELECTION --- START
  async getPremiumSelectedBoundsData({ commit }, id) {
    const bounds = await getPremiumSelectedBounds(id)
    if (!bounds) throw NO_RES_ERR
    commit(`${MAP_BOUNDS}`, bounds)
  },

  async getPremiumSelectedFeaturesData({ commit }, id) {
    const res = await getPremiumSelectedFeatures(id)
    if (!res) throw NO_RES_ERR
    commit(`${types.GET_PREMIUM_SELECTED_FEATURES}`)
    return res
  },

  async getPremiumSelectedData({ commit }, id) {
    const res = await getFacility(id)
    if (!res) throw NO_RES_ERR
    commit(`${types.GET_SELECTION_DATA}`)
    return res
  },

  async getOrganizationID({ commit }, id) {
    const res = await getOrganization(id)
    if (!res) throw NO_RES_ERR
    commit(`${types.GET_CABLES_BY_ORG}`)
    return res
  },

  // ---------------- END ---------------------

  // --- NAVBAR SUBMARINE CABLES ITEM SELECTION --- START
  async getSubseaCableBoundsData({ commit }, id) {
    const bounds = await getSubseaCableBounds(id)
    if (!bounds) throw NO_RES_ERR
    commit(`${MAP_BOUNDS}`, bounds)
  },

  // ---------------- END ---------------------

  // --- NAVBAR DATA CENTERS ITEM SELECTION --- START
  async getFacilityBoundsData({ commit }, id) {
    const bounds = await getFacilityBounds(id)
    if (!bounds) throw NO_RES_ERR
    commit(`${MAP_BOUNDS}`, bounds)
  },

  // ---------------- END ---------------------

  // --- NAVBAR IXPS-NETWORKS ITEM SELECTION --- START
  async getFacilityPointsData({ commit }, data) {
    const res = await getFacilityPoints(data)
    if (!res) throw NO_RES_ERR
    commit(`${MAP_POINTS}`, res.features)
  },

  // ---------------- END ---------------------

  // Places
  async getSearchQueryData({ commit }, s) {
    const res = await getSearchQueryResults(s)
    if (!res) throw NO_RES_ERR
    commit(`${types.QUERY_RESULTS}`)
    return res
  },

  async getSearchQueryDataMapbox({ commit }, s) {
    const res = await searchPlace(s)
    if (!res) throw NO_RES_ERR
    commit(`${types.QUERY_RESULTS}`)
    return res
  }
}
