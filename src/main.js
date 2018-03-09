import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import './assets/css/animate.min.css'
import Vuex from 'vuex'
Vue.use(Vuex)
Vue.use(ElementUI)
Vue.config.productionTip = false
const store = new Vuex.Store({
    state: {
        lock_status: true,
        url: '',
        numeList: [{
            title: '首页',
            name: '9999',
            closable: false,
            link: ''
        }]
    },
    mutations: { // 主页里面的详情页面
        CHANGE_STATUS(state, i) {
            state.lock_status = i
        },
        CHANGE_URL(state, url) {
            state.url = url
        },
        // 增加顶部导航栏
        CHANGE_MENUlIST(state, i) {
            var flag = false
            state.numeList.map((item, index) => {
                if (item.name === i.name) {
                    flag = true
                }
            })
            if (!flag) {
                state.numeList.push(i)
            }
        },
        // 删除顶部导航栏
        REMOVE_MENUlIST(state, i) {
            state.numeList.map((item, index) => {
                if (item.name === i) {
                    state.numeList.splice(index, 1)
                }
            })
        }
    }
})

router.beforeEach((to, from, next) => {
        if (to.path === '/lock') {
            store.commit('CHANGE_STATUS', false)
            next()
            return
        }
        if (to.path !== '/lock') {
            const lock = store.state.lock_status
            if (!lock) {
                next({ path: '/lock' })
            } else {
                next()
            }
        }
    })
    /* eslint-disable no-new */
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')