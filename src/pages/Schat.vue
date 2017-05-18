<template>
    <div class="schat__container">
        <sidebar></sidebar>
        <messages></messages>
    </div>
</template>
<script>
    
    import Sidebar from '../components/Sidebar'
    import Messages from '../components/Messages'

    export default{
        name: 'tchat',
        components: { Sidebar, Messages }
    }
</script>
<style scoped>
    .schat__container{
        height: 100%;
    }
</style>
