<template>
    <div class="schat__container">
        <sidebar></sidebar>
        <messages></messages>
    </div>
</template>
<script>
    
    import Sidebar from '../components/sidebar/Sidebar'
    import Messages from '../components/messages/Messages'

    export default{
        name: 'schat',
        components: { Sidebar, Messages }
    }
</script>
<style scoped>
    .schat__container{
        height: 100%;
    }
</style>
