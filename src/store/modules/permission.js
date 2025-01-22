import { asyncRoutes, constantRoutes, dashboardRoute, tugasRoute, userRoute, listroutesForSidebar } from '@/router'
import { levelNum, partner_status } from '@/helpers/dataUser'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  staticRoutes({ commit }) {
    return new Promise(resolve => {
      // const roles = levelNum
      // let listroutes
      // // console.log(listroutes)
      // if (roles) {
      //   if (roles === '1') listroutes = [...dashboardRoute, ...userRoute, ...tugasRoute]
      //   // } else if (roles === '1') {
      //   //   listroutes = counterRoutes
      //   // } else if (roles === '2') {
      //   //   listroutes = corporateqRoutes
      //   // }
      // }
      // else {
      //   listroutes = constantRoutes
      // }
      // console.log(listroutesForSidebar)

      commit('SET_ROUTES', listroutesForSidebar)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
