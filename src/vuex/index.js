/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex);

const state = {   //要设置的全局访问的state对象     //要设置的初始属性值
  //login获取token
  token: '',
  accountName: '',
  userLoginVO: {role: 1,},
  // isLogin: false,
  mould_list: {},

  // 账户管理跳转新增或者编辑传参
  auth_userName: {},
};


const getters = {   //实时监听state值的变化(最新状态)
  //承载变化的 token 的值
  token: (state) => {return state.token},
  //承载变化的 userLoginVO 的值
  userLoginVO: (state) => {return state.userLoginVO},
  //承载变化的 accountName 的值
  accountName: (state) => {return state.accountName},
  // //承载变化的 isLogin 的值
  // isLogin(state) {return state.isLogin},
  //承载变化的 mould_list 的值
  mould_list: (state) => {return state.mould_list},

  // 账户管理
  auth_userName: (state) => {return state.auth_userName},
};


const mutations = {//自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
  //改变 token
  token(state,item) {state.token = item;},
  //改变 userLoginVO
  userLoginVO(state,item) {state.userLoginVO = item;},

  //改变 accountName
  accountName(state,item) {state.accountName = item;},
  // //改变 isLogin
  // isLogin(state,item) {state.isLogin = item;},
  //改变 mould_list
  mould_list(state,item) {state.mould_list = item;},

  // 账户管理
  auth_userName(state, item) {state.auth_userName = item},
};


const actions = {//同上注释，item 为要变化的形参
  //异步触发改变 token
  token(context,item){context.commit('token',item)},
  //异步触发改变 userLoginVO
  userLoginVO(context,item){context.commit('userLoginVO',item)},

  //异步触发改变 accountName
  accountName(context,item){context.commit('accountName',item)},
  // //异步触发改变 allRoutes
  // isLogin(context,item){context.commit('isLogin',item)},
  //异步触发改变 mould_list
  mould_list(context,item){context.commit('mould_list',item)},

  // 账户管理
  auth_userName(context, item) {context.commit('auth_userName', item)},
};


const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
});
export default store;
