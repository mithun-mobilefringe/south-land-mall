<template>
  <div
    v-if="currentStore"
    v-blueshift-visited-store="!currentStore.external_id ? 'MM_' + currentStore.id : currentStore.external_id"
  >
    <header
      class="half-banner d-flex flex-column justify-content-center align-items-center"
      :style="{ backgroundImage: 'url(' + currentStore.store_front_image_url  + ')' }"
    >
      <div class="header-content">
        <div class="inner">
          <!-- <h1 class="display-4">Shopping</h1> -->
        </div>
      </div>
    </header>
    <main>
      <section class="store-details" v-if="currentStore">
        <button
          class="btn-link btn-favorite-cir bg-primary box-shadow"
          type="button"
          @click="$refs.favoriteRegisterModal.toggleFavorite($event,currentStore)"
          aria-label="Add to your favorite stores"
          :class="{'active' : isFavourited('store', currentStore)}"
        ></button>
        <div class="container-fluid">
          <div class="row section-row">
            <div class="col-lg-6 col-xl-8">
              <div class="d-none d-lg-block">
                <div class="h6 open-until" v-if="todaysHour && property.meta_data_object.show_store_hours">{{getTodayHoursText}}</div>
                <h1>{{currentStore.name}}</h1>
                <hr class="primary left" />
                <div class="details-box">
                  <read-more :collapsedHeight="75">
                    <div v-html="currentStore.description"></div>
                  </read-more>
                </div>
              </div>
              <h4 v-if="currentStore.products">Products</h4>
              <p v-if="currentStore.products" v-html="currentStore.products"></p>
              <h4 v-if="currentStore.brand_description">Featured Brand Names</h4>
              <p v-if="currentStore.brand_description" v-html="currentStore.brand_description"></p>
              <h4 v-if="currentStore.service">Special Services</h4>
              <p v-if="currentStore.service" v-html="currentStore.service"></p>
              <h4 v-if="currentStore.amenities">Other Amenities</h4>
              <p v-if="currentStore.amenities" v-html="currentStore.amenities"></p>
              <h4 v-if="currentStore.return_policy">Return Policy</h4>
              <p v-if="currentStore.return_policy" v-html="currentStore.return_policy"></p>
              <section>
                <div v-if="promotions && promotions.length>0">
                  <h4>Sales & Offers</h4>
                  <ul class="list-group box-listings offer-listings">
                    <li class="list-group-item list-group-item-action" v-for="promo in promotions">
                      <div class="row no-gutters listing-box-row">
                        <div class="col-4 col-md-3 listing-image">
                          <a :href="'/sales-offers/'+promo.slug" v-if="promo.image_url">
                            <img class="img-fluid" :src="promo.image_url" alt />
                          </a>
                        </div>
                        <div class="col-6 col-md-6 listing-details">
                          <h6>{{currentStore.name}}</h6>
                          <p class="desc">
                            <nuxt-link :to="'/sales-offers/'+promo.slug">{{promo.name}}</nuxt-link>
                          </p>
                          <p class="text-muted">
                            <span
                              v-if="isMultiDay(promo, timezone)"
                            >{{ promo.start_date | moment("MMM Do", timezone)}} - {{ promo.end_date | moment("MMM Do", timezone)}}</span>
                            <span v-else>{{ promo.start_date | moment("MMM Do", timezone)}}</span>
                          </p>
                        </div>
                        <div class="col-2 col-md-3 text-right listing-cta">
                          <a :href="'/sales-offers/'+promo.slug">
                            <span
                              class="listing-cta brand-primary btn-right-arrow"
                              aria-hidden="true"
                            >
                              <span class="d-none d-md-inline">Details</span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-if="events && events.length>0">
                  <h4>Events</h4>
                  <ul class="list-group box-listings event-listings">
                    <li class="list-group-item list-group-item-action" v-for="promo in events">
                      <div class="row no-gutters listing-box-row">
                        <div class="col-4 col-md-3 listing-image">
                          <a :href="'/events/'+promo.slug">
                            <img class="img-fluid" :src="checkImageURL(promo)" alt />
                          </a>
                        </div>
                        <div class="col-6 col-md-6 listing-details">
                          <h6>{{currentStore.name}}</h6>
                          <p class="desc">
                            <a :href="'/events/'+promo.slug">{{promo.name}}</a>
                          </p>
                          <p class="text-muted">
                            <span
                              v-if="isMultiDay(promo, timezone)"
                            >{{ promo.start_date | moment("MMM Do", timezone)}} - {{ promo.end_date | moment("MMM Do", timezone)}}</span>
                            <span v-else>{{ promo.start_date | moment("MMM Do", timezone)}}</span>
                          </p>
                        </div>
                        <div class="col-2 col-md-3 text-right listing-cta">
                          <a :href="'/events/'+promo.slug">
                            <span
                              class="listing-cta brand-primary btn-right-arrow"
                              aria-hidden="true"
                            >
                              <span class="d-none d-md-inline">Details</span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <!-- <div v-if="jobs && jobs.length>0">
                  <h4>Jobs</h4>
                  <ul class="list-group box-listings event-listings">
                    <li
                      class="list-group-item list-group-item-action"
                      v-for="promo in jobs"
                      :key="promo.id"
                    >
                      <div class="row no-gutters listing-box-row">
                        <div class="col-4 col-md-3 listing-image">
                          <a :href="'/jobs/'+promo.slug">
                            <img class="img-fluid" :src="checkImageURL(promo)" alt />
                          </a>
                        </div>
                        <div class="col-6 col-md-6 listing-details">
                          <h6>{{currentStore.name}}</h6>
                          <p class="desc">
                            <a :href="'/jobs/'+promo.slug">{{promo.name}}</a>
                          </p>
                          <p class="text-muted">
                            <span
                              v-if="isMultiDay(promo, timezone)"
                            >{{ promo.start_date | moment("MMM Do", timezone)}} - {{ promo.end_date | moment("MMM Do", timezone)}}</span>
                            <span v-else>{{ promo.start_date | moment("MMM Do", timezone)}}</span>
                          </p>
                        </div>
                        <div class="col-2 col-md-3 text-right listing-cta">
                          <a :href="'/jobs/'+promo.slug">
                            <span
                              class="listing-cta brand-primary btn-right-arrow"
                              aria-hidden="true"
                            >
                              <span class="d-none d-md-inline">Details</span>
                            </span>
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>-->
                <div v-if="recommededStores && recommededStores.length > 0">
                  <h4>More Stores You Might Like</h4>
                  <ul class="row store-listings recomended_stores">
                    <li class="col-6 col-sm-4" v-for="item in recommededStores" :key="item.id">
                      <div class="listing-image text-center">
                        <a :href="'/stores/'+item.slug">
                          <img class="img-fluid" :src="item.logo_image_url" alt />
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
            <div class="col-lg-6 col-xl-4">
              <div class="d-lg-none">
                <div class="h6 open-until" v-if="todaysHour && property.meta_data_object.show_store_hours">{{getTodayHoursText}}</div>
                <h1>{{currentStore.name}}</h1>
                <hr class="primary left" />
                <div class="details-box">
                  <!-- <p class="details" v-html="currentStore.rich_description"></p> -->
                  <read-more :collapsedHeight="75">
                    <div v-html="currentStore.description"></div>
                  </read-more>
                </div>
              </div>
              <img
                class="img-fluid logo d-none d-lg-block"
                :src="currentStore.logo_image_url"
                :alt="currentStore.name"
                v-if="!helpers.isMissingImage(currentStore.logo_image_url)"
              />
              <div class="overview">
                <div class="row" :class="{'hours-active': showHours}" v-if="todaysHour && property.meta_data_object.show_store_hours">
                  <div aria-hidden="true" class="col-2 icon ion-android-time"></div>
                  <div class="col-3 label small">Today's Hours</div>
                  <div class="col-7">
                    <span v-if="currentStore.is_coming_soon_store">Coming Soon</span>
                    <span v-else-if="todaysHour.is_closed">Closed</span>
                    <span
                      v-else
                    >{{todaysHour.open_time.utc | moment("h:mmA", timezone)}} - {{todaysHour.close_time.utc | moment("h:mmA", timezone)}}</span>
                    <a
                      class="btn-link btn-view-hours small"
                      href="#"
                      @click.prevent="showHoursToggle = !showHoursToggle"
                      :class="{'btn-right-arrow': !showHoursToggle, 'btn-down-arrow': showHoursToggle}"
                      v-if="!currentStore.is_coming_soon_store"
                    >
                      <span v-show="!showHoursToggle">View Week</span>
                      <span v-show="showHoursToggle">View Less</span>
                    </a>
                  </div>
                  <div class="col-12">
                    <div class="week-hours">
                      <transition v-on:enter="enter" v-on:leave="leave">
                        <div class="week-hours" v-if="showHoursToggle">
                          <div class="week-hours-table">
                            <div
                              v-for="day in storeHours"
                              :class="['day-hours',{'active': day.day_of_week == todaysHour.day_of_week}]"
                              :key="day.id"
                            >
                              <div class="day">{{day.day_of_week | moment("dddd", timezone)}}</div>
                              <div>
                                <span class="hours" v-if="day.is_closed">Closed</span>
                                <span class="hours" v-else>
                                  {{day.open_time | moment("h:mmA", timezone)}} - {{day.close_time | moment("h:mmA", timezone)}}
                                  <span
                                    v-if="pastMallHours(day)"
                                  >*</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <span class="text-muted">* Extends past standard hours</span>
                          <!--<span
                            class="text-muted"
                            v-if="!storeSlug"
                          >Restaurant and department store hours may vary.</span>-->
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
                <div class="row" v-if="currentStore.phone">
                  <div class="col-2 icon ion-android-call"></div>
                  <div class="col-3 label small">Phone</div>
                  <div class="col-7">{{currentStore.phone}}</div>
                </div>
                <div class="row" v-if="currentStore.location_information">
                  <div aria-hidden="true" class="col-2 icon ion-android-map"></div>
                  <div class="col-3 label small">Location</div>
                  <div class="col-7">
                    <a
                      class="btn-link btn-location"
                      href="#storeMallMap"
                      v-html="currentStore.location_information"
                    ></a>
                  </div>
                </div>
                <div class="row" v-if="currentStore.parking_information">
                  <div aria-hidden="true" class="col-2 icon ion-android-car"></div>
                  <div class="col-3 label small">Where to Park</div>
                  <div class="col-7" v-html="currentStore.parking_information"></div>
                </div>
                <div class="row" v-if="currentStore.website">
                  <div aria-hidden="true" class="col-2 icon ion-earth"></div>
                  <div class="col-3 label small">Website</div>
                  <div class="col-7">
                    <a
                      class="link-emphasis website"
                      :href="'//'+currentStore.website"
                      target="_blank"
                      rel="noopener"
                    >{{currentStore.website}}</a>
                  </div>
                </div>
                <div
                  class="row"
                  v-if="currentStore.social_links && currentStore.social_links.length"
                >
                  <div aria-hidden="true" class="col-2 icon ion-android-share-alt"></div>
                  <div class="col-3 label small">Connect</div>
                  <div class="col-7">
                    <ul class="list-inline social-media">
                      <li
                        class="list-inline-item"
                        v-for="social in currentStore.social_links"
                        :key="social.id"
                      >
                        <a
                          class="icon"
                          :href="social.url"
                          target="_blank"
                          rel="noopener"
                          :aria-label="social.callout"
                        >
                          <span
                            class="fa fa-facebook-official"
                            v-if="social.social_type == 'Facebook'"
                          ></span>
                          <span class="fa fa-instagram" v-if="social.social_type == 'Instagram'"></span>
                          <span class="ion-social-twitter" v-if="social.social_type == 'Twitter'"></span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="store-details mb-5" id="storeMallMap">
        <div class="container-fluid">
          <mapplic-map
            class
            ref="svgmap_ref"
            :height="800"
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
        </div>
      </section>
      <taub-favorite-register-modal ref="favoriteRegisterModal" type="store" item_type="store"></taub-favorite-register-modal>
    </main>

    <footer-ads></footer-ads>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'
import helpers from 'assets/javascripts/helpers'
export default {
  transition: 'page',
  head() {
    return this.currentSEO
  },
  data: function() {
    return {
      tempSEO: null,
      currentSEO: {},
      currentStore: null,
      helpers: helpers,
      showHours: false,
      showHoursToggle: false,
      todaysHour: null,
      storeHours: null,
      promotions: null,
      events: null,
      jobs: null,
      mapData: null
    }
  },
  components: {
    /* TaubFavoriteRegisterModal: () =>
      import('~/components/favouriteRegisterModal.vue'),
    MapplicMap: () => import('~/components/Mapplic.vue'),
    FooterAds: () => import('~/components/footerAds.vue'),
    ReadMore: () => import('~/components/readMore.vue') */
  },

  async asyncData({ store, route, error }) {
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
      console.log(e.message)
      if (e.response.status == 404) {
        error({ statusCode: 404, message: 'Store not found' })
        $nuxt.$router.push('/')
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.updateCurrentStore(this.$route.params.slug)
    next()
  },
  created() {
    this.updateCurrentStore(this.$route.params.slug)
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'processedStores',
      'processedPromos',
      'processedEvents',
      'processedJobs',
      'findStoreBySlug',
      'findBannerByName',
      'findHourById',
      'getPropertyHours'
    ]),
    allStores() {
      var store_list = []
      var vm = this
      _.forEach(this.processedStores, function(value, key) {
        if (value.logo_image_url) {
          value.no_store_logo = false
        } else {
          value.no_store_logo = true
        }
        if (!value.svgmap_region) {
          value.svgmap_region = value.id
        }
        value.zoom = 1
        store_list.push(value)
        // }
      })
      return store_list
    },
    recommededStores() {
      var vm = this
      var sortedList = _.filter(this.allStores, function(o) {
        return _.includes(vm.currentStore.store_recommendations, o.id)
      })
      return _.slice(sortedList, 0, 3)
    },
    svgMapRef() {
      return this.$refs.svgmap_ref
    },
    getTodayHoursText() {
      var hours_text = ''
      if (this.currentStore.is_coming_soon_store) {
        hours_text = 'Coming Soon'
      } else if (this.todaysHour.is_closed) {
        hours_text = 'Closed Today'
      } else {
        var time_now = moment()
          .tz(this.timezone)
          .format('kkmm')
        var open_time = moment(this.todaysHour.open_time.utc).tz(this.timezone)
        var close_time = moment(this.todaysHour.close_time.utc).tz(
          this.timezone
        )

        if (
          time_now > open_time.format('kkmm') &&
          time_now < close_time.format('kkmm')
        ) {
          // its open now
          hours_text = 'Open Until ' + close_time.format('h:mm A')
        } else if (
          time_now < open_time.format('kkmm') ||
          time_now > close_time.format('kkmm')
        ) {
          //its not open yet
          hours_text = 'Closed - Opens at ' + open_time.format('h:mm A')
        }
      }
      return hours_text
    }
  },
  methods: {
    updateCurrentStore(id) {
      this.$nextTick(function() {
        // this.currentStore = this.findStoreBySlug(id)
        if (this.currentStore === null || this.currentStore === undefined) {
          // this.$router.replace("/");
        } else {
          if (!this.currentStore.store_front_image_url) {
            this.currentStore.store_front_image_url = this.propertyBanner.image_url
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
          temp_promo = _.filter(this.processedPromos, function(o) {
            return o.promotionable_id == vm.currentStore.id
          })
          temp_event = _.filter(this.processedEvents, function(o) {
            return o.eventable_id == vm.currentStore.id
          })
          temp_job = _.filter(this.processedJobs, function(o) {
            return o.jobable_id == vm.currentStore.id
          })

          this.promotions = temp_promo
          this.events = temp_event
          this.jobs = temp_job
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
}
</script>
