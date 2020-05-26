<template>
  <div>
    <section
      class="featured-vertical featured-feed-section"
      v-if="instaFeed && instaFeed.length > 0"
    >
      <div class="container">
        <div class="row featured-header">
          <div class="col">
            <h1>
              Follow our story.
              <br />@beverlycenter
            </h1>
            <hr class="primary" />
          </div>
        </div>
        <div class="row featured-subheader">
          <div class="col">
            <a
              class="btn-link btn-right-arrow"
              href="https://www.instagram.com/explore/tags/beverlycenter/"
              target="_blank"
              rel="noopener"
              @keydown.tab="clear($event)"
            >Follow #BeverlyCenter</a>
          </div>
        </div>
        <div class="row featured-body">
          <div class="col">
            <div class="row">
              <div class="col-sm-6 col-md-4 p-4" v-for="item in instaFeed">
                <a
                  :href="item.link"
                  target="_blank"
                  rel="noopener"
                  aria-label="Click to see on Instagram"
                  @keydown.tab="onFocus($event)"
                >
                  <div
                    class="instafeed-image"
                    :style="'background-image: url(' + item.images.standard_resolution.url + ')'"
                  ></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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