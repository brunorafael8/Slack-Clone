<template>
  <div id="app">
      <router-view></router-view>

  </div>
</template>

<script>
export default {
  name: 'app'
}

</script>

<style lang="scss">
  body{
    background: rgb(14,0,73); /* Old browsers */
background: -moz-linear-gradient(left, rgba(14,0,73,1) 2%, rgba(0,158,195,1) 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(left, rgba(14,0,73,1) 2%,rgba(0,158,195,1) 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to right, rgba(14,0,73,1) 2%,rgba(0,158,195,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#0e0049', endColorstr='#009ec3',GradientType=1 ); /* IE6-9 */
  }
 #app{
   height: 100%;
 }

</style>  
