import {
  getPremium,
  getSubsea,
  getDataCenters,
  getIxps,
  getNetworks
} from '../services/api/data'
import * as types from './actionTypes'

export const dataMutations = {
  [types.GET_PREMIUM_DATA](state, data) {
    state.premium = data
  }
}

export const dataActions = {
  async getPremiumData({ commit }) {
    const res = await getPremium()
    if (res) commit(`${types.GET_PREMIUM_DATA}`, res)
  },

  async getSubseaData({ commit }, quantity) {
    const res = await getSubsea()
    if (res) commit(`${types.GET_SUBSEA}`, { data: res, quantity })
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
    if (res) commit(`${types.GET_NET_FACILITIES}`, { data: res, quantity })
  }
}
