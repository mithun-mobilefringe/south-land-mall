<template>
  <div class="promo_dets_container">
    <div class="site_container container">
      <div class="row d-none d-sm-block">
        <div class="col-12 top-section" v-if="pages">
          <div class="col-6 top-section-detail">
            <div class="detail">
              <div class="detail-internal">
                <div class="detail-date"></div>
                <div class="detail-name">{{pages.title}}</div>
                <div class="detail-description">
                  <span v-html="pages.body"></span>
                </div>

                <div class="detail-buttons">
                  <div class="visit-button btn col-6">
                    <nuxt-link to="/">GET DIRECTIONS</nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6 p-0 img-box">
            <div class="img" v-lazy:background-image="pages.image_url">
              <!-- <img :src="property.image_url"/> -->
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 other-services">{{property.name}} SERVICES</div>
      </div>
      <hr />
      <div v-if="showSubpageDetails">
        <transition name="slide">
          <div class="row">
            <div class="col-12 col-sm-4 selected-subpage">
              <div class="selected-subpage-title">{{selectedSubpage.title}}</div>
              <div class="selected-subpage-body" v-html="selectedSubpage.body"></div>
            </div>
            <div class="col-12 col-sm-8 selected-subpage-img">
              <img :src="selectedSubpage.banner_url" />
            </div>
          </div>
        </transition>
        <hr />
      </div>
      <div class="row">
        <div
          class="col-6 col-md-4 col-lg-3"
          style="padding:15px"
          v-for="subpage in subpages"
          :key="subpage.id"
        >
          <div
            class="btn subpage-btn"
            :class="{'selected-subpage-btn': selectedSubpageBtn(subpage)}"
            @click="subpageSelected(subpage)"
          >
            <div class="subpage-title">{{subpage.title}}</div>
            <div>
              <img class="subpage-image" :aria-label="subpage.id" :src="subpage.image_url" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import tz from "moment-timezone";
export default {
  head() {
    return this.currentSEO;
  },
  transition: "page",
  components: {
    // SocialSharing: () => import("vue-social-sharing"),
    // insidePageHeader: () => import("~/components/insidePageHeader.vue")
    categoryMenuComponent: () =>
      import("~/components/categoryMenuComponent.vue")
  },
  data: function() {
    return {
      tempSEO: null,
      currentSEO: [],
      storeNews: [],
      pages: null,
      subpages: null,
      selectedSubpage: null,
      showSubpageDetails: false
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "pages" }),
        store.dispatch("LOAD_SEO", {
          name: "/pages"
        })
      ]);
      return { tempSEO: results[1].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  beforeRouteUpdate(to, from, next) {},
  created() {},

  computed: {
    ...mapGetters([
      "property",
      "timezone",
      "findRepoByName",
      "locale",
      "processedPages"
    ])
  },
  methods: {
    loadData: function() {
      this.pages = this.processedPages[0];
      this.subpages = this.pages.subpages;
    },
    subpageSelected(subpage) {
      if (this.selectedSubpage && this.selectedSubpage.id == subpage.id) {
        this.showSubpageDetails = false;
        this.selectedSubpage = null;
      } else {
        this.selectedSubpage = subpage;
        this.showSubpageDetails = true;
      }
    },
    selectedSubpageBtn: function(subpage) {
      if (this.selectedSubpage && this.selectedSubpage.id == subpage.id) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>
<style scoped>
.other-services {
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 400;
}
.service-item {
  display: flex;
  justify-content: center;
  line-height: 3.25rem;
  align-items: center;
  border: 0.5px solid #3c3c3c;
}
.subpage-image {
  width: 2rem;
  height: 2rem;
}
.subpage-btn {
  display: flex;
  border: solid 0.5px black;
  border-radius: 0px;
  height: 100%;
  width: 100%;
  padding: 15px;
  justify-content: center;
  align-items: center;
}

.subpage-btn img {
  display: flex;
  background-color: #eeeef0;
  flex: 10%;
}
.subpage-title {
  display: flex;
  flex: 90%;
}
.selected-subpage-btn {
  color: white;
  background-color: #e5b03b;
}
.selected-subpage-btn img {
  background-color: #e5b03b;
}
.selected-subpage {
  display: flex;
  flex-direction: column;
  height: 20rem;
}
.selected-subpage-title {
  font-size: 1.75rem;
  font-weight: 500;
}
.selected-subpage-body {
  margin-top: 2rem;
  overflow-y: scroll;
  flex: 80%;
}
.selected-subpage-img {
  height: 20rem;
}
.selected-subpage-img img {
  border: solid 0.5px #707070;
}
.img-box .img {
  background-color: white;
  background-size: cover;
}
@media (max-width: 575.98px) {
.other-services, .selected-subpage {
  text-align: center;
}
}
</style>