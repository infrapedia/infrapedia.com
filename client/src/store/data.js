import { searchPlace } from '../services/api/data'
import { getPartners } from '../services/api/organizations'
import {
  getSearch,
  getSearchByNet,
  getSearchByCables,
  getSearchByCls,
  getSearchByOrg,
  getSearchByFacility,
  getSearchByIxps
} from '../services/api/search'
import * as types from './actionTypes'
import { MAP_BOUNDS } from './actionTypes/map'
import { viewCableBBox } from '../services/api/cables'
import { viewClsBBox } from '../services/api/cls'
import { viewFacilityBBox } from '../services/api/facs'
import { viewIxpsBBox } from '../services/api/ixps'
import {
  getClustersPointsNetworks,
  getClustersPointsOrgs
} from '../services/api/clusters'
import getBoundsCoords from '../helpers/getBoundsCoords'

export const dataMutations = {
  [types.GET_PREMIUM_DATA](state, data) {
    state.premium = data
  },
  [types.QUERY_RESULTS](state) {
    return state
  }
}

export const dataActions = {
  // NAVBAR PREMIUM PARTNERS LIST
  async getPremiumData({ commit }) {
    const res = await getPartners()
    if (res && res.data && res.data.r) {
      commit(`${types.GET_PREMIUM_DATA}`, res.data.r)
    }
  },

  async getSubseaCableBoundsData({ commit }, data) {
    const res = await viewCableBBox(data)
    if (res && res.data && res.data.r && res.data.r.length) {
      commit(`${MAP_BOUNDS}`, getBoundsCoords(res.data.r))
    }
  },

  async getClsBoundsData({ commit }, data) {
    const res = await viewClsBBox(data)
    if (res && res.data && res.data.r && res.data.r.length) {
      commit(`${MAP_BOUNDS}`, getBoundsCoords(res.data.r))
    }
  },

  async getFacilityBoundsData({ commit }, data) {
    const res = await viewFacilityBBox(data)
    if (res && res.data && res.data.r && res.data.r.length) {
      commit(`${MAP_BOUNDS}`, getBoundsCoords(res.data.r))
    }
  },

  async getIxpsBoundsData({ commit }, data) {
    const res = await viewIxpsBBox(data)
    if (res && res.data && res.data.r && res.data.r.length) {
      commit(`${MAP_BOUNDS}`, getBoundsCoords(res.data.r))
    }
  },

  async getClustersPointsOrgsData({ commit }, data) {
    const res = await getClustersPointsOrgs(data)

    if (
      res &&
      res.data &&
      res.data.r &&
      res.data.r.features &&
      res.data.r.features.length
    ) {
      commit(
        `${MAP_BOUNDS}`,
        getBoundsCoords(res.data.r.features[0].geometry.coordinates)
      )
    }
    return res
  },
  async getClustersPointsNetworksData({ commit }, data) {
    const res = await getClustersPointsNetworks(data)

    if (
      res &&
      res.data &&
      res.data.r &&
      res.data.r.features &&
      res.data.r.features.length
    ) {
      commit(
        `${MAP_BOUNDS}`,
        getBoundsCoords(res.data.r.features[0].geometry.coordinates)
      )
    }
    return res
  },

  // SEARCH
  async getSearchQueryData({ commit }, { s, type }) {
    let service = getSearch
    switch (type.toLowerCase()) {
      case 'networks':
        service = getSearchByNet
        break
      case 'groups':
        service = getSearchByNet
        break
      case 'cables':
        service = getSearchByCables
        break
      case 'terrestrial':
        service = getSearchByCables
        break
      case 'cls':
        service = getSearchByCls
        break
      case 'organizations':
        service = getSearchByOrg
        break
      case 'facilities':
        service = getSearchByFacility
        break
      case 'ixps':
        service = getSearchByIxps
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
