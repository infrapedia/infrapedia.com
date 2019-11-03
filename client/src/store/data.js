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
  }
}

export const dataActions = {
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
  }
}
