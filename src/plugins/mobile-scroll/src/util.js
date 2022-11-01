export const interruptor = (()=>{
    let num = 0
    return {
        delay (call, timing) {
            let flag = num
            setTimeout(() => {
                if (flag == num) call && call()
            },timing)
        },
        break (call) {
            num++
            call && call()
        }
    }
}) ()

export const mergeObject = (a, b) => {
    let obj = Object.assign({},a)
    for (let prop in b) {
        if (obj[prop] == undefined) {
            obj[prop] = b[prop]
        } else if (obj[prop] instanceof Object && !Array.isArray(obj[prop]) && b[prop] instanceof Object && !Array.isArray(b[prop])) {
            obj[prop] = mergeObject(obj[prop],b[prop])
        } else {
            obj[prop] = b[prop]
        }
    }
    return obj
}

export const onceBeatXYCollector = (()=>{
    let flag = false,x,y
    return {
        start (startx, starty) {
            x = startx
            y = starty
        },
        done (call) {
            if (flag) return
            call && call(x,y)
            flag = true
        },
        reset () {
            flag = false
            x = null
            y = null
        }
    }
})()