<template>
  <div>
    <category-menu-component categoryType="stores"></category-menu-component>
    <inside-page-header :pageBanner="pageBanner" :pageHeader="$t('promos_page.promotions')"></inside-page-header>
    <div class="site_container page_content">
      <div id="events_container" v-if="promotions.length > 0" class="row">
        <div
          class="col-sm-4 event_container"
          v-for="(promo,index) in promotions"
          :class="{ 'last': index === (promotions.length - 1) }"
          :key="promo.id"
          v-if="showMore > index"
        >
          <nuxt-link :to="'/promotions/'+ promo.slug">
            <div class="row">
              <div class="col-sm-12 event_image_container">
                <div class="featured_tag" v-if="promo.is_featured">
                  <div class="featured_tag_text">Featured</div>
                </div>
                <div
                  v-if="isMissingImage(promo.store.store_front_url_abs)"
                  class="store_details_image center-block"
                >
                  <div class="no_logo">
                    <img class="store_img" src="/images/rect_transparent_logo.png" alt>
                    <h2 class="store_details_name">{{ promo.store.name }}</h2>
                  </div>
                </div>
                <div v-else>
                  <img class="transparent_logo" src="/images/rect_transparent_logo.png" alt>
                  <img class="event_image" :src="checkStoreImageURL(promo.store)" :alt="promo.name">
                </div>
              </div>
              <div class="col-sm-12 event_dets_container">
                <div class="center_container">
                  <div v-if="promo.promotionable_type == 'Store'">
                    <h4 class="event_store_name caps" v-if="locale=='fr'">{{promo.store.name_2}}</h4>
                    <h4 class="event_store_name caps" v-else>{{ promo.store.name }}</h4>
                  </div>
                  <div v-if="promo.promotionable_type == 'Property'">
                    <h4 class="event_store_name caps">{{ property.name }}</h4>
                  </div>
                  <h4 class="event_name caps" v-if="locale=='fr'">{{promo.name_2}}</h4>
                  <h4 class="event_name caps" v-else>{{truncate(promo.name, 40)}}</h4>
                  <p class="event_dates caps" v-if="promo.no_end_date">On Going</p>
                  <p class="event_dates caps" v-else>
                    <span
                      v-if="isMultiDay(promo,timezone)"
                    >{{promo.start_date | moment("MMMM D", timezone)}} - {{promo.end_date | moment("MMMM D", timezone)}}</span>
                    <span v-else>{{promo.start_date | moment("MMMM D", timezone)}}</span>
                  </p>
                  <span class="hvr-underline-from-center">View Promotion Details</span>
                </div>
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div id="no_events" class="row" v-else>
        <div class="col-md-12">
          <p>{{$t("promos_page.no_promo_message")}}</p>
        </div>
      </div>
      <div class="show_more">
        <div
          class="pointer contact_btn"
          v-if="promotions && showMore < promotions.length"
          @click="loadMorePromos()"
        >Load More</div>
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
    // insidePageHeader: () => import("~/components/insidePageHeader.vue")
    categoryMenuComponent: () => import('~/components/categoryMenuComponent.vue')
  },
  data: function() {
    return {
      incrementBy: 9,
      showMore: 9,
      tempSEO: null,
      currentSEO: []
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getData", { resource: "promotions" }),
        store.dispatch("LOAD_SEO", { url: "/promotions" })
      ]);
      return { tempSEO: results[1].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function() {
      if (this.tempSEO) {
        this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
      }
    });
    next();
  },
  created() {
    if (this.tempSEO) {
      this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
    }
  },
  computed: {
    ...mapGetters([
      "property",
      "timezone",
      "processedPromos",
      "findRepoByName",
      "locale"
    ]),
    promotions() {
      var vm = this;
      var temp_promo = [];
      var featured_temp_promo = [];
      var noend_temp_promo = [];
      // console.log("this.processedPromos", this.processedPromos)
      _.forEach(this.processedPromos, function(value, key) {
        var today = moment().tz(vm.timezone);
        var webDate = moment(value.show_on_web_date).tz(vm.timezone);
        if (today >= webDate) {
          // var current_time = moment().tz(vm.timezone).format("h:mm:ss");;
          // var start_time =  moment(value.start_date).tz(vm.timezone).format("h:mm:ss");
          // var end_time = moment(value.end_date).tz(vm.timezone).format("h:mm:ss");
          // console.log("current_time", current_time, "start", start_time, "end", end_time)
          // if (current_time > start_time && current_time < end_time ) {
            value.description_short = _.truncate(value.description, {
              length: 150
            });
            value.description_short_2 = _.truncate(value.description_2, {
              length: 150
            });
            if (_.isEmpty(value.store)) {
              value.store = {};
              value.store.store_front_url_abs =
                "/images/coquitlam_default_logo.png";
            }

            if (value.is_featured) {
              featured_temp_promo.push(value);
            } else if (value.no_end_date) {
              noend_temp_promo.push(value);
            } else {
              temp_promo.push(value);
            }
          // }
        }
      });

      featured_temp_promo = _.sortBy(featured_temp_promo, ["show_on_web_date"]).reverse();
      temp_promo = _.sortBy(temp_promo, ["show_on_web_date"]).reverse();
      noend_temp_promo = _.sortBy(noend_temp_promo, ["show_on_web_date"]).reverse();
      var promos = _.concat(featured_temp_promo, temp_promo, noend_temp_promo);
      return promos;
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
    loadMorePromos() {
      if (this.showMore <= this.promotions.length) {
        var num = this.showMore + this.incrementBy;
        this.showMore = num;
      }
    }
  }
};
</script>