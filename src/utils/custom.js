import { getCurrentInstance, onBeforeMount, reactive, ref } from "vue"
import { useStore } from "vuex"
import { useRoute,useRouter } from 'vue-router'

export const useReactive = val => {
    if (typeof val == 'object') {
        let keys = Reflect.ownKeys(val), object = val instanceof Object ? {} : []
        for (let k of keys) {
            object[k] = ref(val[k])
        }
        return object
    } else {
        console.warn('you should use method "useRef" to contain your data. I have transfer to a ref data for you.')
        return ref(val)
    }
}

export class Emitter {
    constructor () {
        this.store = {}
        this.emits = {}
    }
    on (k, call) {
        if (this.store[k]) {
            this.store[k].push(call)
        } else {
            this.store[k] = [call]
        }

        if (this.emits[k]) {
            let lastValue = this.emits[k][this.emits[k].length - 1]
            call(...lastValue)
        }
    }
    emit (k) {
        let args = [...arguments]
        args.splice(0,1)
        if (this.store[k]) {
            this.store[k].forEach(call => {
                call(...args)
            })
        }
        if (this.emits[k]) {
            this.emits[k].push([...args])
        } else {
            this.emits[k] = [[...args]]
        }
    }
}

export const injectDepandence = (call) => {
    let store = useStore(),route = useRoute(), router = useRouter()
    return function () {
        return call({store,route,router},...arguments)
    }
}



