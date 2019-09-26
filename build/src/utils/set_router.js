/* eslint-disable */
import _clone from 'lodash.clonedeep'
/**
 * @param  {Object} obj 权限列表对象的children字段是按钮组
 * @param  {Object} v allRoutes中的其中一项或者其子项
 * @param  {Number} level level是控制只有类型为4的子项才可以forEach,且push到v.meta.button.nextButton
 */
function getButtons(obj, v, level=3) {
  if (obj.children && obj.children.length > 0) {
    obj.children.forEach((ic, icIndex) => {
      if (ic.type === 3) {
        v.meta.button.buttons.push(ic.name);
      }

      if (ic.children && ic.children.length > 0) {
        v = getButtons(ic.children, v, ic.type + 1);
      }
    })
  } else if (level === 4){
    obj.forEach((f, fIndex) => {
      if (f.type === 4) {
        v.meta.button.nextButton.push(f.name);
      }
    })
  }
  console.log(v);
  return v;
}

/**
 *
 * @param  {Array} userRouter 后台返回的用户权限json
 * @param  {Array} allRouters  前端配置好的所有动态路由的集合
 * @return {Array} realRoutes 过滤后的路由
 */
export function recursionRouter(userRouter = [], allRouters = []) {
  let realRoutes = [];
  let allRouter = _clone(allRouters);
  allRouter.forEach((v, i) => {
    userRouter.forEach((item, index) => {
      if (item.name === v.meta.name) {  // get button auth
        if (item.type < 2) {
          if (item.children && item.children.length > 0) {
            v.children = recursionRouter(item.children, v.children)
          } else {
            v.children = [];
          }
        }
        else if (item.type === 2) {
          v = getButtons(item, v);
        }
        realRoutes.push(v);
      }
    })
  });
  return realRoutes
}

/**
 *
 * @param {Array} routes 用户过滤后的路由
 *
 * 递归为所有有子路由的路由设置第一个children.path为默认路由
 */
export function setDefaultRoute(routes) {
  routes.forEach((v, i) => {
    if (v.children && v.children.length > 0) {
      v.redirect = { name: v.children[0].name };
      setDefaultRoute(v.children)
    }
  })
}
