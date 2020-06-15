<template>
  <div class="promo_dets_container">
    <div class="site_container container">
      <div class="row">
        <div class="col-12 top-section">
          <div class="col-6 top-section-detail">
            <div class="detail">
              <div class="detail-internal">
                <div
                  class="detail-date"
                ></div>
                <div class="detail-name">Visit our Guest Info Desk for help</div>
                <div class="detail-description">
                  <span>QUESTIONS, ASSISTANCE, GIFTCARDS, SECURITY, ACCESSIBILITY SERVICES AT GUEST INFO DESK</span>
                </div>

                <div class="detail-buttons">
                  <div class="visit-button btn col-6">
                    <nuxt-link
                      to="/"
                    >GET DIRECTIONS</nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6 p-0 img-box">
            <div class="img" v-lazy:background-image="property.image_url">
              <!-- <img :src="property.image_url"/> -->
            </div>
          </div>
        </div>
      </div>
        <div class="row">
        <div class="col-12 other-services">{{property.name}} SERVICES</div>
      </div>
      <hr>
        <div class="row">
            <div class="col-3">
                <div class="service-item">
                Accessible Restrooms  <i class="fa fa-accessible-icon"></i>
                </div>
            </div>
            <div class="col-3">
                <div class="service-item">
                ELEVATORS <i class="fa fa-elevator"></i>
                </div>
            </div>
            <div class="col-3">
                <div class="service-item">
                GUEST INFO DESK <i class="fa fa-info-square"></i>
                </div>
            </div>
            <div class="col-3">
                <div class="service-item">
                PARKING <i class="fas fa-parking"></i>
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
      currentNews: null,
      tempSEO: null,
      currentSEO: [],
      storeNews: []
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "news" }),
        store.dispatch("LOAD_SEO", {
          name: "/news"
        })
      ]);
      return { tempSEO: results[1].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  beforeRouteUpdate(to, from, next) {},
  created() {
      this.property.image_url="https://codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1546551307522/eventplaceholder2@2x.png";
  },

  computed: {
    ...mapGetters(["property", "timezone", "findRepoByName", "locale"])
  },
  methods: {}
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
    border: 0.5px solid #3C3C3C;
}
</style>