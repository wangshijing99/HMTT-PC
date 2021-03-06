// 封装一个axios模块
import axios from 'axios'
// 引入工具中的local.js文件
import local from '@/utils/local.js'
// 引入router
import router from '@/router'
// 引入json-bigint
import jsonBigInt from 'json-bigint'

// 对axios进行配置
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// `transformResponse` 在传递给 then/catch 前，允许修改响应数据
// 对ID进行处理，避免误差
axios.defaults.transformResponse = [(data) => {
  // 对 data 进行任意转换处理
  // 对data进行格式转换  data就是后台响应的json字符串
  // 如果没数据呢？data === null 使用jsonBigInt.parse(null) 报错
  try {
    return jsonBigInt.parse(data)
  } catch (err) {
    return data
  }
}]

// 设置请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做一些事情//拦截成功 往headers中加token
  const user = local.getUser() || {}
  config.headers.Authorization = `Bearer ${user.token}`
  return config
}, function (error) {
  // 做一些有请求错误的事情
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  // 获取响应状态码 是不是401(token过期或未传)即判断token是否有效 err.response 响应对象  err.response.status 状态码
  if (error.response.status === 401) {
    // 如果是 跳转登录页面
    // 不推荐window.location.href = 'http://localhost:8080/#/login'
    // 不推荐window.location.hash = '#/login'
    // 使用vue-router进行跳转
    return router.push('/login')
  }
  return Promise.reject(error)
})

export default axios
