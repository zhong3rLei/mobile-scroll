import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import './register-sw'
import mobileScroll from './plugins/mobile-scroll/'

let app = createApp(App)
app.use(mobileScroll)
app.use(router)
app.use(store)
app.mount('#app')


export default app