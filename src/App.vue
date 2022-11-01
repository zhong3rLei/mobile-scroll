
<template>
    <div id="app">
        <router-view>
            
        </router-view>
    </div>
</template>

<script setup>
    

</script>

<style>
    #app {
        font-family: Avenir, -apple-system-font, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #fff;
        height: 100%;
        position: relative;
        user-select: none;
        -webkit-touch-callout: none;
        background-color: #666;
    }
    .view_wrap {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .theme_white {
        background-color: rgb(240, 240, 240) !important;
    }
    .theme_black {
        background-color: rgb(48, 48, 48) !important;
    }
    html,
    body {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
        user-select: none;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    p,
    ul,
    li {
        margin: 0;
        padding: 0;
    }
    ul {
        list-style: none;
    }


    .slide-left-leave-active {
        transition: all 0.2s ease;
        transform: translateX(0%);
    }

    .slide-left-enter-active {
        transition: all 0.2s ease;
        transform: translateX(0%);
    }

    .slide-left-enter {
        transform: translateX(100%);
    }

    .slide-left-leave-to {
        transform: translateX(-100%);
    }

    .slide-right-leave-active {
        transition: all 0.2s ease;
        transform: translateX(0%);
    }

    .slide-right-enter-active {
        transition: all 0.2s ease;
        transform: translateX(0%);
    }

    .slide-right-enter {
        transform: translateX(-100%);
    }

    .slide-right-leave-to {
        transform: translateX(100%);
    }
</style>