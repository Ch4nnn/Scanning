import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'
// 导入全局样式
import '@/assets/css/global.css'
Vue.config.productionTip = false


//配置axios
import axios from 'axios'

import './plugins/element.js'
//配置请求的根路径
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

axios.defaults.baseURL = 'http://127.0.0.1:8000/'

axios.interceptors.request.use(config=>{
  //console.log(config)
  // 为请求头对象，添加 Token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须return config
  console.log(config)

  return config
})

Vue.prototype.$http = axios


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
