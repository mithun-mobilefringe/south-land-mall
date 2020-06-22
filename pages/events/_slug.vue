<template>
  <div class="promo_dets_container" v-if="currentEvent">
    <category-menu-component categoryType="eventDetails"></category-menu-component>
    <div class="site_container container">
      <div class="row">
        <div class="col-12 d-sm-none p-0">
            <div class="top-image" v-lazy:background-image="currentEvent.image_url">
            </div>
          </div>
        <div class="col-12 top-section">
          <div class="col-12 col-sm-6 top-section-detail">
            <div class="detail">
              <div class="detail-internal">
                <div
                  class="detail-date"
                >{{currentEvent.start_date | moment("MMM D", timezone)}} - {{currentEvent.end_date | moment("MMM D", timezone)}}</div>
                <div class="detail-name">{{currentEvent.name}}</div>
                <div class="detail-description">
                  <span v-html="currentEvent.description"></span>
                </div>
                <div class="detail-buttons col-12 p-0">
                  <div class="visit-button btn col-12 col-sm-6">
                    <nuxt-link
                      :to="'/stores/' + currentEvent.store.slug"
                    >Visit {{currentEvent.name}}</nuxt-link>
                  </div>
                  <div class="share-button col-12 col-sm-6">
                    Share Event
                    <i class="fa fa-share"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 p-0 img-box d-none d-sm-block">
            <div class="img" v-lazy:background-image="currentEvent.image_url">
              <!-- <img :src="currentEvent.image_url"/> -->
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="storeEvents.length > 0">
        <div class="other-promotions-lbl col-12">Other Events for {{currentEvent.tags.join(' | ')}}</div>
      </div>
      <hr v-if="storeEvents.length > 0"/>
      <div class="row" v-if="storeEvents.length>0">
        <div class="col-md-6 col-sm-12 event-section" v-for="event in storeEvents" :key="event.id">
          <div class="event-container">
            <div class="container-details col-7">
              <div v-if="event.tags.length > 0" class="promo-store-name">
                <div v-for="tag in event.tags" :key="tag.index">
                  <div>{{tag}}</div>
                </div>
              </div>
              <div v-else class="promo-store-name">Southland Mall</div>
              <div class="promo-name">{{event.name}}</div>
              <div class="promo-date">
                <span
                  v-if="isMultiDay(event)"
                >{{ event.start_date | moment("MMM D", timezone)}} - {{ event.end_date | moment("MMM D", timezone)}}</span>
                <span v-else>{{ event.start_date | moment("MMM D", timezone)}}</span>
              </div>
              <div class="promo-button btn p-0">
                <nuxt-link :to="'/events/'+event.slug">Event Details</nuxt-link>
              </div>
            </div>
            <div class="container-img col-5">
              <div v-if="event.image_url" v-lazy:background-image="event.image_url"></div>
              <div v-else v-lazy:background-image="event.event_image2_url_abs"></div>
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
      debugger;
      this.$nextTick(function() {
        this.currentEvent = this.findEventBySlug(id);
        if (this.currentEvent === null || this.currentEvent === undefined) {
          this.$router.replace("/events");
        } else {
          debugger;
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
              this.currentEvent.image_url =
                "//codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1546551307522/eventplaceholder2@2x.png";
            }
            debugger;

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
        let isTagPresent = false;
        if (event.tags && this.currentEvent.tags) {
          for (let tag of this.currentEvent.tags) {
            if (_.indexOf(event.tags, tag) > -1 && event.id != this.currentEvent.id) {
              isTagPresent = true;
              break;
            } else {
              isTagPresent = false;
            }
          }
        } else {
          isTagPresent = false;
        }
        return isTagPresent;
      });
    }
  }
};
</script>