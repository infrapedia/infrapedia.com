import { viewCls } from '../../services/api/cls'
import { viewIxps } from '../../services/api/ixps'
import { viewCable } from '../../services/api/cables'
import { viewFacility } from '../../services/api/facs'

const state = {
  bounds: [],
  points: [],
  focus: null,
  filter: ['all'],
  easePoint: null,
  hasToEase: false,
  currentSelection: null
}

const mutations = {
  CURRENT_SELECTION(state, selection) {
    state.currentSelection = selection
  },
  CURRENT_MAP_FILTER(state, filter) {
    state.filter = filter
  },
  MAP_BOUNDS(state, bounds) {
    state.bounds = bounds
  },
  MAP_FOCUS_ON(state, focus) {
    state.focus = focus
  },
  MAP_POINTS(state, points) {
    state.points = points
  },
  HAS_TO_EASE_TO(state, bool) {
    state.hasToEase = bool
  },
  EASE_POINT(state, easePoint) {
    state.easePoint = easePoint
  }
}

const actions = {
  async getCableData({ commit }, data) {
    const res = await viewCable(data)
    if (res && res.data.r && res.data.r.length) {
      commit('CURRENT_SELECTION', res.data.r[0])
    }
  },
  async getFacilityData({ commit }, data) {
    const res = await viewFacility(data)
    if (res && res.data && res.data.r.length) {
      commit('CURRENT_SELECTION', res.data.r[0])
    }
    return res
  },
  async getClsData({ commit }, data) {
    const res = await viewCls(data)
    if (res && res.data && res.data.r.length) {
      commit('CURRENT_SELECTION', res.data.r[0])
    }
    return res
  },
  async getIxpsData({ commit }, data) {
    const res = await viewIxps(data)
    if (res && res.data && res.data.r.length) {
      commit('CURRENT_SELECTION', res.data.r[0])
    }
    return res
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
