function animate({ timing, update, time }) {

    let start = performance.now()

    requestAnimationFrame(function animate(t) {

        let timeFraction = (t - start) / time
        if (timeFraction > 1) timeFraction = 1

        let progress = timing(timeFraction)

        update(progress,()=>{
            timeFraction = 1
        })

        if (timeFraction < 1) {
            requestAnimationFrame(animate)
        }

    })
}

function linear(x) {
    return x
}

function quad(x) {
    return Math.pow(x, 2)
}

function easeOutQuart(x) {
	return 1 - Math.pow(1 - x, 4)
}

export default {
    create: animate,
    linear,
    easeOutQuart,
    quad
}