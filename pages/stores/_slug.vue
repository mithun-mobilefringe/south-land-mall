<template>
  <div class="store_dets_container" v-if="currentStore">
    <category-menu-component categoryType="storeDetails"></category-menu-component>
    <div class="container">
      <div class="row">
        <div class="col-12 top-section">
          <div class="col-4 top-section-detail">
            <div class="detail">
              <div class="detail-internal">
                <div class="detail-name">{{currentStore.name}}</div>
                <div class="detail-logo">
                  <img :src="currentStore.logo_url" />
                </div>
                <div class="store-category">
                  <p v-if="currentStore.categories">{{storeCategory(currentStore.categories) }}</p>
                </div>
                <div v-if="currentStore.phone" class="store_phone">
                  <p>
                    <i class="fa fa-phone"></i>
                    <span>{{ currentStore.phone }}</span>
                  </p>
                </div>
                <div v-if="currentStore.website" class="store_website">
                  <a :href="currentStore.website" target="_blank">{{currentStore.website}}</a>
                </div>
              </div>
            </div>
          </div>
          <div class="col-8 p-0 img-box">
            <div class="img" v-lazy:background-image="currentStore.image_url">
              <!-- <img :src="currentStore.image_url"/> -->
            </div>
          </div>
        </div>
      </div>
      <!-- Promotions -->
      <div class="row" v-if="storePromos.length > 0">
        <div class="other-promotions-lbl col-12">Promotions at {{currentStore.name}}</div>
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
      <!-- events -->
      <div class="row" v-if="store_events.length > 0">
        <div class="other-promotions-lbl col-12">Events at {{currentStore.name}}</div>
      </div>
      <div class="row" v-if="store_events.length > 0">
        <div
          class="col-md-6 col-sm-12 promotion-section"
          v-for="promotion in store_events"
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
                <nuxt-link :to="'/events/'+promotion.slug">Event Details</nuxt-link>
              </div>
            </div>
            <div class="container-img col-5">
              <div v-if="promotion.image_url" v-lazy:background-image="promotion.image_url"></div>
              <div v-else v-lazy:background-image="promotion.store.store_front_url_abs"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- Jobs -->
      <div class="row" v-if="store_jobs.length > 0">
        <div class="other-promotions-lbl col-12">Jobs at {{currentStore.name}}</div>
      </div>
      <div class="row" v-if="store_jobs.length > 0">
        <div
          class="col-md-6 col-sm-12 promotion-section"
          v-for="promotion in store_jobs"
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
                <nuxt-link :to="'/jobs/'+promotion.slug">Job Details</nuxt-link>
              </div>
            </div>
            <div class="container-img col-5">
              <div v-if="promotion.image_url" v-lazy:background-image="promotion.image_url"></div>
              <div v-else v-lazy:background-image="promotion.store.store_front_url_abs"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- News -->
      <div class="row" v-if="store_news.length > 0">
        <div class="other-promotions-lbl col-12">News at {{currentStore.name}}</div>
      </div>
      <div class="row" v-if="store_news.length > 0">
        <div
          class="col-md-6 col-sm-12 promotion-section"
          v-for="promotion in store_news"
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
                <nuxt-link :to="'/promotions/'+promotion.slug">News Details</nuxt-link>
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
  transition: "page",
  head() {
    return this.currentSEO;
  },
  components: {
    /* SearchComponent: () => import("~/components/SearchComponent.vue"),
    MapplicMap: () => import("~/components/Mapplic.vue"),
    insidePageHeader: () => import("~/components/insidePageHeader.vue") */
    categoryMenuComponent: () =>
      import("~/components/categoryMenuComponent.vue")
  },
  async asyncData({ store, route }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "stores" }),
        store.dispatch("getMMData", { resource: "jobs" }),
        store.dispatch("getMMData", { resource: "promotions" }),
        store.dispatch("LOAD_SEO", {
          url: route.fullPath
        }),
        store.dispatch("getMMData", { resource: "events" }),
        store.dispatch("getMMData", { resource: "news" })
      ]);
      return { tempSEO: results[4].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  data: function() {
    return {
      currentStore: null,
      promotions: [],
      jobs: [],
      dataLoaded: false,
      storeHours: [],
      currentSEO: {},
      tempSEO: null,
      all_store_items: null,
      storePromos: [],
      store_events: [],
      store_jobs: [],
      store_news: []
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.updateCurrentStore(this.$route.params.slug);
    next();
  },
  created() {
    this.updateCurrentStore(this.$route.params.slug);
  },
  computed: {
    ...mapGetters([
      "property",
      "timezone",
      "processedStores",
      "findStoreBySlug",
      "findStoreItemsByStoreId",
      "locale",
      "findCategoryById",
      "findPromosByStoreId",
      "findEventsByStoreId",
      "findJobsByStoreId",
      "findNewsByStoreId"
    ]),
    allStores() {
      var store_list = [];
      var vm = this;
      _.forEach(this.processedStores, function(value, key) {
        if (_.includes(value.store_front_url_abs, "missing")) {
          value.no_store_logo = true;
        } else {
          value.no_store_logo = false;
        }
        if (!value.svgmap_region) {
          value.svgmap_region = value.id;
        }
        value.zoom = 0.4;
        store_list.push(value);
      });
      return store_list;
    },
    getSVGurl() {
      return "https://www.mallmaverick.com" + this.property.svgmap_url;
    },
    floor_1() {
      var floor_one = this.findRepoPostByIdWithId(1652, 52982);
      if (floor_one) {
        return floor_one.image_url;
      } else {
        return "";
      }
    },
    floor_2() {
      var floor_two = this.findRepoPostByIdWithId(1652, 52983);
      if (floor_two) {
        return floor_two.image_url;
      } else {
        return "";
      }
    },
    floorList() {
      var floor_list = [];

      if (this.currentStore.z_coordinate == 1) {
        var floor_1 = {};
        floor_1.id = "first-floor";
        floor_1.title = "Floor 1";
        floor_1.map = this.floor_1;
        floor_1.z_index = 1;
        floor_1.show = true;
        floor_list.push(floor_1);
      } else if (this.currentStore.z_coordinate == 2) {
        var floor_2 = {};
        floor_2.id = "second-floor";
        floor_2.title = "Floor 2";
        floor_2.map = this.floor_2;
        floor_2.z_index = 2;
        floor_2.show = false;
        floor_list.push(floor_2);
      } else if (this.currentStore.z_coordinate == null) {
        var floor_1 = {};
        floor_1.id = "first-floor";
        floor_1.title = "Floor 1";
        floor_1.map = this.floor_1;
        floor_1.z_index = null;
        floor_1.show = true;
        floor_list.push(floor_1);
      }
      return floor_list;
    },
    pageBanner() {
      var pageBanner = null;
      var temp_repo = this.findRepoByName("Stores Banner");
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
    updateCurrentStore(id) {
      this.$nextTick(function() {
        this.currentStore = this.findStoreBySlug(id);
        if (this.currentStore === null || this.currentStore === undefined) {
          this.$router.replace("/");
        } else {
          var vm = this;
          if (_.includes(this.currentStore.store_front_url_abs, "missing")) {
            this.currentStore.no_store_logo = true;
          } else {
            this.currentStore.no_store_logo = false;
          }

          // Get Promos, Events, Jobs and News by store ID
          this.all_store_items = this.findStoreItemsByStoreId(
            this.currentStore.id
          );
          this.storePromos = this.findPromosByStoreId(this.currentStore.id);
          this.store_events = this.findEventsByStoreId(this.currentStore.id);
            this.store_jobs = this.findJobsByStoreId(this.currentStore.id);
            this.store_news = this.findNewsByStoreId(this.currentStore.id);
          var storeHours = [];
          var vm = this;
          _.forEach(this.currentStore.store_hours, function(value, key) {
            var hour = vm.findHourById(value);
            // if (hour.day_of_week === 0) {
            //   hour.order = 7;
            // } else {
            //   hour.order = hour.day_of_week;
            // }
            storeHours.push(hour);
          });
          this.storeHours = _.sortBy(storeHours, [
            function(o) {
              return o.order;
            }
          ]);
        }
        if (this.tempSEO) {
          this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
        }
      });
    },
    storeCategory(categories) {
      var categoryName = "";
      var cat = this.findCategoryById(categories[0]);
      categoryName = cat.name;
      if (categories.length > 1) {
        for (var i = 1; i < categories.length; i++) {
          var category = this.findCategoryById(categories[i]);
          categoryName = categoryName + " | " + category.name;
        }
      }
      return categoryName;
    },
    dropPin(store) {
      this.$refs.svgmap_ref.showLocation(store.svgmap_region);
    },
    updateSVGMap(map) {
      this.map = map;
      this.dropPin(this.currentStore);
    }
  }
};
</script>
