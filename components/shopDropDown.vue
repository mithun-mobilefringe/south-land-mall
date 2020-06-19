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
      <div class="col-6 dropdown-col" v-if="featured_store">
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
      <div class="dropdown-empty" v-else>
        <div class="dropdown-img">
          <img src="//codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1546551307522/eventplaceholder2@2x.png">
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
  props:['featured_stores'],
  data() {
    return {
      socialFeed: null,
      featured_store: null
    }
  },
  mounted() {
    if(this.featured_stores)
    this.featured_store = this.featured_stores[0];
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style scoped>

</style>