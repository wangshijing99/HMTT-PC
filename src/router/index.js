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
// 引入工具
import local from '@/utils/local'
// 引入组件article
import Article from '@/views/article'
// 引入组件images
import Images from '@/views/images'
// 引入组件publish
import Publish from '@/views/publish'
// 引入组件comment
import Comment from '@/views/comment'

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
      { path: '/', component: Welcome },
      { path: '/article', component: Article },
      { path: '/images', component: Images },
      { path: '/publish', component: Publish },
      { path: '/comment', component: Comment }
    ] },
  // 匹配  不符合路由规则的路径
  { path: '*', component: NotFound }
  ]
})

// 添加路由的 导航守卫（前置导航守卫）
router.beforeEach((to, from, next) => {
  // 当每次跳转路由前触发
  // to 跳转到目标 路由对象
  // from 从哪里跳转过来  路由对象
  // next 下一步方法  next()放行  next('/login') 拦截
  // 先拿到客户信息
  const user = local.getUser()
  // 如果登录
  if (user && user.token) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

// 导出路由
export default router
