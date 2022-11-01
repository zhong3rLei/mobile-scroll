<template>
   <div>{{txt}}</div>
</template>

<script>
export default {
    data: ()=>({
        txt: ''
    }),
    methods: {
        setTxt (val) {
            this.txt = val
        }
    }
}
</script>

<style>

</style>