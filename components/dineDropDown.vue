<template>
<div class="menu-modal">
    <div class="col-12 dropdown-box">
      <div class="col-6 dropdown-col">
        <div class="menu-dropdown-header display-border">
          <span><nuxt-link to="/dine">Restaurants</nuxt-link></span>
        </div>
        <div class="dropdown-options">
          <div><nuxt-link to="/stores?type=fine dining">Fine Dining</nuxt-link></div>
          <div><nuxt-link to="/stores?type=fast food">Fast Food</nuxt-link></div>
          <div><nuxt-link :to="getEncodeURI('coffee & drinks')">Coffee & Drinks</nuxt-link></div>
          <div><nuxt-link to="/stores?type=asian food">Asian Food</nuxt-link></div>
          <div><nuxt-link to="/stores?type=italian food">Italian Food</nuxt-link></div>
          <div><nuxt-link to="/stores?type=bubble tea">Bubble Tea</nuxt-link></div>
        </div>
      </div>
      <div class="col-6 dropdown-col">
        <div class="menu-dropdown-header">
          <span>Featured Restaurant</span>
        </div>
        <div class="dropdown-img">
          <img src="https://www.mallmaverick.com/system/stores/store_fronts/000/045/770/original/Bath___Body_Works.jpg?1548438769">
        </div>
        <div>
          <span class="display-name">Store.name</span>
        </div>
        <div class="dropdown-visit">
          Visit Store
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
      return '/stores?type=' + encodeURIComponent(string);
    }
  }
}
</script>
<style scoped>

</style>