import { get, getDetail } from '@/api/dashboard'

const state = {
  accountData: {
    // poin_paket: '',
    // poin_sisa: '',
    // paket: '',
    // expired: ''
  },
  historyPembelian: null,
  data: [],
  total: [],
  dataDetail: [],
  totalDetail: [],
}

const mutations = {

  SET_ACCOUNT_DATA: (state, data) => {
    state.accountData = data
  },
  SET_DATA_DASHBOARD: (state, data) => {
    state.data = data
  },
  SET_TOTAL_DASHBOARD: (state, data) => {
    state.total = data
  },
  SET_DATA_DETAIL_DASHBOARD: (state, data) => {
    state.dataDetail = data
  },
  SET_TOTAL_DETAIL_DASHBOARD: (state, data) => {
    state.dataDetail = data
  }
  // SET_STATUS: (state, status) => {
  //   state.status = status
  // },

}

const actions = {
  getDashboard({ commit }, params) {
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        if (res.success === true) {
          commit('SET_TOTAL_DASHBOARD', res.total)
          commit('SET_DATA_DASHBOARD', res.data)
          resolve()
        } else {
          throw res
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDetailDashboard({ commit }, params) {
    return new Promise((resolve, reject) => {
      getDetail(params).then(res => {
        if (res.success === true) {
          commit('SET_TOTAL_DETAIL_DASHBOARD', res.total)
          commit('SET_DATA_DETAIL_DASHBOARD', res.data)
          resolve()
        } else {
          throw res
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
