/* eslint-disable */
import router, {DynamicRoutes, } from '../../router/index'
import { recursionRouter, setDefaultRoute } from '../../utils/set_router'
import allRoutes from '../../router/all-router'
import none from '../../pages/none'
import store from '../../vuex/index'
import { auth } from '../../axios/api'

export default {
  namespaced: true,
  state: {
    permissionList: null /** 所有路由 */,
    sidebarMenu: [] /** 导航菜单 */,
    currentMenu: '' /** 当前active导航菜单 */
  },
  getters: {},
  mutations: {
    SET_PERMISSION(state, routes) {
      state.permissionList = routes
    },
    CLEAR_PERMISSION(state) {
      state.permissionList = null
    },
    SET_MENU(state, menu) {
      state.sidebarMenu = menu
    },
    CLEAR_MENU(state) {
      state.sidebarMenu = []
    },
    SET_CURRENT_MENU(state, currentMenu) {
      state.currentMenu = currentMenu
    }
  },
  actions: {
    async FETCH_PERMISSION({ commit, state }) {
      // let res = JSON.parse(sessionStorage.getItem('userLoginVO'));
      // let permissionList;
      // if (res) {
      //   permissionList = res.permissionListVOList;
      // } else {
      //   permissionList = [];
      // }
      let res = await auth();
      let permissionList = res.msg;

      /*  根据权限筛选出我们设置好的路由并加入到path=''的children */
      // Routes can not be used to JSON methods!

      let routes = recursionRouter(permissionList, allRoutes); // 权限路由
      let MainContainer = DynamicRoutes.find(v => v.path === '/');
      MainContainer.children = [];  // 必须重置，否则累加路由
      MainContainer.children.push(...routes);

      /* 生成左侧导航菜单 */
      commit('SET_MENU', MainContainer.children);

      /*
          为所有有children的菜单路由设置第一个children为默认路由
          主要是供面包屑用，防止点击面包屑后进入某个路由下的 '' 路由,比如/manage/
          而我们的路由是
          [
              /manage/menu1,
              /manage/menu2
          ]
      */

      let arrRoutes = [];
      arrRoutes[0] = MainContainer;

      arrRoutes[1] = {
        path: '*',
        component: none,
      };

      /*  初始路由 */
      let initialRoutes = router.options.routes;

      setDefaultRoute([...initialRoutes, ...arrRoutes]);  // all routes

      /*  动态添加路由 */
      router.addRoutes(arrRoutes);

      /* 完整的路由表 */
      commit('SET_PERMISSION', [...initialRoutes, ...arrRoutes]);
    }
  }
}
