// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue'
import App from './App'
import store from './vuex/index'
import router from './router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.use(store);
Vue.use(router);

Vue.config.devtools = true;
Vue.config.productionTip = false;

const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});

Vue.prototype.$goto = function(path) {
  this.$router.push(path);
};

/**
 * 序号序列化
 * @param {number} index
 * @param {string} name
 * @param {number} cur
 * @param {number} size
 * @returns {*}
 */
Vue.prototype.$indexS = function(index,cur, size, name='') {  //序号--序列化方法
  if (name) {
    return name + (index + 1);
  } else {
    let add;
    if (cur !== 1) {
      add = (cur - 1) * size + 1;
    } else {
      add = 1;
    }
    return index + add;
  }
};

/*验证处理方法*/

Vue.prototype.$len = function checkUserName(numb, val) {
  // var flag = 1;
  //[\u4e00-\u9fa5]为汉字的unicode编码，/i表示匹配的时候不区分大小写。
  var rxcn = /[\u4e00-\u9fa5]/g;
  var num = 0;
  // 全局查找中文字符替换成两个 ** 字符表示，然后获取替换后的字符串的字符长度 str.length
  var str = val.replace(rxcn, '**');
  num = str.length;
  // 特殊字符限制
  // if (/[^a-z\d\u4e00-\u9fa5]/.test(val)) {
  //   flag = 3;
  // }
  // if (flag != 3) {
  if (num > numb) {
    this.$message({
      type: 'warning',
      message: '超出字数限制'
    })
    return 3;
  } else if (num < 1) {
    this.$message({
      type: 'warning',
      message: '不能为空'
    })
    return 2;
  } else {
    return 1;
  }
  //   }else {

  //  }
}

/**
 * 序号序列化
 * @param {string} url
 * @returns {*}
 */
Vue.prototype.$exportExcel = function(url) {  // 下载导出Excel
  window.open(url);
};


/*-- 日期和时间戳转换 --*/
function add0(m){return m<10?'0'+m:m }
Vue.prototype.$format = function format(shijianchuo)
{//shijianchuo是整数，否则要parseInt转换
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth()+1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return {
    y: y,
    m: m,
    d: d,
    h: h,
    mm: mm,
    s: s,
    dates: y+'-'+add0(m)+'-'+add0(d),
    all: y+'-'+add0(m)+'-'+add0(d)+' '+h+mm+s,
  }; //+' '+add0(h)+':'+add0(mm)+':'+add0(s)
};

router.beforeEach((to, from, next) => {
  if (!sessionStorage.getItem('token')) {
    if (to.matched.length > 0 && !to.matched.some(record => record.meta.requiresAuth)) {
      next()
    } else {
      next({ path: '/login' })
    }
  } else {
    if (to.path !== '/login') {
      next()
    } else {
      next(from.fullPath)
    }
  }
});

router.afterEach((to, from) => {
  // console.log(to.matched)
  // vm.$store.commit('Auth/SET_CURRENT_MENU', to.name)
});

export default vm;
