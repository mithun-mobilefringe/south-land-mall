<template>
  <div class="promo_dets_container" v-if="currentJob">
    <category-menu-component categoryType="jobDetails"></category-menu-component>
    <div class="site_container container">
      <div class="row">
        <div class="col-12 top-section">
          <div class="col-6 top-section-detail">
            <div class="detail">
              <div class="detail-internal">
                <div class="detail-date">
                  End Date: {{currentJob.end_date | moment("MMM D", timezone)}}
                </div>
                <div class="detail-name">
                  {{currentJob.name}} - {{ currentJob.job_type }}
                </div>
                <div class="detail-description">
                  <span v-html="currentJob.description"></span>
                </div>
                
                <div class="detail-buttons">
                  <div class="visit-button btn" v-if="currentJob.store">
                    <nuxt-link :to="'/stores' + currentJob.store.slug">Visit {{currentJob.store.name}}</nuxt-link>
                  </div>
                  <div class="share-button">
                    Share Jobs
                    <i class="fa fa-share"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6 p-0 img-box">
            <div class="img" v-lazy:background-image="currentJob.image_url">

              <!-- <img :src="currentJob.image_url"/> -->
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="storeJobs.length > 0">
        <div class="other-promotions-lbl col-12">
          Other Jobs at {{currentJob.store.name}}
        </div>
      </div>
      <div class="row" v-if="storeJobs.length > 0">
        <div
          class="col-md-6 col-sm-12 promotion-section"
          v-for="promotion in storeJobs"
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
    // SocialSharing: () => import("vue-social-sharing"),
    // insidePageHeader: () => import("~/components/insidePageHeader.vue")
    categoryMenuComponent: () =>
      import("~/components/categoryMenuComponent.vue")
  },
  data: function() {
    return {
      currentJob: null,
      tempSEO: null,
      currentSEO: [],
      storeJobs: []
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "jobs" }),
        store.dispatch("LOAD_SEO", {
          name: "/jobs"
        })
      ]);
      return { tempSEO: results[1].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.updateCurrentJob(this.$route.params.slug);
    next();
  },
  created() {
    this.updateCurrentJob(this.$route.params.slug);
  },

  computed: {
    ...mapGetters([
      "property",
      "processedJobs",
      "findJobBySlug",
      "findJobById",
      "timezone",
      "findRepoByName",
      "locale"
    ]),
    allJobs() {
      return this.processedJobs;
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
    updateCurrentJob(id) {
      this.$nextTick(function() {
        this.currentJob = this.findJobBySlug(id);
        if (this.currentJob === null || this.currentJob === undefined) {
          this.$router.replace("/");
        } else {
          if (this.tempSEO) {
            this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
          }
          this.loadStoreJobs();
        }
      });
    },
    loadStoreJobs: function() {
      this.storeJobs = this.processedJobs.filter(job => {
        if(job.store && this.currentJob.store) {
          return (job.store.id == this.currentJob.store.id) && (job.id != this.currentJob.id);
        } else {
          return false;
        }
        
      });
    }
  }
};
</script>