<template>
  <div class="promo_dets_container" v-if="currentPromo">
    <category-menu-component categoryType="promotionDetails"></category-menu-component>
    <div class="site_container container">
      <div class="row">
        <div class="col-12 top-section p-0">
          <div class="col-6 top-section-detail">
            <div class="detail">
              <div class="detail-internal">
                <div class="detail-date">
                  {{currentPromo.start_date | moment("MMM D", timezone)}} - {{currentPromo.end_date | moment("MMM D", timezone)}}
                </div>
                <div class="detail-name">
                  {{currentPromo.name}}
                </div>
                <div class="detail-description">
                  <span v-html="currentPromo.description"></span>
                </div>
                <div class="detail-buttons">
                  <div class="visit-button btn">
                    <nuxt-link to="">Visit {{currentPromo.store.name}}</nuxt-link>
                  </div>
                  <div class="share-button">
                    Share Promotion
                    <i class="fa fa-share"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6 p-0 img-box">
            <div class="img" v-lazy:background-image="currentPromo.image_url">

              <!-- <img :src="currentPromo.image_url"/> -->
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="storePromos.length > 0">
        <div class="other-promotions-lbl col-12">
          Other Promotions at {{currentPromo.store.name}}
        </div>
      </div>
      <div class="row" v-if="storePromos.length > 0">
        <div
          class="col-md-6 col-sm-12 promotion-section"
          v-for="promotion in storePromos"
          :key="promotion.id"
        >
          <div class="promotion-container">
            <div class="container-details col-7">
              <div v-if="promotion.store.name" class="promo-store-name">{{promotion.store.name}}</div>
              <div v-else class="promo-store-name">Southland Mall</div>
              <div class="promo-name">{{promotion.name}}</div>
              <div
                class="promo-date"
              >{{promotion.start_date | moment("MMM D", timezone)}} - {{promotion.end_date | moment("MMM D", timezone)}}</div>
              <div class="promo-button btn">
                <nuxt-link :to="'/promotions/'+promotion.slug">Promotion Details</nuxt-link>
              </div>
            </div>
            <div class="container-img col-5">
              <div v-if="promotion.image_url" v-lazy:background-image="promotion.image_url"></div>
              <div v-else v-lazy:background-image="promotion.store.store_front_url_abs"></div>
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
    /* SocialSharing: () => import("vue-social-sharing"),
    insidePageHeader: () => import("~/components/insidePageHeader.vue") */
    categoryMenuComponent: () =>
      import("~/components/categoryMenuComponent.vue")
  },
  data: function() {
    return {
      currentPromo: null,
      tempSEO: null,
      currentSEO: [],
      storePromos: []
    };
  },
  async asyncData({ store, route }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "promotions" }),
        store.dispatch("LOAD_SEO", {
          url: route.fullPath
        })
      ]);
      return { tempSEO: results[1].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.updateCurrentPromo(this.$route.params.slug);
    next();
  },
  created() {
    this.updateCurrentPromo(this.$route.params.slug);
    this.promos = this.promotions;
  },
  computed: {
    ...mapGetters([
      "property",
      "processedPromos",
      "findPromoBySlug",
      "findPromoById",
      "timezone",
      "findRepoByName",
      "locale"
    ]),
    allPromos() {
      return this.processedPromos;
    },
    pageBanner() {
      var pageBanner = null;
      var temp_repo = this.findRepoByName("Promotions Banner");
      if (temp_repo && temp_repo.images) {
        pageBanner = temp_repo.images[0];
      } else {
        pageBanner = {};
        pageBanner.image_url = "";
      }
      return pageBanner;
    }
  },
  methods: {
    updateCurrentPromo(id) {
      this.$nextTick(function() {
        this.currentPromo = this.findPromoBySlug(id);
        if (this.currentPromo === null || this.currentPromo === undefined) {
          this.$router.replace("/");
        } else {
          if (this.tempSEO) {
            this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
          }
          if(!this.currentPromo.image_url) {
            this.currentPromo.image_url = this.currentPromo.store.store_front_url_abs;
          }
          this.loadStorePromos();
        }
      });
    },
    loadStorePromos: function() {
      this.storePromos = this.processedPromos.filter(promo => {
        if(promo.store) {
          return (promo.store.id == this.currentPromo.store.id) && (promo.id != this.currentPromo.id);
        } else {
          return false;
        }
        
      });


    }
  }
};
</script>