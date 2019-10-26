// 引入vue和vue-router
import VueRouter from 'vue-router'
import Vue from 'vue'
// 引入组件login.vue
import Login from '@/views/login/index.vue'

// 使用vue-router
Vue.use(VueRouter)

// 实例化一个路由
const router = new VueRouter({
  // 配置对象
  // 路由规则选项 routes  若干规则
  routes: [{
    // 配置登录页面路由规则
    path: '/login', component: Login
  }]
})

// 导出路由
export default router