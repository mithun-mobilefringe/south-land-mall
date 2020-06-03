<template>
  <div class="promo_dets_container" v-if="currentEvent">
    <category-menu-component categoryType="eventDetails"></category-menu-component>
    <div class="site_container container">
      <div class="row">
        <div class="col-12 top-section">
          <div class="col-6 top-section-detail">
            <div class="detail">
              <div class="detail-internal">
                <div class="detail-date">
                  {{currentEvent.start_date | moment("MMM D", timezone)}} - {{currentEvent.end_date | moment("MMM D", timezone)}}
                </div>
                <div class="detail-name">
                  {{currentEvent.name}}
                </div>
                <div class="detail-description">
                  <span v-html="currentEvent.description"></span>
                </div>
                <div class="detail-buttons">
                  <div class="visit-button btn">
                    <nuxt-link :to="'/stores' + currentEvent.store.slug">Visit {{currentEvent.name}}</nuxt-link>
                  </div>
                  <div class="share-button">
                    Share Event
                    <i class="fa fa-share"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6 p-0 img-box">
            <div class="img" v-lazy:background-image="currentEvent.image_url">

              <!-- <img :src="currentEvent.image_url"/> -->
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="storeEvents.length > 0">
        <div class="other-promotions-lbl col-12">
          Other Events at {{currentEvent.store.name}}
        </div>
      </div>
      <div class="row" v-if="storeEvents.length > 0">
        <div
          class="col-md-6 col-sm-12 promotion-section"
          v-for="promotion in storeEvents"
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
  data: function() {
    return {
      currentEvent: null,
      tempSEO: null,
      currentSEO: [],
      storeEvents: []
    };
  },
  async asyncData({ store, route }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "events" }),
        store.dispatch("LOAD_SEO", {
          url: route.fullPath
        })
      ]);
      return { tempSEO: results[1].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  components: {
    // SocialSharing: () => import("vue-social-sharing"),
    // insidePageHeader: () => import("~/components/insidePageHeader.vue")
    categoryMenuComponent: () =>
      import("~/components/categoryMenuComponent.vue")
  },
  beforeRouteUpdate(to, from, next) {
    this.updatecurrentEvent(this.$route.params.slug);
    this.events = this.event;
    next();
  },
  created() {
    this.updatecurrentEvent(this.$route.params.slug);
    this.events = this.event;
  },
  computed: {
    ...mapGetters([
      "property",
      "processedEvents",
      "findEventBySlug",
      "findEventById",
      "timezone",
      "findRepoByName",
      "findHourById",
      "locale"
    ]),
    allEvents() {
      return this.processedEvents;
    },
    pageBanner() {
      var pageBanner = null;
      var temp_repo = this.findRepoByName("Events Banner");
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
    updatecurrentEvent(id) {
      this.$nextTick(function() {
        this.currentEvent = this.findEventBySlug(id);
        if (this.currentEvent === null || this.currentEvent === undefined) {
          this.$router.replace("/events");
        } else {
          if (this.currentEvent != null) {
            if (
              this.currentEvent.store != null &&
              this.currentEvent.store != undefined &&
              _.includes(this.currentEvent.store.store_front_url_abs, "missing")
            ) {
              this.currentEvent.store.store_front_url_abs = this.property.default_logo;
            } else if (
              this.currentEvent.store == null ||
              this.currentEvent.store == undefined
            ) {
              this.currentEvent.store = {};
              this.currentEvent.store.store_front_url_abs = this.property.default_logo;
            }

            if (this.tempSEO) {
              this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
            }
            this.loadStoreEvents();
          }
        }
      });
    },
    loadStoreEvents: function() {
      this.storeEvents = this.processedEvents.filter(event => {
        if(event.store) {
          return (event.store.id == this.currentEvent.store.id) && (event.id != this.currentEvent.id);
        } else {
          return false;
        }
        
      });
    }
  }
};
</script>