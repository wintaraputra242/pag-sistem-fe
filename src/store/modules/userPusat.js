// import { readUserTV, updateSuara, updateStatusCounter } from '@/api/usertv'
import { get, getUserForJadwal, getJadwal } from '@/api/userPusat'
// import { id_site as site_id } from '@/helpers/dataUser'

const state = {
  data: {},
  dataUserForJadwal: {},
  dataJadwal: [],
  total_data: {},
  total_data_for_jadwal: {},
  row_data: {},
  slice_data: [],
  val: 1
  // length: 0,
  // status: 1
}

const mutations = {
  SET_DATA: (state, data) => {
    state.data = data
  },
  SET_DATA_USER_FOR_JADWAL: (state, data) => {
    state.dataUserForJadwal = data
  },
  SET_DATA_JADWAL: (state, data) => {
    state.dataJadwal = data
  },
  SET_TOTAL_DATA: (state, total) => {
    state.total_data = total
  },
  SET_TOTAL_DATA_FOR_JADWAL: (state, total) => {
    state.total_data_for_jadwal = total
  },
  SET_DATA_ROWTV: (state, data) => {
    state.row_data = data
  },
  SET_DATA_TV_SLICE: (state, data) => {
    state.slice_data = data
  },
  SET_VAL_CURENT_CHANGE: (state, val) => {
    state.val = val
  }

  // SET_LENGTH: (state, length) => {
  //   state.length = length
  // },
  // SET_STATUS: (state, status) => {
  //   state.status = status
  // },

}

const actions = {
  getDataUserPusat({ commit }, params) {
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

  getDataUserJadwal({ commit }, params) {
    // const site = site_id
    return new Promise((resolve, reject) => {
      getUserForJadwal(params).then(res => {
        commit('SET_DATA_USER_FOR_JADWAL', res.data)
        commit('SET_TOTAL_DATA_FOR_JADWAL', res.total)
        // commit('SET_LENGTH', res.total)
        // console.log(res)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getDataJadwal({ commit }, params) {
    // const site = site_id
    return new Promise((resolve, reject) => {
      getJadwal(params).then(res => {
        commit('SET_DATA_JADWAL', res.data)
        // commit('SET_TOTAL_DATA', res.total)
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
