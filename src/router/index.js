import Vue from 'vue'
import Router from 'vue-router'
// import store from '@/store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import NoLayout from '@/layout/NoLayout.vue'
import { levelNum } from '@/helpers/dataUser'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

/**
 * routes coorporateq (cuma report) todo
 */

export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const notFoundRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const dashboardRoute = {
  path: 'dashboard',
  component: () => import('@/views/dashboard/index'),
  name: 'Dashboard',
  meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
}
export const userRoute = {
  path: 'user',
  component: () => import('@/views/users/index'),
  name: 'User',
  meta: { title: 'User', icon: 'el-icon-user-solid', affix: true }
}
export const tugasRoute = {
  path: 'tugas',
  component: () => import('@/views/tugas/index'),
  name: 'Tugas',
  meta: { title: 'Tugas', icon: 'el-icon-finished', affix: true }
}
export const jadwalRoute = {
  path: 'jadwal',
  component: () => import('@/views/jadwal/index'),
  name: 'Jadwal',
  meta: { title: 'Jadwal', icon: 'el-icon-date', affix: true }
}
export const estimasiRoute = {
  path: 'estimasi',
  component: () => import('@/views/estimasi/index'),
  name: 'Estimasi',
  meta: { title: 'Estimasi', icon: 'el-icon-date', affix: true }
}
export const rakRoute = {
  path: 'gudang',
  component: () => import('@/views/gudang/index'),
  name: 'Gudang',
  meta: { title: 'Gudang', icon: 'el-icon-s-home', affix: true }
}
export const brandRoute = {
  path: 'brand',
  component: () => import('@/views/kategori/index'),
  name: 'Brand',
  meta: { title: 'Brand', icon: 'el-icon-document-copy', affix: true }
}
export const satuanRoute = {
  path: 'satuan',
  component: () => import('@/views/satuan/index'),
  name: 'Satuan',
  meta: { title: 'Satuan', icon: 'el-icon-cherry', affix: true }
}
export const supplierRoute = {
  path: 'supplier',
  component: () => import('@/views/supplier/index'),
  name: 'Supplier',
  meta: { title: 'Supplier', icon: 'el-icon-s-custom', affix: true }
}
export const paketRoute = {
  path: 'paket',
  component: () => import('@/views/paket/index'),
  name: 'Paket',
  meta: { title: 'Paket', icon: 'el-icon-box', affix: true }
}
export const itemRoute = {
  path: 'item',
  component: () => import('@/views/item/index'),
  name: 'Item',
  meta: { title: 'Item', icon: 'el-icon-tickets', affix: true }
}
export const masterDataRoute = {
  path: '/pembelian',
  component: NoLayout,
  redirect: 'order-item',
  meta: { title: 'Pembelian', icon: 'el-icon-sold-out', affix: true },
  children: [
    {
      path: 'order-item',
      component: () => import('@/views/order/index'),
      name: 'Order Item',
      meta: { title: 'Order Item', icon: '', affix: true }
    },
    {
      path: 'penerimaan-item',
      component: () => import('@/views/penerimaan-item/index'),
      name: 'Penerimaan Item',
      meta: { title: 'Penerimaan Item', icon: '', affix: true }
    },
    {
      path: 'retur-item',
      component: () => import('@/views/retur-item/index'),
      name: 'Retur',
      meta: { title: 'Retur', icon: '', affix: true }
    }
  ]
}

const adminRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: []
  }
]

export let listroutes
export let listroutesForSidebar
const roles = levelNum
if (roles) {
  // resetRouter()z
  const routesPerRole = {
    // '1': [dashboardRoute, userRoute, rakRoute, brandRoute, satuanRoute, supplierRoute, estimasiRoute, pembelianRoute], // super admin
    '1': [dashboardRoute, userRoute, rakRoute, brandRoute, satuanRoute, supplierRoute, itemRoute, paketRoute, estimasiRoute, masterDataRoute], // super admin
    // '1': [estimasiRoute], // estimator
    // '1': [dashboardRoute, userRoute, tugasRoute, jadwalRoute, estimasiRoute], // super admin
    '2': [dashboardRoute, tugasRoute, jadwalRoute], // owner
    '3': [tugasRoute, jadwalRoute] // karyawan
  }

  const routesRedirectPerRole = {
    '1': '/dashboard', // super admin
    '2': '/dashboard', // owner
    '3': '/tugas' // karyawan
  }

  if (routesPerRole[roles]) listroutesForSidebar = routesPerRole[roles]

  adminRoutes[0].redirect = routesRedirectPerRole[roles]
  adminRoutes[0].children = routesPerRole[roles]

  if (routesPerRole[roles]) {
    listroutes = [...constantRoutes, ...adminRoutes, ...notFoundRoutes]
  } else {
    listroutes = [...constantRoutes, ...notFoundRoutes]
  }
} else {
  listroutes = [...constantRoutes, ...notFoundRoutes]
}

// store.commit('permission/SET_ROUTES', listroutes)

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: listroutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
