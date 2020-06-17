<template>
  <div>
    <category-menu-component categoryType="news" @selectedCategory="filterNewsByCategory"></category-menu-component>
    <div class="container">
      <div class="row" v-if="filteredNews.length > 0">
        <div class="col-md-6 col-sm-12 news-section" v-for="news in filteredNews" :key="news.id">
          <div class="news-container">
            <div class="container-details col-7">
              <div v-if="news.store && news.store.name" class="promo-store-name">{{news.store.name}}</div>
              <div v-else class="promo-store-name">Southland Mall</div>
              <div class="promo-name">{{news.name}}</div>
              <div class="promo-date">End Date: {{news.end_date | moment("MMM D", timezone)}}</div>
              <div class="promo-button btn p-0">
                <nuxt-link :to="'/news/'+news.slug">News Details</nuxt-link>
              </div>
            </div>
            <div class="container-img col-5">
              <div v-if="news.image_url" v-lazy:background-image="news.image_url"></div>
              <div v-else v-lazy:background-image="news.store.store_front_url_abs"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" style="margin-top: 30px" v-else>
        <p>There are no News at this time. Please check back soon.</p>
      </div>
      <back-to-top></back-to-top>
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
      import("~/components/categoryMenuComponent.vue"),
      backToTop: () => import("~/components/backToTop.vue")
  },
  data: function() {
    return {
      incrementBy: 9,
      showMore: 9,
      tempSEO: null,
      currentSEO: [],
      filteredNews: null
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "news" }),
        store.dispatch("LOAD_SEO", {
          url: "/news"
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
    this.filteredNews = this.newss;
    if (this.tempSEO) {
      this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
    }
  },
  watch: {
    filteredNews() {
      if (!this.filteredNews) {
        this.filteredNews = this.newss;
      }
    }
  },
  computed: {
    ...mapGetters([
      "property",
      "timezone",
      "processedNews",
      "findRepoByName",
      "locale"
    ]),
    newss() {
      var vm = this;
      var temp_promo = [];
      _.forEach(this.processedNews, function(value, key) {
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
    loadMoreNews() {
      if (this.showMore <= this.news.length) {
        var num = this.showMore + this.incrementBy;
        this.showMore = num;
      }
    },
    filterNewsByCategory: function(selectedCat) {
      if(selectedCat == "all") {
        this.filteredNews = this.newss;
      } else {
        var category_id = selectedCat.id;
      if (category_id == 0 || category_id == null || category_id == undefined) {
        this.filteredNews = this.newss;
      } else {
        var filtered = _.filter(this.newss, function(o) {
          return _.indexOf(o.store.categories, _.toNumber(category_id)) > -1;
        });
        this.filteredNews = filtered;
      }
      }
    }
  }
};
</script>