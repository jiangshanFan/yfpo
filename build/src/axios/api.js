/* eslint-disable */
/** api-doc*/
import $ajax from './request'

//--此处根据method方法改变：method === 'post'? data : params;
// console.log($ajax)

/**
 * @name login -------------- 登录
 * @author fjs
 * */
//登录
export const login = data => {return $ajax({url: '/api/login', method: 'post', data: data,})};
//登出
export const loginOut = data => {return $ajax({url: '/api/login/loginOut', method: 'post', data: data,})};


/**
 * @name yfpo
 * @author fjs
 * */
//路由列表
export const auth = data => {return $ajax({url: '/static/auth.json', method: 'get', params: data,})};
//项目列表
export const getMouldList = data => {return $ajax({url: '/api/project/getMouldList', method: 'get', params: data,})};
//单个模号认可清单
export const getApproveStatistics = data => {return $ajax({url: '/api/project/getApproveStatistics', method: 'get', params: data,})};

//添加项目
export const insertMould = data => {return $ajax({url: '/api/project/insertMould', method: 'post', data: data, meta: 1, })};
//项目更新
export const updateMould = data => {return $ajax({url: '/api/project/updateMould', method: 'post', data: data, meta: 1, })};
//获取单个认可清单信息
export const getApproveInfoByMouldNo = data => {return $ajax({url: '/api/project/getApproveInfoByMouldNo', method: 'get', params: data,})};
//客户更新认可清单信息
export const updateApproveInfoByCustomer = data => {return $ajax({url: '/api/project/updateApproveInfoByCustomer', method: 'post', data: data, meta: 1, })};
//内部用户更新认可清单信息
export const updateApproveInfoByInnerUser = data => {return $ajax({url: '/api/project/updateApproveInfoByInnerUser', method: 'post', data: data, meta: 1, })};
//详情列表
export const getCheckDetailList = data => {return $ajax({url: '/api/project/getCheckDetailList', method: 'get', params: data,})};
//客户更新认可清单信息
export const addCheckDetail = data => {return $ajax({url: '/api/project/addCheckDetail', method: 'post', data: data, meta: 1, })};


//获取tool information
export const getToolInformationByMouldNo = data => {return $ajax({url: '/api/project/getToolInformationByMouldNo', method: 'get', params: data,})};
//更新tool information
export const updateToolInformationByMouldNo = data => {return $ajax({url: '/api/project/updateToolInformationByMouldNo', method: 'post', data: data, meta: 1, })};


//根据模号，获取设计评审清单列表
export const getDesignStatistics = data => {return $ajax({url: '/api/project/getDesignStatistics', method: 'get', params: data,})};
//根据模号，以及设计类型获取设计评审清单详情
export const getDesignInfoByMouldNo = data => {return $ajax({url: '/api/project/getDesignInfoByMouldNo', method: 'get', params: data,})};
//更新设计评审清单结果
export const updateDesignInfo = data => {return $ajax({url: '/api/project/updateDesignInfo', method: 'post', data: data, meta: 1, })};


//获取账户列表
export const getUserList = data => {return $ajax({url: '/api/user/getUserList', method: 'get', params: data,})};
//删除账户
export const deleteUser = data => {return $ajax({url: '/api/user/deleteUser', method: 'post', data: data,})};
//密码重置
export const resetPwd = data => {return $ajax({url: '/api/user/resetPwd', method: 'post', data: data,})};
//密码修改
export const changePwd = data => {return $ajax({url: '/api/user/changePwd', method: 'post', data: data,})};
//添加账户
export const addUser = data => {return $ajax({url: '/api/user/addUser', method: 'post', data: data, meta: 1, })};
//账户更新
export const updateUser = data => {return $ajax({url: '/api/user/updateUser', method: 'post', data: data, meta: 1, })};
//模具列表页面--根据角色获取用户下拉列表
export const getUserListByRole = data => {return $ajax({url: '/api/user/getUserListByRole', method: 'get', params: data,})};
