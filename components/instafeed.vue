<template>
  <div>
    <section
      class="featured-vertical featured-feed-section"
      v-if="instaFeed && instaFeed.length > 0"
    >
      <div class="container">
        <div class="row featured-header">
          <div class="col">
            <span class="home-page-title">Follow Us</span>
            <br />
            <span class="home-page-title-2">@{{property.name}}</span>
          </div>
        </div>
        <div class="row featured-body">
          <div class="col">
            <div class="row">
              <div class="col-sm-6 col-md-3 p-4" v-for="item in instaFeed" :key="item.id">
                <a
                  :href="item.link"
                  :aria-label="item.id"
                  target="_blank"
                  rel="noopener"
                  @keydown.tab="onFocus($event)"
                >
                  <div
                    class="instafeed-image"
                    :aria-label="item.id"
                    :style="'background-image: url(' + item.images.standard_resolution.url + ')'"
                  >
                    <div style="text-align: end" v-if="item.type=='image'">
                      <i class="fa fa-clone insta-type"></i>
                    </div>
                    <div style="text-align: end" v-if="item.type=='video'">
                      <i class="fa fa-video-camera insta-type camera"></i>
                    </div>
                  </div>
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
import { mapGetters } from "vuex";
import moment from "moment";
import tz from "moment-timezone";

export default {
  data() {
    return {
      socialFeed: null
    };
  },
  mounted() {
    this.loadData().then(response => {
      if (response[0] && response[0].data && response[0].data.social) {
        this.socialFeed = response[0].data.social;
      }
    });
  },
  computed: {
    ...mapGetters(["property", "timezone", "locale"]),
    instaFeed() {
      var insta = null;
      if (
        this.socialFeed &&
        this.socialFeed.instagram &&
        this.socialFeed.instagram.length > 0
      ) {
        insta = _.slice(this.socialFeed.instagram, 0, 4);
      }
      return insta;
    }
  },
  methods: {
    loadData: async function(id) {
      try {
        let results = await Promise.all([
          this.$store.dispatch("LOAD_PAGE_DATA", {
            url:
              "http://twinpines.mallmaverick.com/api/v4/twinpines/social.json"
          })
        ]);
        return results;
      } catch (e) {
        console.log("Error loading data: " + e.message);
      }
    }
  }
};
</script>
<style scoped>
.insta-type {
  transform: rotate(180deg);
  font-size: 1.5rem;
  margin: 0.5rem;
  color: black;
  opacity: 7%;
}
.camera {
  transform: none;
}
</style>