# mobile-scroll

## 安装
```javascript
import mobileScroll from './plugins/mobile-scroll'

Vue.use(mobileScroll)
```
## 简单使用
```html
<mobile-scroll>
    需要滚动的内容
</mobile-scroll>
```

## 高级用法

### 自定义滚动条样式

```html
<mobile-scroll :config="config">
	大量需要滚动的内容
</mobile-scroll>

<script>
export default {
    data: _=>({
        config: {
            bar: {
                color: '#4F5B8E',
                show: true
            }
        }
    })
}
</script>
```

### 样式配置
#### bar
| 属性 | 类型 | 默认值| 描述 |
| ------------ | ------------| ------------- | ------------ |
|  color | String |rgba(0,0,0,.6)| 滚动条颜色设置，（例： #eee、rgba(0,0,0,0.8)） |
|  show | Boolean | true | 设置是否显示滚动条，不影响列表的滚动功能 |


### 自定义滚动相关功能
```html
<mobile-scroll :config="config">
	大量需要滚动的内容
</mobile-scroll>
<script>
export default {
    data: _=>({
        config: {
            scroller: {
                bouncer: {
                    left: {
                        gap: 0,
                        hold: false
                    },
                    right: {
                        ...
                    },
                    top: {
                        ...
                    },
                    bottom: {
                        ...
                    },
                },
                directionFixed: true
            }
        }
    })
}
</script>
```
#### scroller

| 属性 | 类型 | 默认值 | 描述 |
| ------------ | ------------ | ----------- | ------------ |
|  bouncer | Object | {```left|right|top|bottom: ```[BounceOption](#BounceOption)}[^格式]| 上下左右边缘弹性功能的配置 |
|  directionFixed | Boolean | true | 滚动时是否固定方向，如果false即滚动时可以在x和y方向上同时滚动 |

[^格式]: left,right,top,bottom属性都是BounceOption类

<span id='BounceOption'></span>
######BounceOption
| 属性 | 类型 | 默认值 | 描述 |
| ------------ | ------------ | ----------- | ------------ |
|  gap | Object | 0| 可以弹性的最大范围（px） |
|  hold | Boolean | false | 当拉到最大弹性范围时，是否停住不自动复位 |

### 事件

| 事件名 | 描述 |
| ------------ | ------------ |
|  scroll | 滚动时触发，回调函数接受一个参数：<br>```{x: Number, y: Number, progress(滚动的进度): Number}``` |
|  arrive-left | 滚动到左侧触发 |
|  arrive-right | 滚动到右侧触发 |
|  arrive-top | 滚动到顶部触发 |
|  arrive-bottom | 滚动到底部触发 |
|  bounce-left | 左侧边缘弹性拉伸时触发，回调函数接收一个参数：<br>```{progress(弹性拉伸的进度):Number}``` |
|  bounce-right | 右侧边缘弹性拉伸时触发，回调函数接收一个参数：<br>```{progress(弹性拉伸的进度):Number}``` |
|  bounce-top | 顶部边缘弹性拉伸时触发，回调函数接收一个参数：<br>```{progress(弹性拉伸的进度):Number}``` |
|  bounce-bottom | 底部边缘弹性拉伸时触发，回调函数接收一个参数：<br>```{progress(弹性拉伸的进度):Number}``` |
|  fresh-left | 左侧边缘弹性拉伸达到最大拉伸范围，并松手触发touchend事件的时候触发此事件，接收一个函数参数：弹性复位的函数 |
|  fresh-right | 右侧边缘弹性拉伸达到最大拉伸范围，并松手触发touchend事件的时候触发此事件，接收一个函数参数：弹性复位的函数 |
|  fresh-top | 顶部边缘弹性拉伸达到最大拉伸范围，并松手触发touchend事件的时候触发此事件，接收一个函数参数：弹性复位的函数 |
|  fresh-bottom | 底部边缘弹性拉伸达到最大拉伸范围，并松手触发touchend事件的时候触发此事件，接收一个函数参数：弹性复位的函数 |

```html
<mobile-scroll @fresh-top="freshTop" @bounce-top="bounceTop" ...>
	大量需要滚动的内容
</mobile-scroll>
<script>
export default {
    methods: {
        freshTop (reset) {},
        bounceTop ({progress}) {}
        ...
    }
}
</script>
```

### 实例属性

| 参数名 | 描述 | 只能被读取不能写 |
| ------------ | ------------ | ------------ |
|  scrollTop | 纵向滚动条偏移量 | 否 |
|  scrollLeft | 横向滚动条偏移量 | 否 |
|  scrollHeight | 滚动区域高度 | 是 |
|  offsetHeight | 滚动区域最外层元素的offsetHeight | 是 |
|  offsetWidth | 滚动区域最外层元素的offsetWidth | 是 |
|  clientWidth | 滚动区域最外层元素的clientWidth | 是 |
|  clientHeight | 滚动区域最外层元素的clientHeight | 是 |
|  isDraging | 是否正在被拖拽 | 是 |
|  isTouching | 是否正在被触摸 | 是 |
|  isLeft | 滚动内容是否在最左侧 | 是 |
|  isRight | 滚动内容是否在最右侧 | 是 |
|  isTop | 滚动内容是否在最顶部 | 是 |
|  isBottom | 滚动内容是否在最底部 | 是 |
|  isBounceTop | 滚动区域顶部边缘是否处于弹性拉伸状态 | 是 |
|  isBounceBottom | 滚动区域底部边缘是否处于弹性拉伸状态 | 是 |
|  isBounceLeft | 滚动区域左侧边缘是否处于弹性拉伸状态 | 是 |
|  isBounceRight | 滚动区域右侧边缘是否处于弹性拉伸状态 | 是 |
|  bounceTopProgress | 滚动区域顶部边缘弹性拉伸的进度[0 ~ 1] | 是 |
|  bounceBottomProgress | 滚动区域底部边缘弹性拉伸的进度[0 ~ 1] | 是 |
|  bounceLeftProgress | 滚动区域左侧边缘弹性拉伸的进度[0 ~ 1] | 是 |
|  bounceRightProgress | 滚动区域右侧边缘弹性拉伸的进度[0 ~ 1] | 是 |
```html
<mobile-scroll ref='scroll'>
	大量需要滚动的内容
</mobile-scroll>
<script>
export default {
    mounted () {
        this.$refs.scroll.scrollTop = 100 //ok

        this.$refs.scroll.offsetHeight = 100 //error
    }
}
</script>
```
### 插槽
滚动区域内上下左右四个方位，都有一个固定在其边缘处的插槽，name分别为head、foot、left、right，插槽作用域内接收一个参数：
```html
{
    progress: Number //弹性拉伸的进度
}
```

#####示例
```html
<mobile-scroll ref='scroll'>
    <template v-slot:head="{scroll}"><p>{{scroll.progress}}</p></template>
    <template v-slot:foot="{scroll}"><p>{{scroll.progress}}</p></template>
    <template v-slot:left="{scroll}"><p>{{scroll.progress}}</p></template>
    <template v-slot:right="{scroll}"><p>{{scroll.progress}}</p></template>
	大量需要滚动的内容
</mobile-scroll>
<script>
export default {
    
}
</script>
```
### 全局默认配置

```javascript
Vue.use(mobileScroll, {
  config: {}, // 在这里设置全局默认配置
  name: 'myScroll' // 在这里自定义组件名字，默认是mobile-scroll
});
```

### 配置优先级

##### 行内 > 全局 > 默认


### 方法

| 方法名 | 描述 |
| ------------ | ------------ |
|  bounceReset | 边缘弹性拉伸复位 |
|  scrollToLeft | 滚动到最左侧 |
|  scrollToRight | 滚动到最右侧 |
|  scrollToTop | 滚动到最顶部 |
|  scrollToBottom | 滚动到最底部 |
|  inertiaEnd | 停止惯性缓动 |

### 使用方法

```html
<mobile-scroll ref="scroll">
	大量需要滚动的内容
</mobile-scroll>

<script>
export default {
    mounted() {
        this.$refs.scroll.scrollToTop()
    }
}
</script>
```
