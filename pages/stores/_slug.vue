<template>
  <div>
    <category-menu-component categoryType="stores"></category-menu-component>
    <div class="container">
      <div class="row">
        <div
          class="col-md-6 col-sm-12 promotion-section"
          v-for="store in allStores"
          :key="store.id"
        >
          {{store.name}}
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
  },
  async asyncData({ store, route }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "stores" }),
        store.dispatch("getMMData", { resource: "jobs" }),
        store.dispatch("getMMData", { resource: "promotions" }),
        store.dispatch("getMMData", { resource: "repos" }),
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
      all_store_items: null
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
      "locale"
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

          // loop through promotions
          //   var temp_promo = [];
          //   var featured_temp_promo = [];
          //   var noend_temp_promo = [];
          //   var store_promos = _.filter(this.processedPromos, function(o) {
          //     return o.promotionable_id == vm.currentStore.id;
          //   });
          //   _.forEach(store_promos, function(value, key) {
          //     var today = moment().tz(vm.timezone);
          //     var webDate = moment(value.show_on_web_date).tz(vm.timezone);
          //     if (today >= webDate) {
          //       value.description_short = _.truncate(value.description, {
          //         length: 70
          //       });
          //       value.description_short_2 = _.truncate(value.description_2, {
          //         length: 70
          //       });
          //       if (_.isEmpty(value.store)) {
          //         value.store = {};
          //         value.store.store_front_url_abs =
          //           "/images/coquitlam_default_logo.png";
          //       }

          //       if (value.is_featured) {
          //         featured_temp_promo.push(value);
          //       } else if (value.no_end_date) {
          //         noend_temp_promo.push(value);
          //       } else {
          //         temp_promo.push(value);
          //       }
          //     }
          //   });

          //   featured_temp_promo = _.sortBy(featured_temp_promo, [
          //     "end_date"
          //   ]).reverse();
          //   temp_promo = _.sortBy(temp_promo, ["end_date"]).reverse();
          //   noend_temp_promo = _.sortBy(noend_temp_promo, [
          //     "show_on_web_date"
          //   ]).reverse();
          //   var promos = _.concat(
          //     featured_temp_promo,
          //     temp_promo,
          //     noend_temp_promo
          //   );
          //   this.promotions = promos;

          //   var temp_job = [];
          //   _.forEach(this.currentStore.jobs, function(value, key) {
          //     var current_job = vm.findJobById(value);
          //     current_job.description_short = _.truncate(
          //       current_job.description,
          //       {
          //         length: 70
          //       }
          //     );
          //     temp_job.push(current_job);
          //   });
          //   this.jobs = temp_job;

          // Get Promos, Events, Jobs and News by store ID
          this.all_store_items = this.findStoreItemsByStoreId(
            this.currentStore.id
          );
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
