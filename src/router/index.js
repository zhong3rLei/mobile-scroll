import {
    createWebHashHistory,
    createRouter
} from 'vue-router'
import test from '../view/test/'
export default createRouter({
    history: createWebHashHistory(window.location.pathname),
    routes: [
        {
            path: '/',
            name: 'test',
            component: test
        }
    ],
})