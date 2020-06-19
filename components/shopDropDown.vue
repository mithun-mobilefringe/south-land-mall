<template>
  <div class="menu-modal">
    <div class="col-12 dropdown-box">
      <div class="col-6 dropdown-col">
        <div class="menu-dropdown-header display-border">
          <!-- <span>Shop</span> -->
          <nuxt-link to="/stores">Stores Directory</nuxt-link>
        </div>
        <div class="dropdown-options">
          <nuxt-link to="/promotions">Promotions</nuxt-link>
          <div><nuxt-link to="/map">Mall Map</nuxt-link></div>
           <nuxt-link to="/stores?type=newstores">New Stores</nuxt-link>
          <div>Shopping Hours</div>
        </div>
      </div>
      <div class="col-6 dropdown-col">
        <div class="menu-dropdown-header">
          <div>Featured Store</div>
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
      socialFeed: null,
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style scoped>

</style>