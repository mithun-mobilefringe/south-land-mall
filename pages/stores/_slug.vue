<template>
  <div class="store_dets_container" v-if="currentStore">
    <category-menu-component categoryType="storeDetails"></category-menu-component>
    <div class="container">
      <div class="row">
        <div class="col-12 top-section">
          <div class="col-4 top-section-detail">
            <div class="detail">
              <div class="detail-internal">
                <div class="detail-top">
                <div class="detail-name">{{currentStore.name}}</div>
                <div class="detail-logo">
                  <img :src="currentStore.logo_image_url" />
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
          </div>
          <div class="col-8 p-0 img-box map-box">
            <mapplic-map
            class
            ref="svgmap_ref"
            :height="380"
            :minimap="false"
            :deeplinking="false"
            :sidebar="false"
            :hovertip="true"
            :maxscale="5"
            :storelist="allStores"
            :mousewheel="false"
            :mapData="mapData"
            tooltiplabel="Store Info"
            @updateMap="updateSVGMap"
            v-if="windowWidth > 767"
          ></mapplic-map>
          <mapplic-map
            class
            ref="svgmap_ref"
            :height="350"
            :minimap="false"
            :deeplinking="false"
            :sidebar="false"
            :hovertip="true"
            :maxscale="5"
            :storelist="allStores"
            :mousewheel="false"
            :mapData="mapData"
            tooltiplabel="Store Info"
            @updateMap="updateSVGMap"
            v-else
          ></mapplic-map>
              <!-- <img :src="currentStore.image_url"/> -->
            </div>
          </div>
        </div>
      <!-- Promotions -->
      <div class="row" v-if="storePromos.length > 0">
        <div class="other-promotions-lbl col-12">Promotions at {{currentStore.name}}</div>
      </div>
      <hr v-if="storePromos.length > 0"/>
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
        <hr v-if="store_events.length > 0"/>
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
      <hr v-if="store_jobs.length > 0"/>
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
      <hr v-if="store_news.length > 0"/>
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
      import("~/components/categoryMenuComponent.vue"),
    MapplicMap: () => import('~/components/Mapplic.vue'),
  },
  async asyncData({ store,params, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('LOAD_PAGE_DATA', {
          url:
            process.env.MM_API_URL +
            'store_by_slug/' +
            route.params.slug +
            '?api_key=' +
            process.env.API_KEY
        }),

        store.dispatch('LOAD_PAGE_DATA', {
          url: process.env.MM_API_URL + 'mapplic?api_key=' + process.env.API_KEY
        }),
        store.dispatch('getMMData', { resource: 'stores' }),
        store.dispatch('getMMData', { resource: 'promotions' }),
        store.dispatch('getMMData', { resource: 'events' }),
        store.dispatch('getMMData', { resource: 'jobs' }),
        store.dispatch('LOAD_SEO', {
          url: route.fullPath
        })
      ])
      return {
        currentStore: results[0].data,
        mapData: results[1].data,
        tempSEO: results[6].data
      }
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
      store_news: [],
      mapData: null
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
      "processedPromos",
      "processedEvents",
      "processedJobs",
      "processedNews",
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
        value.zoom = 1;
        store_list.push(value);
      });
      return store_list;
    },
    svgMapRef() {
      return this.$refs.svgmap_ref
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
        // this.currentStore = this.findStoreBySlug(id)
        if (this.currentStore === null || this.currentStore === undefined) {
           this.$router.replace("/");
        } else {
          debugger;
          if (_.includes(this.currentStore.store_front_url_abs, "missing")) {
            this.currentStore.no_store_logo = true;
          } else {
            this.currentStore.no_store_logo = false;
          }
          if (this.currentStore.website) {
            if (_.includes(this.currentStore.website, 'https')) {
              this.currentStore.website = _.replace(
                this.currentStore.website,
                'https://',
                ''
              )
            } else if (_.includes(this.currentStore.website, 'http')) {
              this.currentStore.website = _.replace(
                this.currentStore.website,
                'http://',
                ''
              )
            }
          }

          var vm = this
          var temp_promo = []
          var temp_event = []
          var temp_job = []
          var temp_news = []
          temp_promo = _.filter(this.processedPromos, function(o) {
            return o.promotionable_id == vm.currentStore.id
          })
          temp_event = _.filter(this.processedEvents, function(o) {
            return o.eventable_id == vm.currentStore.id
          })
          temp_job = _.filter(this.processedJobs, function(o) {
            return o.jobable_id == vm.currentStore.id
          })
          temp_news = _.filter(this.processedNews, function(o) {
            return o.jobable_id == vm.currentStore.id
          })

          this.storePromos = temp_promo
          this.store_events = temp_event
          this.store_jobs = temp_job
          if (this.currentStore.is_free_form_hours) {
            this.freeFormHours = true
          }
          if (this.currentStore.hours) {
            var storeHours = []
            var _this = this
            //find holiday in the current week
            var next_holiday = []
            var start_week = moment()
              .tz(this.timezone)
              .startOf('isoWeek')
            start_week = moment(start_week).format('X')
            var end_week = moment()
              .tz(this.timezone)
              .endOf('isoWeek')
            end_week = moment(end_week).format('X')
            _.forEach(this.currentStore.hours.holiday_hours, function(
              value,
              key
            ) {
              var this_holiday = value
              var holiday_date = moment(this_holiday.holiday_date)
                .hour(0)
                .minute(0)
                .tz(_this.timezone)
                .format('X')
              // If its a multiday holiday, check to see if any holidays are in that week
              if (this_holiday.holiday_end_date) {
                // Convert end date
                var holiday_end_date = moment(this_holiday.holiday_end_date)
                  .tz(_this.timezone)
                  .format('X')
                _.forEach(
                  _.range(
                    0,
                    moment(this_holiday.holiday_end_date).diff(
                      moment(this_holiday.holiday_date),
                      'days'
                    ) + 1
                  ),

                  function(i) {
                    var current_holiday = {}
                    var current_date = moment(this_holiday.holiday_date).add(
                      i,
                      'days'
                    )

                    // current_holiday.day_of_week = moment(current_holiday.date).day()
                    current_holiday.date = current_date
                      .hour(0)
                      .minute(0)
                      .format()
                    current_holiday.close_time = this_holiday.close_time
                    current_holiday.day_of_week = moment(
                      current_holiday.date
                    ).day()
                    current_holiday.holiday_date = current_date
                    current_holiday.holiday_name = this_holiday.holiday_name
                    current_holiday.open_time = this_holiday.open_time
                    current_holiday.is_closed = this_holiday.is_closed
                    current_holiday.is_holiday = this_holiday.is_holiday
                    current_holiday.open_full_day = this_holiday.open_full_day

                    var temp_date = moment(current_holiday.date).format('X')

                    if (temp_date >= start_week && temp_date <= end_week) {
                      next_holiday.push(current_holiday)
                    }
                  }
                )
              } else if (
                holiday_date >= start_week &&
                holiday_date <= end_week
              ) {
                // Set the day_of_week for each Holiday Date
                this_holiday.day_of_week = moment(
                  this_holiday.holiday_date
                ).day()
                next_holiday.push(this_holiday)
              }
            })
            //go through regular hours and replace it with holiday hours
            _.forEach(this.currentStore.hours.regular_hours, function(
              value,
              key
            ) {
              var holiday = _.find(next_holiday, function(o) {
                return o.day_of_week === value.day_of_week
              })
              if (holiday) {
                value = holiday
              }
              if (value.day_of_week === 0) {
                value.order = 7
              } else {
                value.order = value.day_of_week
              }
              storeHours.push(value)
            })
            this.storeHours = _.orderBy(storeHours, ['order'])
            this.todaysHour = this.currentStore.hours.todays_hours
          }
          //update seo
          if (!_.isEmpty(this.tempSEO)) {
            this.currentSEO = this.localeSEO(this.tempSEO)
          }
        }
      })
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
      if (this.svgMapRef) {
        var map_id = null
        // Find store data from mapplic
        _.forEach(this.mapData.levels, function(o) {
          map_id = _.find(o.locations, function(location) {
            return location.store_id == store.id
          })
          if (map_id) return false
        })
        if (map_id) this.svgMapRef.showLocation(map_id.id)
      }
    },
    updateSVGMap(map) {
      debugger;
      this.map = map
      setTimeout(
        () => {
          this.dropPin(this.currentStore)
        },
        1000,
        this
      )
    },
    pastMallHours(hour) {
      var time_now = moment().format('kkmm')
      var property_hour = _.find(this.getPropertyHours, function(o) {
        return o.day_of_week == hour.day_of_week
      })
      var mall_open_time = moment(property_hour.open_time).tz(this.timezone)
      var mall_close_time = moment(property_hour.close_time).tz(this.timezone)

      var open_time = moment(hour.open_time).tz(this.timezone)
      var close_time = moment(hour.close_time).tz(this.timezone)

      var is_pass_mall_hours = false
      if (mall_open_time.format('kkmm') > open_time.format('kkmm')) {
        is_pass_mall_hours = true
      } else if (mall_close_time.format('kkmm') < close_time.format('kkmm')) {
        is_pass_mall_hours = true
      }
      return is_pass_mall_hours
    }
  }
};
</script>
