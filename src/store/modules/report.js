// import { readUserTV, updateSuara, updateStatusCounter } from '@/api/usertv'
import { get, getDetailCabang, getDetailSA, getDetailSV } from '@/api/report'
// import { id_site as site_id } from '@/helpers/dataUser'

const state = {
  data: {},
  total_data: {},
  data_detail: {
    cabang: {},
    sa: {},
    sv: {}
  },
  total_data_detail: {}
  // length: 0,
  // status: 1
}

const mutations = {
  SET_DATA: (state, data) => {
    state.data = data
  },
  SET_TOTAL_DATA: (state, total) => {
    state.total_data = total
  },
  SET_DATA_DETAIL_CABANG: (state, data) => {
    state.data_detail.cabang = data
  },
  SET_DATA_DETAIL_SA: (state, data) => {
    state.data_detail.sa = data
  },
  SET_DATA_DETAIL_SV: (state, data) => {
    state.data_detail.sv = data
  },
}

const actions = {
  getDataReport({ commit }, params) {
    // const site = site_id
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        commit('SET_DATA', res.data)
        commit('SET_TOTAL_DATA', res.data.length)
        // commit('SET_LENGTH', res.total)
        // console.log(res)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getDetail({ commit }, params) {
    // console.log('kesini')
    // const site = site_id
    const { type, id_target } = params
    const apiByTypes = {
      'cabang': getDetailCabang,
      'sa': getDetailSA,
      'sv': getDetailSV
    }
    return new Promise((resolve, reject) => {
      apiByTypes[type](({ id_target })).then(res => {
        if (type === 'cabang') commit('SET_DATA_DETAIL_CABANG', res.data)
        if (type === 'sa') commit('SET_DATA_DETAIL_SA', res.data)
        if (type === 'sv') commit('SET_DATA_DETAIL_SV', res.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  // updateUserTV({ commit }, params){
  //   const {site, id_user, username, password, tipe_media} = params
  //   return new Promise((resolve, reject) => {
  //     readUserTV(new URLSearchParams(
  //       {
  //         site: site,
  //         id_user: id_user,
  //         username: username,
  //         password: password,
  //         tipe_media: tipe_media,
  //       }
  //     ))
  //     .then(res => {
  //       // commit('SET_DATA', res.data)
  //       // commit('SET_LENGTH', res.total)
  //       console.log(res);
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // async updateSuara({ commit }, params) {
  //   try {
  //     const res = await updateSuara(params)
  //     return res
  //   } catch (error) {
  //     console.log(error)
  //   }
  // },

  // async updateStatusCounter({ commit }, params) {
  //   try {
  //     const res = await updateStatusCounter(params)
  //     return res
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
