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
          <div>Mall Map</div>
           <nuxt-link to="/stores?type=newstores">New Stores</nuxt-link>
          <div>Shopping Hours</div>
        </div>
      </div>
      <div class="col-6 dropdown-col">
        <div class="menu-dropdown-header">
          <div>Featured Store</div>
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
  }
}
</script>
<style scoped>

</style>