<template>
    <div class="scroll-wrap" ref="wrap">
        <div class="slot-head">
           <slot name="head" v-bind:scroll="{progress: bounceTopProgress}"></slot> 
        </div>
        <div class="slot-foot">
           <slot name="foot" v-bind:scroll="{progress: bounceBottomProgress}"></slot> 
        </div>
        <div class="slot-left">
           <slot name="left" v-bind:scroll="{progress: bounceLeftProgress}"></slot> 
        </div>
        <div class="slot-right">
           <slot name="right" v-bind:scroll="{progress: bounceRightProgress}"></slot> 
        </div>
        <div class="scroll-content" ref="content" @touchstart="touchstart" :style="{
            transform: `translate(${translateX}px, ${translateY}px)`
        }">
            <slot></slot>
            <div class="cover" v-if="cover"></div>
        </div>
        
        <div class="rail_y" ref="rail_y" :class="{visble: scroll_y && inner_config.bar.show && inner_config.bar.y.show}">
            <div class="bar_y" :class="{show: bar_show, hide: !bar_show}" :style="{
                backgroundColor: inner_config.bar.color,
                height: bar_size_y + 'px',
                top: bar_top_y + 'px'
            }"></div>
        </div>
        <div class="rail_x" ref="rail_x" :class="{visble: scroll_x && inner_config.bar.show && inner_config.bar.x.show}">
            <div class="bar_x" :class="{show: bar_show, hide: !bar_show}" :style="{
                backgroundColor: inner_config.bar.color,
                width: bar_size_x + 'px',
                left: bar_left_x + 'px'
            }"></div>
        </div>
    </div>
</template>

<script>
import animate from './animate'
import {interruptor, mergeObject, onceBeatXYCollector} from './util'
import index from '../index'

export default {
    name: 'mobile-scroll',
    props: {
        config: {
            type: Object,
            default: () => ({})
        }
    },
    data: () => ({
        inner_config: {
            bar: {
                show: true,
                color: 'rgba(0,0,0,0.6)',
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            },
            scroller: {
                bouncer: {
                    left: {
                        gap: 0,
                        hold: false
                    },
                    right: {
                        gap: 0,
                        hold: false
                    },
                    top: {
                        gap: 0,
                        hold: false
                    },
                    bottom: {
                        gap: 0,
                        hold: false
                    },
                },
                directionFixed: true
            }
        },
        startX: 0,
        startY: 0,
        translateX: 0,
        translateY: 0,
        content_size: {
            width: '0',
            height: '0'
        },
        scroll_x: false,
        scroll_y: false,
        wrap_width: 0,
        wrap_height: 0,
        content_width: 0,
        content_height: 0,
        lastMoveTime: 0,
        lastMoveStartX: 0,
        lastMoveStartY: 0,
        stopInertiaMove: true,
        touchEnd: null,
        bar_size_y: 0,
        bar_top_y: 0,
        rail_y_height: 0,
        bar_size_x: 0,
        bar_left_x: 0,
        rail_x_width: 0,
        bar_show: false,
        touched: false,
        drag: false,
        cover: false,
        scrollDirection: null //滚动方向
    }),
    methods: {
        touchstart (e) {
            this.touched = true
            this.inertiaEnd()

            this.lastMoveTime = Date.now()

            let clientX = this.startX = -this.translateX + e.touches[0].clientX,
                clientY = this.startY = -this.translateY + e.touches[0].clientY

            onceBeatXYCollector.start(e.touches[0].clientX, e.touches[0].clientY)

            interruptor.break(()=>{
                this.bar_show = true
            })

        },
        touchend (e) {
            //是否处于需要缓动的情况
            if (this.lastMoveTime) {
                this.stopInertiaMove = false
            }
            if (this.isBounceTop || this.isBounceBottom || this.isBounceLeft || this.isBounceRight) {
                if (this.bounceTopProgress == 1) {
                    this.$emit('fresh-top',this.bounceReset)
                } else if (this.bounceBottomProgress == 1) {
                    this.$emit('fresh-bottom',this.bounceReset)
                } else if (this.bounceLeftProgress == 1) {
                    this.$emit('fresh-left',this.bounceReset)
                } else if (this.bounceRightProgress == 1) {
                    this.$emit('fresh-right',this.bounceReset)
                } else {
                    this.bounceReset() //复位
                }
            }
            this.clearMemory()
        },
        bounceReset () {

            let x = this.translateX, 
                y = this.translateY
            animate.create({
                timing: animate.easeOutQuart,
                update: (ratio,stop) => {
                    if (this.touched) return stop()
                    if (this.isBounceTop) {
                        this.translateY = y * (1 - ratio)
                    } 
                    if (this.isBounceBottom) {
                        this.translateY = y + this.inner_config.scroller.bouncer.bottom.gap * ratio
                    } 
                    if (this.isBounceLeft) {
                        this.translateX = x * (1 - ratio)
                    }
                    if (this.isBounceRight) {
                        this.translateX = x + this.inner_config.scroller.bouncer.right.gap * ratio
                    }
                },
                time: 500
            })
        },
        inertiaMove (v_x,v_y) {
                //公式
                //v = v_0 + a*t
                //s = 1/2*a*t^2 + v_0*t
            let t = 2000, //2秒2000毫秒
                a_x = -v_x/t, //假设要在2秒内速度降为零，x轴所需要的加速度
                s_x = 1/2 * a_x * Math.pow(t, 2) + v_x * t, //减速到0的时候x轴所滑动的距离
                a_y = -v_y/t, //假设要在2秒内速度降为零，y轴所需要的加速度
                s_y = 1/2 * a_y * Math.pow(t, 2) + v_y * t //减速到0的时候x轴所滑动的距离

            //通常情况下这样计算出的距离都特别大
            //限制滑动最大距离是1000
            if (s_x > 1000) s_x = 1000
            if (s_y > 1000) s_y = 1000
            if (s_x < -1000) s_x = -1000
            if (s_y < -1000) s_y = -1000
            let old_x = this.translateX, old_y = this.translateY
            animate.create({
                timing: animate.easeOutQuart,
                update: (ratio,stop) => {
                    if(this.stopInertiaMove) {
                        this.inertiaEnd(); //停止缓动
                        stop()
                        return
                    }
                    this.scrollX(-(old_x+s_x*ratio))
                    this.scrollY(-(old_y+s_y*ratio))
                    if (ratio == 1) {
                        this.inertiaEnd();
                    }
                },
                time: t
            })
        },
        inertiaEnd () {
            this.touchEnd = null
            this.stopInertiaMove = true
            this.lastMoveTime = 0
            this.lastMoveStartX = 0
            this.lastMoveStartY = 0

            this.flashhideScrollBar()
        },
        clearMemory () {
            this.touched = false
            this.startX = this.startY = 0
            this.drag = false
            this.scrollDirection = null
            onceBeatXYCollector.reset()
        },
        touchmove (e) {
            this.cover = true
            if (this.touched) {
                this.drag = true
                this.touchEnd = e.touches[0]
                this.stopInertiaMove = false

                let clientX = e.touches[0].clientX,
                    clientY = e.touches[0].clientY;
                
                onceBeatXYCollector.done((x,y) => {
                    if (Math.abs(clientX - x) >= Math.abs(clientY - y)) {
                        this.scrollDirection = 'x'
                    } else {
                        this.scrollDirection = 'y'
                    }
                })

                if (this.scroll_x && ((this.scrollDirection == 'x' && this.inner_config.scroller.directionFixed) || !this.inner_config.scroller.directionFixed)) {
                    
                    if((this.isBounceLeft || this.isLeft) && this.inner_config.scroller.bouncer.left.gap > 0) {
                        this.bounceScrollX( - clientX + this.startX)
                    } else if((this.isBounceRight || this.isRight) && this.inner_config.scroller.bouncer.right.gap > 0) {
                        this.bounceScrollX( - clientX + this.startX)
                    } else {
                        this.scrollX(- clientX + this.startX)
                    }

                }
                if (this.scroll_y && ((this.scrollDirection == 'y' && this.inner_config.scroller.directionFixed) || !this.inner_config.scroller.directionFixed)) {
                    if((this.isBounceTop || this.isTop) && this.inner_config.scroller.bouncer.top.gap > 0) {
                        this.bounceScrollY( - clientY + this.startY)
                    } else if((this.isBounceBottom || this.isBottom) && this.inner_config.scroller.bouncer.bottom.gap > 0) {
                        this.bounceScrollY( - clientY + this.startY)
                    } else {
                        this.scrollY( - clientY + this.startY)
                    }
                    
                }
                
            }
        },
        positionCorrectX () {
            //判断是否滑动到开头了
            if (this.translateX > 0) {
                this.translateX = 0
            }
            //判断是否滑动到末尾了
            if (this.translateX <= this.wrap_width - this.content_width) {
                this.translateX = this.wrap_width - this.content_width
            }
        },
        positionCorrectY () {
            //判断是否滑动到开头了
            if (this.translateY > 0) {
                this.translateY = 0
            }
            //判断是否滑动到末尾了
            if (this.translateY <= this.wrap_height - this.content_height) {
                this.translateY = this.wrap_height - this.content_height
            }
        },
        refresh () {
            this.translateX = 0
            this.translateY = 0
            this.$nextTick(() => {
                let wrap_style = getComputedStyle(this.$refs.wrap),
                    content_style = getComputedStyle(this.$refs.content),
                    rail_y_style = getComputedStyle(this.$refs.rail_y),
                    rail_x_style = getComputedStyle(this.$refs.rail_x)

                this.wrap_width = parseFloat(wrap_style.width)
                this.wrap_height = parseFloat(wrap_style.height)
                this.content_width = parseFloat(content_style.width)
                this.content_height = parseFloat(content_style.height)
                this.rail_y_height = parseFloat(rail_y_style.height)
                this.rail_x_width = parseFloat(rail_x_style.width)

                if (this.wrap_width < this.content_width) {
                    this.scroll_x = true
                    this.bar_size_x = (this.wrap_width/this.content_width) * this.rail_x_width
                    if (this.bar_size_x < 10) this.bar_size_x = 10
                } else {
                    this.scroll_x = false
                }
                if (this.wrap_height < this.content_height) {
                    this.scroll_y = true
                    this.bar_size_y = (this.wrap_height/this.content_height) * this.rail_y_height
                    if (this.bar_size_y < 10) this.bar_size_y = 10
                } else {
                    this.scroll_y = false
                }

            })
        },
        scrollX(num) {
            if (this.scroll_x) {
                this.translateX = -num
                this.positionCorrectX() //位置矫正
                this.setBarX() //设置滚动条位置
            }
        },
        scrollY (num) {
            if (this.scroll_y) {
                this.translateY = -num
                this.positionCorrectY() //位置矫正
                this.setBarY() //设置滚动条位置
            }
        },
        bounceScrollY (num) {
            this.translateY = -num
            //判断是否滑动到开头了
            if (this.translateY > this.inner_config.scroller.bouncer.top.gap) {
                this.translateY = this.inner_config.scroller.bouncer.top.gap
            }
            //判断是否滑动到末尾了
            if (this.translateY <= this.wrap_height - this.content_height - this.inner_config.scroller.bouncer.bottom.gap) {
                this.translateY = this.wrap_height - this.content_height - this.inner_config.scroller.bouncer.bottom.gap
            }
            
            if (this.isBounceTop) {
                this.$emit('bounce-top',{
                    progress: this.bounceTopProgress
                })
            }
            if (this.isBounceBottom) {
                this.$emit('bounce-bottom',{
                    progress: this.bounceBottomProgress
                })
            }
        },
        bounceScrollX (num) {
            this.translateX = -num
            //判断是否滑动到开头了
            if (this.translateX > this.inner_config.scroller.bouncer.left.gap) {
                this.translateX = this.inner_config.scroller.bouncer.left.gap
            }
            //判断是否滑动到末尾了
            if (this.translateX <= this.wrap_width - this.content_width - this.inner_config.scroller.bouncer.right.gap) {
                this.translateX = this.wrap_width - this.content_width - this.inner_config.scroller.bouncer.right.gap
            }
            
            if (this.isBounceLeft) {
                this.$emit('bounce-left',{
                    progress: this.bounceLeftProgress
                })
            }
            if (this.isBounceRight) {
                this.$emit('bounce-right',{
                    progress: this.bounceRightProgress
                })
            }
        },
        scrollToLeft () {
            this.scrollX(0)
        },
        scrollToRight () {
            this.scrollX(this.content_width - this.wrap_width)
        },
        scrollToTop () {
            this.scrollY(0)
        },
        scrollToBottom () {
            this.scrollY(this.content_height - this.wrap_height)
        },
        setBarX () {
            this.bar_left_x = (-this.translateX / this.content_width) * this.rail_x_width
        },
        setBarY () {
            this.bar_top_y = (-this.translateY / this.content_height) * this.rail_y_height
        },
        flashhideScrollBar () {
            interruptor.delay(()=>{
                this.bar_show = false
            },2000)
        },
        emitScroll () {
            let progressX = this.scrollLeft / (this.content_width - this.wrap_width),
                progressY = this.scrollTop / (this.content_height - this.wrap_height)
            this.$emit('scroll', {
                x: this.scrollLeft,
                y: this.scrollTop,
                progressX: progressX || 0,
                progressY: progressY || 0 
            })
            if (this.scroll_x) {
                if (progressX == 0) {
                    this.$emit('arrive-left')
                } else if (progressX == 1) {
                    this.$emit('arrive-right')
                }
            }
            if (this.scroll_y) {
                if (progressY == 0) {
                    this.$emit('arrive-top')
                } else if (progressY == 1) {
                    this.$emit('arrive-bottom')
                }
            }
        }
    },
    computed: {
        scrollHeight () {
            return this.content_height
        },
        scrollWidth () {
            return this.content_width
        },
        offsetHeight () {
            let wrap = this.$refs.wrap
            return wrap.offsetHeight
        },
        offsetWidth () {
            let wrap = this.$refs.wrap
            return wrap.offsetWidth
        },
        clientHeight () {
            let wrap = this.$refs.wrap
            return wrap.clientHeight
        },
        clientWidth () {
            let wrap = this.$refs.wrap
            return wrap.clientWidth
        },
        scrollLeft:{
            get () {
                return -this.translateX
            },
            set (val) {
                this.scrollX(parseFloat(val))
            }
        },
        scrollTop: {
            get () {
                return -this.translateY
            },
            set (val) {
                this.scrollY(parseFloat(val))
            }
        },
        isDraging () {
            return this.drag
        },
        isTouching () {
            return this.touched
        },
        isLeft () {
            if (this.scroll_x) return this.scrollLeft == 0
            else return true
        },
        isRight () {
            if (this.scroll_x) return this.scrollLeft == this.content_width - this.wrap_width
            else return true
        },
        isTop () {
            if (this.scroll_y) return this.scrollTop == 0
            else return true
        },
        isBottom () {
            if (this.scroll_y) return this.scrollTop == this.content_height - this.wrap_height
            else return true
        },
        isBounceTop () {
            if (this.scroll_y) return this.scrollTop < 0
            else return false
        },
        isBounceBottom () {
            if (this.scroll_y) return this.scrollTop > this.content_height - this.wrap_height
            else return false
        },
        isBounceLeft () {
            if (this.scroll_x) return this.scrollLeft < 0
            else return false
        },
        isBounceRight () {
            if (this.scroll_x) return this.scrollLeft > this.content_width - this.wrap_width
            else return false
        },
        bounceTopProgress () {
            let gap = this.inner_config.scroller.bouncer.top.gap
            if (this.scrollTop <= 0 && gap > 0 && this.scroll_y) return -this.scrollTop / gap
            else return 0
        },
        bounceBottomProgress () {
            let gap = this.inner_config.scroller.bouncer.bottom.gap
            if (this.scrollTop >= this.content_height - this.wrap_height && gap && this.scroll_y) return (this.scrollTop - (this.content_height - this.wrap_height)) / gap
            else return 0
        },
        bounceLeftProgress () {
            let gap = this.inner_config.scroller.bouncer.left.gap
            if (this.scrollLeft <= 0 && gap && this.scroll_x) return -this.scrollLeft / gap
            else return 0
        },
        bounceRightProgress () {
            let gap = this.inner_config.scroller.bouncer.right.gap
            if (this.scrollLeft >= this.content_width - this.wrap_width && gap && this.scroll_y) return (this.scrollLeft - (this.content_width - this.wrap_width)) / gap
            else return 0
        }
    },
    watch: {
        config:{
            handler () {
                if (this.config) {
                    this.inner_config = mergeObject(this.inner_config,this.config)
                    this.refresh()
                }
            },
            immediate: true
        },
        scrollLeft (now, prev) {
            if (now != prev) {
                this.emitScroll()
            }
        },
        scrollTop (now, prev) {
            if (now != prev) {
                this.emitScroll()
            }
        }
    },
    mounted () {
        this.refresh()

        const watch_content_resize = call => {
            let content_style = getComputedStyle(this.$refs.content)
            if (this.content_size.width != content_style.width || this.content_size.height != content_style.height) {
                this.content_size.width = content_style.width
                this.content_size.height = content_style.height
                call()
            }
        }
        const watch_inertia = (() => {
            let loop_touched = false
            return () => {
                let now = Date.now()
                
                //判断滚动区touched状态是否由false变为true
                if(loop_touched == false && this.touched == true) {
                    this.lastMoveTime = now
                    this.lastMoveStartX = this.translateX
                    this.lastMoveStartY = this.translateY
                        
                    loop_touched = true
                }
                //如果touched一直是true，说明是在touchmove或者不动记录期间
                if (loop_touched == true && this.touched == true) {
                    //每100ms记录一次，判断是否需要进行新的记录
                    if (now - this.lastMoveTime > 50) {
                        this.lastMoveTime = now
                        this.lastMoveStartX = this.translateX
                        this.lastMoveStartY = this.translateY
                    }
                }
                //如果touched状态由true变为false，说明touchend事件触发
                if (loop_touched == true && this.touched == false) {
                    loop_touched = false
                    let nowX = this.translateX, nowY = this.translateY,
                    //计算最后100ms内手指的速度
                    vx = (nowX - this.lastMoveStartX) / (now - this.lastMoveTime),
                    vy = (nowY - this.lastMoveStartY) / (now - this.lastMoveTime); 
                        
                    //触发touchend时，如果x或y方向上有速度，同时滚动组件没有处于弹性回弹状态
                    if (vx != 0 || vy != 0 && (!this.isBounceTop && !this.isBounceBottom && !this.isBounceLeft && !this.isBounceRight)) {
                        //执行缓动
                        this.inertiaMove(vx,vy)
                    } else {
                        //不需要执行缓动
                        //去掉遮罩
                        setTimeout(()=>{
                            this.cover = false
                        },400)
                        //隐藏一下滚动条
                        this.flashhideScrollBar()
                        
                    }
                }
            }
        })()
        //脏检查
        let loop = () => {
            window.requestAnimationFrame(() => {
                loop();
            });
            watch_content_resize(()=>{
                let wrap_height = getComputedStyle(this.$refs.wrap).height
                //如果计算属性中的height为空字符串，则该元素可能没有被渲染，只是在内存中存储，此时不能算作是resize
                if (wrap_height != '') {
                    this.refresh()
                }
            })
            watch_inertia()
        };
        loop();
    },
    created () {
        let global_config = index.get_config();
        this.inner_config = mergeObject(this.inner_config, global_config)
        if (Reflect.ownKeys(this.config).length > 0) {
            this.inner_config = mergeObject(this.inner_config, this.config)
        }
        
        window.addEventListener('touchmove', this.touchmove)
        window.addEventListener('touchend', this.touchend)
    },
    beforeDestroy () {
        window.removeEventListener('touchmove', this.touchmove)
        window.removeEventListener('touchend', this.touchend)
    }
}
</script>

<style scoped>
.scroll-wrap {
    width: 100%;
    height: 100%;
    position: relative;
}

.slot-head {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1;
}
.slot-foot {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 1;
}
.slot-left {
    position: absolute;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
}
.slot-right {
    position: absolute;
    height: 100%;
    right: 0;
    top: 0;
    z-index: 1;
}
.scroll-content {
    display: inline-block;
    position: relative;
    z-index: 2;
}
.scroll-content .cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height:100%;
    z-index: 1;
}
.rail_y {
    position: absolute;
    right: 5px;
    top:5px;
    bottom: 5px;
    width: 5px;
    z-index: 1000;
    visibility: hidden;
}
.bar_y {
    position: absolute;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.6);
    border-radius: 10px;
    transition: opacity 0.5s ease;
}
.rail_x {
    position: absolute;
    right: 5px;
    left:5px;
    bottom: 5px;
    height: 5px;
    z-index: 1000;
    visibility: hidden;
}
.bar_x {
    position: absolute;
    bottom: 0;
    top: 0;
    background-color: rgba(0,0,0,.6);
    border-radius: 10px;
    transition: opacity 0.5s ease;
}
.bar_y.show {
    opacity: 1;
}
.bar_y.hide {
    opacity: 0;
}
.bar_x.show {
    opacity: 1;
}
.bar_x.hide {
    opacity: 0;
}
.visble {
    visibility: visible;
}
</style>