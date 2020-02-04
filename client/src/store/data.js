import {
  getSubsea,
  getDataCenters,
  getIxps,
  getNetworks,
  getFacility,
  getPremiumSelectedBounds,
  getPremiumSelectedFeatures,
  getOrganization,
  getFacilityPoints,
  searchPlace
} from '../services/api/data'
import { getPartners } from '../services/api/organizations'
import {
  getSearch,
  getSearchByNet,
  getSearchByCables,
  getSearchByCls,
  getSearchByOrg
} from '../services/api/search'
import * as types from './actionTypes'
import { MAP_BOUNDS, MAP_POINTS } from './actionTypes/map'
import { viewCableBBox } from '../services/api/cables'
import { viewClsBBox } from '../services/api/cls'

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
    const res = await getPartners()
    if (res && res.data && res.data.r) {
      commit(`${types.GET_PREMIUM_DATA}`, res.data.r)
    }
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
    commit(`${MAP_BOUNDS}`, bounds)
  },

  async getPremiumSelectedFeaturesData({ commit }, id) {
    const res = await getPremiumSelectedFeatures(id)
    if (res) commit(`${types.GET_PREMIUM_SELECTED_FEATURES}`)
    return res
  },

  async getPremiumSelectedData({ commit }, id) {
    const res = await getFacility(id)
    if (res) commit(`${types.GET_SELECTION_DATA}`)

    return res
  },

  async getOrganizationID({ commit }, id) {
    const res = await getOrganization(id)
    if (res) commit(`${types.GET_CABLES_BY_ORG}`)

    return res
  },

  // ---------------- END ---------------------

  // --- NAVBAR SUBMARINE CABLES ITEM SELECTION --- START
  async getSubseaCableBoundsData({ commit }, data) {
    const res = await viewCableBBox(data)
    if (res && res.data && res.data.r && res.data.r.length) {
      const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
      const coords = res.data.r[0].coordinates
      const bbox = coords.reduce(
        (bounds, coord) => bounds.extend(coord),
        new mapboxgl.LngLatBounds(coords[0], coords[0])
      )
      commit(`${MAP_BOUNDS}`, [bbox._ne, bbox._sw])
    }
  },

  // ---------------- END ---------------------

  // --- NAVBAR DATA CENTERS ITEM SELECTION --- START
  async getFacilityBoundsData({ commit }, data) {
    const res = await viewClsBBox(data)
    if (res && res.data && res.data.r && res.data.r.length) {
      // const mapboxgl = require('mapbox-gl/dist/mapbox-gl')
      const coords = res.data.r[0].coordinates
      commit(`${MAP_BOUNDS}`, [coords, coords])
    }
  },

  // ---------------- END ---------------------

  // --- NAVBAR IXPS-NETWORKS ITEM SELECTION --- START
  async getFacilityPointsData({ commit }, data) {
    const res = await getFacilityPoints(data)
    commit(`${MAP_POINTS}`, res.features)
  },

  // ---------------- END ---------------------

  // SEARCH
  async getSearchQueryData({ commit }, { s, type }) {
    let service = getSearch
    switch (type.toLowerCase()) {
      case 'networks':
        service = getSearchByNet
        break
      case 'cables':
        service = getSearchByCables
        break
      case 'cls':
        service = getSearchByCls
        break
      case 'orgs':
        service = getSearchByOrg
        break
      default:
        service = getSearch
        break
    }
    const res = await service(s)
    if (res && res.t !== 'err') commit(`${types.QUERY_RESULTS}`)
    return res
  },

  // PLACES
  async getSearchQueryDataMapbox({ commit }, s) {
    const res = await searchPlace(s)
    if (res) commit(`${types.QUERY_RESULTS}`)

    return res
  }
}
