<template>
<div class="menu-modal">
    <div class="col-12 dropdown-box">
      <div class="col-6 dropdown-col">
        <div class="menu-dropdown-header display-border">
          <span><nuxt-link to="/dine">Restaurants</nuxt-link></span>
        </div>
        <div class="dropdown-options">
          <div><nuxt-link :to="getEncodeURI('fine dining')">Fine Dining</nuxt-link></div>
          <div><nuxt-link :to="getEncodeURI('fast food')">Fast Food</nuxt-link></div>
          <div><nuxt-link :to="getEncodeURI('coffee & drinks')">Coffee & Drinks</nuxt-link></div>
          <div><nuxt-link :to="getEncodeURI('asian food')">Asian Food</nuxt-link></div>
          <div><nuxt-link :to="getEncodeURI('italian food')">Italian Food</nuxt-link></div>
          <div><nuxt-link :to="getEncodeURI('bubble tea')">Bubble Tea</nuxt-link></div>
        </div>
      </div>
      <div class="col-6 dropdown-col">
        <div class="menu-dropdown-header">
          <span>Featured Restaurant</span>
        </div>
        <div class="dropdown-img">
          <img :src="featured_store.logo_image_url">
        </div>
        <div>
          <span class="display-name">{{featured_store.name}}</span>
        </div>
        <div class="dropdown-visit">
          <nuxt-link :to="/stores/ + featured_store.slug">Visit {{featured_store.name}}</nuxt-link>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'

export default {
  props:['featured_store'],
  data() {
    return {
      socialFeed: null
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    getEncodeURI: function(string) {
      return '/dine?type=' + encodeURIComponent(string);
    }
  }
}
</script>
<style scoped>

</style>