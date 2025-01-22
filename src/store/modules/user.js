import { login, getInfo, loginCounter, getDashboardData } from '@/api/user'
import Cookies from 'js-cookie'
import { getToken, setToken, removeToken, setUserinfo } from '@/utils/auth'
import router, { resetRouter } from '@/router'
// import { messaging } from '@/utils/firebase-messaging-sw'
// import { getToken as getTokenFirebase } from 'firebase/messaging'
// import { Message } from 'element-ui'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  dialogForm: false,
  messageLogin: '',
  dataLogin: [],
  dataDashboard: [],
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_DIALOG_FORM: (state, dialogForm) => {
    state.dialogForm = dialogForm
  },
  SET_MESSAGE_LOGIN: (state, messageLogin) => {
    state.messageLogin = messageLogin
  },
  SET_DATA_LOGIN: (state, dataLogin) => {
    state.dataLogin = dataLogin
  },
  SET_DATA_DASHBOARD: (state, dataDashboard) => {
    state.dataDashboard = dataDashboard
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('username', username.trim())
      formData.append('password', password)
      login(formData).then(response => {
        if (response.success === true) {
          console.log(response)
          const { data, token } = response
          console.log(data)
          console.log(token)
          commit('SET_TOKEN', data.token)
          setToken(token)
          setUserinfo(data)
          resolve()
        } else {
          throw response
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  loginCounter({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      loginCounter({ username: username.trim(), password: password, type: 2 }).then(response => {
        if (response.success === true) {
          Cookies.set('roleLogin', '1', { expires: 60 * 60 * 18 })
          const data = response.data
          commit('SET_TOKEN', data.token)
          setToken(data.token, 'counter')
          setUserinfo(data.data, 'counter')
          Cookies.set('namauser', '', { expires: 60 * 60 * 18 })
          Cookies.set('namaloket', '', { expires: 60 * 60 * 18 })
          resolve()
        } else {
          throw response
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        // console.log(Cookies.get())

        Object.keys(Cookies.get()).forEach(function(cookieName) {
          var neededAttributes = {
            // Here you pass the same attributes that were used when the cookie was created
            // and are required when removing the cookie
          }
          Cookies.remove(cookieName, neededAttributes)
        })
        Cookies.set('logout', '1', {
          expires: 1
        })
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
