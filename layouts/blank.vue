<template>
  <div>
    <nuxt class="router_content" />
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import Stickyfill from 'stickyfilljs'
  export default {
    transition: 'page',
  }
</script>
