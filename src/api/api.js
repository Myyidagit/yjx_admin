import axios from 'axios'
import { Loading, Notification } from 'element-ui'

// 加载层控制
let loading = {
    loading: null,
    open: function() {
        this.loading = Loading.service({
            lock: true,
            text: '拼命加载中，请稍后',
            spinner: 'fa fa-spinner fa-4x fa-pulse',
            background: 'rgba(0, 0, 0, 0.7)'
        })
    },
    close: function() {
        this.loading.close()
    }
}

// 请求拦截器：设置headers(添加身份校验参数)
axios.interceptors.request.use(function(config) {
    loading.open() // 打开加载层
        // 设置headers
    let admin = JSON.parse(window.sessionStorage.getItem('admin'))
    if (admin !== null) {
        config.headers.admin_id = admin.admin_id
        config.headers.access_token = admin.access_token
    }
    return config
})

// 响应拦截器：统一处理异常情况
axios.interceptors.response.use(response => {
    loading.close() // 关闭加载层
    return response
}, err => {
    loading.close() // 关闭加载层
    Notification.error({
        title: '错误提示',
        message: '网络错误请稍后重试',
        duration: 2000
    })
    return Promise.reject(err)
})

// API访问地址
let baseUrl = 'http://192.168.0.106:9999'

// 登录
export const login = params => { return axios.post(`${baseUrl}/admin/user/login`, params).then(res => res.data) }
    // 校验登录是否正常（access_token是否过时）
export const verifyToken = params => { return axios.get(`${baseUrl}/admin/user/verify`, params).then(res => res.data) }
    // 获取目录菜单
export const getMenu = params => { return axios.get(`${baseUrl}/authority/getMenu`, params).then(res => res.data) }
    // 获取权限树（权限目录）
export const getAuthorityTree = params => { return axios.post(`${baseUrl}/authority/getAuthorityTree`, params).then(res => res.data) }
    // 分页获取所有权限目录
export const getAuthorityList = params => { return axios.get(`${baseUrl}/authority/list`, { params: params }).then(res => res.data) }
    // 添加权限目录
export const addAuthority = params => { return axios.post(`${baseUrl}/authority/commit`, params).then(res => res.data) }
    // 修改权限状态
export const upateAuthorityStatus = params => { return axios.post(`${baseUrl}/authority/update/status`, params).then(res => res.data) }
    // 获取指定节点的所有上级节点
export const getNodeAuthority = params => { return axios.get(`${baseUrl}/authority/node`, { params: params }).then(res => res.data) }
    //获取需要验证信息的用户列表
export const realName = params => { return axios.get(`${baseUrl}/authentication/account`, { params: params }).then(res => res.data) }
    //获取需要审核信息用户的详细资料
export const realDetail = params => { return axios.get(`${baseUrl}/authentication/autonym`, { params: params }).then(res => res.data) }