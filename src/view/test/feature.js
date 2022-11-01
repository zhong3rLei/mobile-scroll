import { onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import {injectDepandence} from '../../utils/custom'

export default function () {
    return {
        test: injectDepandence(({store})=>{
            setTimeout(()=>{
                console.log(store)
            })
        })
    }
}
