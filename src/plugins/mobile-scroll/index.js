import scroll from './src/scroll.vue'

let global_config = null

export default {
    install: (Vue, options = {}) => {
        global_config = options.config
        Vue.component(options.name || scroll.name, scroll)
    },
    get_config: _=> global_config
}