<template>
  <div>
    <category-menu-component categoryType="promotions"></category-menu-component>
    <div class="container">
      <div class="row">
        <div
          class="col-md-6 col-sm-12 promotion-section"
          v-for="promotion in promotions"
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
              <div class="promo-button btn p-0">
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
    // insidePageHeader: () => import("~/components/insidePageHeader.vue")
    categoryMenuComponent: () =>
      import("~/components/categoryMenuComponent.vue")
  },
  data: function() {
    return {
      incrementBy: 9,
      showMore: 9,
      tempSEO: null,
      currentSEO: [],
      filteredPromotions: null
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "promotions" }),
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
  watch: {
    filteredPromotions() {
      if (!this.filteredPromotions) {
        this.filteredPromotions = this.promotions;
      }
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
              "https://www.mallmaverick.com/system/promotions/promo_images/000/135/896/original/SLM_-_Mall_Entrance.jpg?1542985738";
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

      featured_temp_promo = _.sortBy(featured_temp_promo, [
        "show_on_web_date"
      ]).reverse();
      temp_promo = _.sortBy(temp_promo, ["show_on_web_date"]).reverse();
      noend_temp_promo = _.sortBy(noend_temp_promo, [
        "show_on_web_date"
      ]).reverse();
      var promos = _.concat(featured_temp_promo, temp_promo, noend_temp_promo);
      return promos;
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