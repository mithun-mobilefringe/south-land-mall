<template>
  <div class="menu-modal">
    <div class="col-12 dropdown-box">
      <div class="col-6 dropdown-col">
        <div class="menu-dropdown-header display-border">
          <span>Shop</span>
        </div>
        <div class="dropdown-options">
          <nuxt-link to="/stores">Stores Directory</nuxt-link>
          <nuxt-link to="/promotions">Promotions</nuxt-link>
          <div>Mall Map</div>
          <div>New Stores</div>
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
    this.loadData().then(response => {
      if (response[0] && response[0].data && response[0].data.social) {
        this.socialFeed = response[0].data.social
      }
    })
  },
  computed: {
    instaFeed() {
      var insta = null
      if (
        this.socialFeed &&
        this.socialFeed.instagram &&
        this.socialFeed.instagram.length > 0
      ) {
        insta = _.slice(this.socialFeed.instagram, 0, 6)
      }
      return insta
    }
  },
  methods: {
    loadData: async function(id) {
      try {
        let results = await Promise.all([
          this.$store.dispatch('LOAD_PAGE_DATA', {
            url: 'https://mallmaverick.com/api/v4/twinpines/social.json'
          })
        ])
        return results
      } catch (e) {
        console.log('Error loading data: ' + e.message)
      }
    }
  }
}
</script>
<style scoped>

</style>