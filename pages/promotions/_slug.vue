<template>
  <div class="promo_dets_container" v-if="currentPromo">
    <inside-page-header :pageBanner="pageBanner" :pageHeader="$t('promos_page.promotions')"></inside-page-header>
    <div class="site_container">
      <div class="row">
        <div class="col-sm-12 promo_image_container text-left">
          <nuxt-link to="/promotions" class="back_to_list hvr-underline-from-center">
            <span class="promo_back caps">
              <i class="fa fa-angle-left" style="margin-right:10px;"></i>
              {{$t("promos_page.back_to_promos")}}
            </span>
          </nuxt-link>
          <h3 style="margin: 20px auto 0px;" v-if="locale=='fr'">
            <span class="promo_name">{{currentPromo.name_2}}</span>}
          </h3>
          <h3 style="margin: 20px auto 0px;" v-else>
            <span class="promo_name">{{currentPromo.name}}</span>
          </h3>
          <div class>
            <nuxt-link
              v-if="currentPromo.store"
              :to="'/stores/'+currentPromo.store.slug"
              class="hvr-underline-from-center"
            >
              <p class="promo_store_name caps" v-if="locale=='fr'">{{currentPromo.store.name_2}}</p>
              <p class="promo_store_name caps" v-else>{{currentPromo.store.name}}</p>
            </nuxt-link>
          </div>
          <div class="clearfix promo_div_date">
            <p v-if="currentPromo.no_end_date">On Going</p>
            <p v-else-if="isMultiDay(currentPromo,timezone)">{{currentPromo.start_date | moment("MMMM D", timezone)}} - {{currentPromo.end_date | moment("MMMM D", timezone)}}</p>
            <p v-else>{{currentPromo.start_date | moment("MMMM D", timezone)}}</p>
            <social-sharing
              :url="shareURL(currentPromo.slug,'promotions')"
              :title="currentPromo.title"
              :description="currentPromo.body"
              :quote="truncate(currentPromo.description, {'length': 99})"
              :twitter-user="twitterUsername"
              :media="currentPromo.promo_image_url_abs_large"
              inline-template
            >
              <div class="social-share">
                <p class="no_margin caps">Share This Promotion:</p>
                <div class="social_share">
                  <network network="facebook">
                    <i class="fa fa-facebook-official" aria-hidden="true"></i>
                  </network>
                  <network network="twitter">
                    <i class="fa fa-twitter social_icons" aria-hidden="true"></i>
                  </network>
                </div>
              </div>
            </social-sharing>
            <!-- </div> -->
          </div>
          <div class="col-sm-12 no_padding promo_dets_desc">
            <img
              v-if="!isMissingImage(currentPromo.promo_image_url_abs_large)"
              v-lazy="currentPromo.promo_image_url_abs_large"
              class="image"
              alt
            >
            <div class="text-left promo_description">
              <p v-if="locale=='fr'" v-html="currentPromo.rich_description_2"></p>
              <p v-else v-html="currentPromo.rich_description"></p>
            </div>
            <div v-if="currentPromo.disclaimer_message" class="text-left promo_description">
              <p>{{currentPromo.disclaimer_message}}</p>
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
    /* SocialSharing: () => import("vue-social-sharing"),
    insidePageHeader: () => import("~/components/insidePageHeader.vue") */
  },
  data: function() {
    return {
      currentPromo: null,
      tempSEO: null,
      currentSEO: []
    };
  },
  async asyncData({ store, route }) {
    try {
      let results = await Promise.all([
        store.dispatch("getData", { resource: "promotions" }),
        store.dispatch("LOAD_SEO", {
          url: route.fullPath
        })
      ]);
      return { tempSEO: results[1].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.updateCurrentPromo(this.$route.params.slug);
    next();
  },
  created() {
    this.updateCurrentPromo(this.$route.params.slug);
    this.promos = this.promotions;
  },
  computed: {
    ...mapGetters([
      "property",
      "processedPromos",
      "findPromoBySlug",
      "findPromoById",
      "timezone",
      "findRepoByName",
      "locale"
    ]),
    allPromos() {
      return this.processedPromos;
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
    updateCurrentPromo(id) {
      this.$nextTick(function() {
        this.currentPromo = this.findPromoBySlug(id);
        if (this.currentPromo === null || this.currentPromo === undefined) {
          this.$router.replace("/");
        } else {
          if (this.tempSEO) {
            this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
          }
        }
      });
    }
  }
};
</script>