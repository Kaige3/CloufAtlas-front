import axios from "axios";
import {message} from "ant-design-vue";

// 创建Axios实例
const myAxios = axios.create({
  baseURL:'http://localhost:8123',
  timeout:60000,
  withCredentials:true
})

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config){
    // 请求之前
    return config;
  },
  function (error) {
    // 请求之后
    return Promise.reject(error);
  }
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response){
    const { data } = response
    // 没有登录
    if (data.code === 40100){
      // 跳转到的登录页面
      if(
        !response.request.responseURL.includes('user/get/login')&&
        !window.location.pathname.includes('/user/login')
      ){
        message.warning('请登录')
        window.location.href = `/user/login?redirect = ${window.location.href}`
      }
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
)

export default myAxios;
