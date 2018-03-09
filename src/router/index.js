import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routers'
import { verifyToken } from '../api/api'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

// 登录验证拦截器
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    window.sessionStorage.removeItem('admin')
    next()
    return
  }
  let admin = JSON.parse(window.sessionStorage.getItem('admin'))
  if (!admin && to.path !== '/login') { // 无登录信息访问业务界面,拦截返回登录页
    next({path: '/login'})
    return
  }
  if (admin && to.path !== '/login') { // 无登录信息访问业务界面,拦截返回登录页
    next()
    return
  }
  // 验证登录是否有效
  verifyToken(null).then(data => {
    if (data.status) { // 请求处理成功
      if (data.data) { // 登录无异常
        next()
      } else { // 登录异常
        next({path: '/login'})
      }
    } else {  // 请求处理失败
      next({path: '/login'})
    }
  })
})

export default router
