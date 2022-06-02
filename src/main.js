import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import AgoraRTM from "agora-rtm-sdk";
// icon的图标
import './font_icon/iconfont.css'
// 公共样式
import './assets/css/global.css'
import './assets/css/common.css'
axios.defaults.baseURL = 'https://dt.waibaoke.cn/api/'

Vue.prototype.$imgHttp="https://dt.waibaoke.cn" 
Vue.prototype.$http = axios
Vue.filter('dateFormat', function (originVal) {
  if (originVal) {
    let nums = /^[0-9]*$/;
    if (nums.test(originVal)) {
      const dt = new Date(originVal * 1000)
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')
      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    } else {
      return originVal
    }
  } else {
    return ''
  }


})
Vue.prototype.$http.defaults.headers.common["token"] =  JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).token : '' 

Vue.prototype.client = AgoraRTM.createInstance('36bfd34ea5ac412d98fd7a4e173ee27a');
Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
}).$mount('#app')
