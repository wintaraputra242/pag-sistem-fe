// import { readUserTV, updateSuara, updateStatusCounter } from '@/api/usertv'
import { cabang as comboCabang } from '@/api/combo'
// import { id_site as site_id } from '@/helpers/dataUser'

const state = {
  combo_cabang: {},
  total_combo_cabang: {}
}

const mutations = {
  SET_COMBO_CABANG: (state, data) => {
    state.combo_cabang = data
  },
  SET_TOTAL_COMBO_CABANG: (state, total) => {
    state.total_combo_cabang = total
  }
}

const actions = {
  getComboCabang({ commit }, params) {
    return new Promise((resolve, reject) => {
      comboCabang(params).then(res => {
        commit('SET_COMBO_CABANG', res.data)
        commit('SET_TOTAL_COMBO_CABANG', res.total)
        resolve()
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
