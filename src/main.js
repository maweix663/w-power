import Vue from 'vue'
import App from './App'
import router from './router'

// 框架引用
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

// 接口封装-全局
import http_ from './apis/http.js'
Vue.prototype.http = http_

// 全局事件-经纬度转换
import base from './base'
Vue.use(base);

// 全局
import global_ from './apis/Global.js'
Vue.prototype.GLOBAL = global_

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 字体-otf
import './styles/index.css'

// 公告滚动
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


