<template>
  <div>
    <category-menu-component categoryType="jobs" @selectedCategory="filterJobsByCategory"></category-menu-component>
    <div class="container">
      <div class="row" v-if="filteredJobs.length>0">
        <div class="col-md-6 col-sm-12 job-section" v-for="job in filteredJobs" :key="job.id">
          <div class="job-container">
            <div class="container-details col-7">
              <div v-if="job.store && job.store.name" class="promo-store-name">{{job.store.name}}</div>
              <div v-else class="promo-store-name">Southland Mall</div>
              <div class="promo-name">{{job.name}}</div>
              <p class="job_position">{{ job.job_type }}</p>
              <div class="promo-date">End Date: {{job.end_date | moment("MMM D", timezone)}}</div>
              <div class="promo-button btn p-0">
                <nuxt-link :to="'/jobs/'+job.slug">Job Details</nuxt-link>
              </div>
            </div>
            <div class="container-img col-5">
              <div v-if="job.image_url" v-lazy:background-image="job.image_url"></div>
              <div v-else v-lazy:background-image="job.store.store_front_url_abs"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-else style="margin-top: 30px">
        <p>There are no Promotions at this time. Please check back soon.</p>
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
    categoryMenuComponent: () =>
      import("~/components/categoryMenuComponent.vue")
  },
  data: function() {
    return {
      incrementBy: 9,
      showMore: 9,
      tempSEO: null,
      currentSEO: [],
      filteredJobs: null
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "jobs" }),
        store.dispatch("LOAD_SEO", {
          url: "/jobs"
        })
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
    this.filteredJobs = this.jobs;
    if (this.tempSEO) {
      this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
    }
  },
  watch: {
    filteredJobs() {
      if (!this.filteredJobs) {
        debugger;
        this.filteredJobs = this.jobs;
      }
    }
  },
  computed: {
    ...mapGetters([
      "property",
      "timezone",
      "processedJobs",
      "findRepoByName",
      "locale"
    ]),
    jobs() {
      var vm = this;
      var temp_promo = [];
      debugger;
      _.forEach(this.processedJobs, function(value, key) {
        var today = moment().tz(vm.timezone);
        var webDate = moment(value.show_on_web_date).tz(vm.timezone);
        if (today >= webDate) {
          value.description_short = _.truncate(value.description, {
            length: 150
          });
          value.description_short_2 = _.truncate(value.description_2, {
            length: 150
          });
          temp_promo.push(value);
        }
        if (_.isEmpty(value.store)) {
            value.store = {};
            value.store.store_front_url_abs =
              "https://www.mallmaverick.com/system/promotions/promo_images/000/135/896/original/SLM_-_Mall_Entrance.jpg?1542985738";
          }
      });

      return _.sortBy(temp_promo, [
        function(o) {
          return o.start_date;
        }
      ]).reverse();
    },

    pageBanner() {
      var pageBanner = null;
      var temp_repo = this.findRepoByName("Jobs Banner");
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
    loadMoreJobs() {
      if (this.showMore <= this.jobs.length) {
        var num = this.showMore + this.incrementBy;
        this.showMore = num;
      }
    },
    filterJobsByCategory: function(selectedCat) {
      if(selectedCat == "all") {
        this.filteredJobs = this.jobs;
      } else {
        debugger;
        var category_id = selectedCat.id;
      if (category_id == 0 || category_id == null || category_id == undefined) {
        this.filteredJobs = this.jobs;
      } else {
        var filtered = _.filter(this.jobs, function(o) {
          return _.indexOf(o.store.categories, _.toNumber(category_id)) > -1;
        });

        this.filteredJobs = filtered;
      }
      }
    },
    checkJobType(job) {
      if (this.locale != "en-ca") {
        if (job.job_type == "Full Time") {
          return "Plein Temps";
        } else if (job.job_type == "Part Time") {
          return "Mi Temps";
        } else if (job.job_type == "Full Time/Part Time") {
          return "Plein/Mi Temps";
        } else if (job.job_type == "Seasonal") {
          return "Travail Saisonnier";
        }
      } else {
        return job.job_type;
      }
    }
  }
};
</script>