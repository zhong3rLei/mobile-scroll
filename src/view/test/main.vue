<template>
    <txt ref="test"/>
</template>

<script setup>
import txt from './text.vue'
import {onMounted, ref, watchEffect} from 'vue'


let test = ref(null)
onMounted(()=>{
    test.value.setTxt('heihei')
})
</script>

<style>

</style>