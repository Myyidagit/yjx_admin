import Login from '../views/Login.vue'
import Home from '../views/home/Home.vue'
import BaseIndex from '../views/home/BaseIndex.vue'
import TestIndex from '../views/home/TestIndex.vue'
import AdminUser from '../views/admin/User.vue'
import AdminAuthority from '../views/admin/Authority.vue'
import Division from '../views/admin/Division.vue'
import Lock from '../views/lock/lock.vue'
import Realname from "../views/admin/realName.vue"
let routers = [{
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            { path: '/', component: BaseIndex, name: 'BaseIndex' },
            { path: '/test', component: TestIndex, name: 'TestIndex' }
        ]
    },
    {
        path: '/',
        name: 'Admin',
        component: Home,
        children: [
            { path: '/admin/user', component: AdminUser, name: 'AdminUser' },
            { path: '/admin/authority', component: AdminAuthority, name: 'AdminAuthority' },
            { path: '/admin/division', component: Division, name: 'Division' },
            { path: '/admin/realName', component: Realname, name: 'realName' }
        ]
    },
    {
        path: '/lock',
        name: 'lock',
        component: Lock
    }
]

export default routers