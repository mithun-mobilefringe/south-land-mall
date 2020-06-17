<template>
<div class="menu-modal">
    <div class="col-12 dropdown-box">
      <div class="col-6 dropdown-col">
        <div class="menu-dropdown-header display-border">
          <span>About Us</span>
        </div>
        <div class="dropdown-options">
          <div>Mall Hours</div>
          <div>Contact Us</div>
          <nuxt-link to="/jobs">Careers</nuxt-link>
        </div>
      </div>
      <div class="col-6 dropdown-col">
        <div class="menu-dropdown-header">
          <div>&nbsp</div>
        </div>
        <div class="dropdown-img">
          <img src="//codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1546551307522/eventplaceholder2@2x.png">
        </div>
        <!-- <div>
          <span class="display-name">Info</span>
        </div>
        <div class="dropdown-visit">
          Read Blog
        </div> -->
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