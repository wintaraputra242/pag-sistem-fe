// import { readUserTV, updateSuara, updateStatusCounter } from '@/api/usertv'
import { get } from '@/api/profile'
// import { id_site as site_id } from '@/helpers/dataUser'

const state = {
  data: {},
  total_data: {}
  // length: 0,
  // status: 1
}

const mutations = {
  SET_DATA: (state, data) => {
    state.data = data
  },
  SET_TOTAL_DATA: (state, total) => {
    state.total_data = total
  }

}

const actions = {
  getDataProfile({ commit }) {
    // const site = site_id
    return new Promise((resolve, reject) => {
      get().then(res => {
        commit('SET_DATA', res.data)
        commit('SET_TOTAL_DATA', res.total)
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
