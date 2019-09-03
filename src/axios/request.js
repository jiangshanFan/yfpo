/* eslint-disable */
import axios from "axios";
import Qs from "qs";  /** 需要进行引入才可以使用 */
import { Message } from 'element-ui';
import vm from '../main.js'

/****** 创建axios实例 ******/
const $ajax = axios.create({
  // baseURL: 'http://127.0.0.1/api',  // api的base_url    process.env.BASE_URL
  timeout: 10000,  // 请求超时时间
  withCredentials: true,
});

/****** request拦截器==>对请求参数做处理 ******/
$ajax.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  // 判断是否存在token，如果存在将每个页面header都添加token
  if (sessionStorage.getItem('token')) {
    config.headers.common['Authorization'] = sessionStorage.getItem('token');
  }
  //若需要可以设置请求时加载动画，需要导入import {Loading} from 'element-ui'
  // this.$loading({lock: true, text: 'Loading', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});

  if(config.method === 'post') {
    if(config.meta === 1) {
      config.headers['Content-Type'] = 'application/json';
      // config.data = JSON.stringify(config.data);
    }else {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.data = Qs.stringify(config.data,{
        serializeDate: (date) => {
          //用moment处理日期比较方便，自己写格式化方法也可以
          return Date.prototype.toString.call(date);
        }
      });
    }
  }else {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    config.params = Qs.stringify(config.params,{
      serializeDate: (date) => {
        //用moment处理日期比较方便，自己写格式化方法也可以
        return Date.prototype.toString.call(date);
      }
    });
    config.params = Qs.parse(config.params);
  }

  return config;
}, error => {  //请求错误处理
  Message({showClose: true, type: 'error', message: error});
  return Promise.reject(error);
});


/****** respone拦截器==>对响应做处理 ******/
$ajax.interceptors.response.use(
  response => {  //成功请求到数据
    // this.$loading({lock: true, text: 'Loading', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'}).close();
    if(response.config.responseType === 'blob') {  /** 此处代码是为了做二进制流的下载判断*/
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
      let filename = '';
      if(response.config.method === 'get') {
        if(response.config.url === '/api/createProject/export/downloadProjectList') {
          filename = `项目列表(${vm.$format(new Date().getTime()).dates}).xlsx`;
        }
        if(response.config.url === '/api/projectProgressManagement/export/downloadProjectProgress') {
          filename = `项目进度表(${vm.$format(new Date().getTime()).dates}).xlsx`;
        }
        if(response.config.url === '/api/projectMember/export/downloadProjectMember') {
          filename = `项目人员表(${vm.$format(new Date().getTime()).dates}).xlsx`;
        }
      }else{

      }

      // let reader = new FileReader();
      // reader.readAsBinaryString(response.data);
      // let msg = J.parse(reader.result);
      // console.log(msg.msg);
      //根据返回的数据类型，判断是否导出
      if (response.data.type === 'application/json') {
        Message({showClose:true, type: 'error', message: '此模号下暂无信息或者网络异常！'})
      }else {
        if ('download' in document.createElement('a')) {
          const downloadElement = document.createElement('a');
          let href = '';
          if(window.URL) href = window.URL.createObjectURL(blob);
          else href = window.webkitURL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = filename;
          document.body.appendChild(downloadElement);
          downloadElement.click();
          if(window.URL) window.URL.revokeObjectURL(href);
          else window.webkitURL.revokeObjectURL(href);
          document.body.removeChild(downloadElement);
          Message({showClose:true, type: 'success', message: '导出成功，请注意查收！'})
        } else {
          navigator.msSaveBlob(blob,filename);
        }
      }
      return;
    }

    //这里根据后端提供的数据进行对应的处理
    if (response.data.status === 1) {
      // return response.data;
    } else if(response.data.status === -1) {
      //返回 -1 清除token信息并跳转到登录页面
      // localStorage.removeItem('token');
      // localStorage.removeItem('username');
      // localStorage.removeItem('isLogin');
      // if(vm.$router.currentRoute.path !== '/login') {
      //   vm.$router.push({
      //     path: 'login',
      //     query: {redirect: vm.$router.currentRoute.fullPath}
      //   });
      // }
      sessionStorage.clear();
      window.location.reload();
      console.log('未登录');
      // Message({showClose: true, type: 'warning', message: response.data.msg});
        // 返回错误信息 return response.data;
    } else if(response.data.status === 0){
      Message({showClose: true, type: 'warning', message: response.data.msg});
    } else if(response.data.status === -2){
      Message({showClose: true, type: 'warning', message: response.data.msg});
    } else if(response.status !== 200){
      Message({showClose: true, type: 'warning', message: response.data.msg});
    }
    return response.data
  },
  error => {  //响应错误处理
    if (error.response) {
      switch (error.response.status) {
        case -1:
          //返回 -1 清除token信息并跳转到登录页面
          sessionStorage.removeItem('token');
          // vm.$router.replace({
          //   path: 'login',
          //   query: {redirect: router.currentRoute.fullPath}
          // });
          // console.log('未登录');
      }
    }
    // this.$message({showClose: true, type: 'warning', message: '网络错误！'});
    return Promise.reject(error)
  }
);



export default $ajax;
