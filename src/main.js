import Vue from 'vue'
import App from './App.vue'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入路由  @是webpack指定的路径别名，绝对路径，只有在js中使用
import router from '@/router'
// import router from './router/index.js'

Vue.config.productionTip = false
// 使用element-ui
Vue.use(ElementUI)

new Vue({
  // 挂载路由到根实例
  router,
  render: h => h(App)
}).$mount('#app')
