<template>
  <div class="promo_dets_container" v-if="currentNews">
    <category-menu-component categoryType="newsDetails"></category-menu-component>
    <div class="site_container container">
      <div class="row">
        <div class="col-12 d-sm-none p-0">
            <div class="top-image" v-lazy:background-image="currentNews.image_url">
            </div>
          </div>
        <div class="col-12 top-section">
          <div class="col-12 col-sm-6 top-section-detail">
            <div class="detail">
              <div class="detail-internal">
                <div
                  class="detail-date"
                >End Date: {{currentNews.end_date | moment("MMM D", timezone)}}</div>
                <div class="detail-name">{{currentNews.name}}</div>
                <div class="detail-description">
                  <span v-html="currentNews.description"></span>
                </div>

                <div class="detail-buttons">
                  <div class="visit-button btn" v-if="currentNews.store">
                    <nuxt-link
                      :to="'/stores/' + currentNews.store.slug"
                    >Visit {{currentNews.store.name}}</nuxt-link>
                  </div>
                  <div class="share-button col-12 col-sm-6">
                    Share News
                    <i class="fa fa-share"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-6 p-0 img-box d-none d-sm-block">
            <div class="img" v-lazy:background-image="currentNews.image_url">
              <!-- <img :src="currentNews.image_url"/> -->
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-if="storeNews.length > 0">
        <div class="other-promotions-lbl col-12">Other News at {{currentNews.store.name}}</div>
      </div>
      <hr v-if="storeNews.length > 0"/>
      <div class="row" v-if="storeNews.length > 0">
        <div
          class="col-md-6 col-sm-12 promotion-section"
          v-for="promotion in storeNews"
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
                <nuxt-link :to="'/news/'+promotion.slug">News Details</nuxt-link>
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
      currentNews: null,
      tempSEO: null,
      currentSEO: [],
      storeNews: []
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "news" }),
        store.dispatch("LOAD_SEO", {
          name: "/news"
        })
      ]);
      return { tempSEO: results[1].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.updateCurrentNews(this.$route.params.slug);
    next();
  },
  created() {
    this.updateCurrentNews(this.$route.params.slug);
  },

  computed: {
    ...mapGetters([
      "property",
      "processedNews",
      "findNewsBySlug",
      "findNewsById",
      "timezone",
      "findRepoByName",
      "locale"
    ]),
    allNews() {
      return this.processedNews;
    },
    pageBanner() {
      var pageBanner = null;
      var temp_repo = this.findRepoByName("News Banner");
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
    updateCurrentNews(id) {
      debugger;
      this.$nextTick(function() {
        this.currentNews = this.findNewsBySlug(id);
        if (this.currentNews === null || this.currentNews === undefined) {
          this.$router.replace("/");
        } else {
          if (this.tempSEO) {
            this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
          }
          this.loadStoreNews();
        }
      });
    },
    loadStoreNews: function() {
      debugger;
      this.storeNews = this.processedNews.filter(news => {
        if (news.store && this.currentNews.store) {
          return (
            news.store.id == this.currentNews.store.id &&
            news.id != this.currentNews.id
          );
        } else {
          return false;
        }
      });
    }
  }
};
</script>