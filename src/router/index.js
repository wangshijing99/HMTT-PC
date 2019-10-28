// 引入vue和vue-router
import VueRouter from 'vue-router'
import Vue from 'vue'
// 引入组件login
import Login from '@/views/login/index.vue'
// 引入组件home
import Home from '@/views/home'
// 引入组件welcome
import Welcome from '@/views/welcome'
// 引入组件404
import NotFound from '@/views/404'

// 使用vue-router
Vue.use(VueRouter)

// 实例化一个路由
const router = new VueRouter({
  // 配置对象
  // 路由规则选项 routes  若干规则
  routes: [{
    // 配置登录页面路由规则
    path: '/login',
    component: Login
  },
  { path: '/',
    component: Home,
    children: [
      // 欢迎
      { path: '/', component: Welcome }
    ] },
  // 匹配  不符合路由规则的路径
  { path: '*', component: NotFound }
  ]
})

// 导出路由
export default router
