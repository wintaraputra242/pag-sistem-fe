// import { readUserTV, updateSuara, updateStatusCounter } from '@/api/usertv'
import { get, getDetail } from '@/api/target'
// import { id_site as site_id } from '@/helpers/dataUser'

const state = {
  data: {},
  total_data: {},
  data_detail: {},
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
  SET_DATA_DETAIL: (state, data) => {
    state.data_detail = data
  },
  SET_TOTAL_DATA_DETAIL: (state, total) => {
    state.total_data_detail = total
  }
}

const actions = {
  getDataTarget({ commit }, params) {
    // const site = site_id
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        commit('SET_DATA', res.data)
        commit('SET_TOTAL_DATA', res.total)
        // commit('SET_LENGTH', res.total)
        // console.log(res)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  getDataTargetDetail({ commit }, params) {
    // const site = site_id
    return new Promise((resolve, reject) => {
      getDetail(params).then(res => {
        console.log(res)
        const data = {
          data_sv: res.data_sv,
          data_sa: res.data_sa
        }
        console.log(data)
        commit('SET_DATA_DETAIL', data)
        commit('SET_TOTAL_DATA_DETAIL', res.total)
        // commit('SET_LENGTH', res.total)
        // console.log(res)
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
