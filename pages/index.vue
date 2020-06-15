<template>
  <div class="row page_content">
    <div class="banner_div">
      <div class="home-banner-container">
        <slick ref="slick" :options="slickOptions" v-if="banners">
          <div class v-for="banner in banners" :key="banner.id">
            {{banner}}
            <div
              class="home-banner"
              :style="{ 'background-image': 'linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url(' + banner.image_url + ')' }"
              v-if="banner.name && banner.description"
            >
              <div class="banner_text site_container" v-if="banner.name && banner.description">
                <h1 v-if="banner.name" class="banner_title">{{banner.name}}</h1>
                <a v-if="banner.url" class="banner_btn hvr-icon-wobble-horizontal" :href="banner.url">
                  <h3 class="caps inline_block">{{ banner.description }} <i class="fa fa-angle-right hvr-icon"></i></h3>
                </a>
                <span v-else-if="banner.description">{{banner.description}}</span>
              </div>
            </div>
            <div v-else-if="banner.url"> 
              <a :href="banner.url">
                <div class="home-banner" :style="{ 'background-image': 'url(' + banner.image_url + ')' }">
                  <p style="display:none;">Banner Image</p>
                </div>
              </a>
            </div>
            <div v-else class="home-banner" :style="{ 'background-image': 'url(' + banner.image_url + ')' }"></div>
          </div>
        </slick>
      </div>
    </div>
    <div class="site_container">
      <div>
        <h2 class="home_page_title caps">{{$t("home_page.explore")}}</h2>
      </div>
      <feature-masonry class="hidden_phone" :feature_items="feature_items" :locale="locale" key="1"></feature-masonry>
      <feature-masonry
        class="visible_phone"
        :feature_items="mobile_feature_items"
        :locale="locale"
        key="2"
      ></feature-masonry>
      <div v-if="holiday_feature_items && holiday_feature_items.length > 0">
        <h2 class="home_page_title caps">{{$t("home_page.holiday_features")}}</h2>
      </div>
      <feature-masonry
        :feature_items="holiday_feature_items"
        :locale="locale"
        key="3"
        v-if="holiday_feature_items && holiday_feature_items.length > 0"
      ></feature-masonry>
      <!-- <div>
        <h2 class="home_page_title caps">{{$t("home_page.our_feed")}}</h2>
      </div> -->
      <div class="insta-feed-container clearfix">
        <!-- <div class="insta-feed-image" v-for="(item, index) in instaFeed" :key="index">
          <a :href="item.link" target="_blank">
            <div
              class="insta-feed-background"
              v-bind:style="{ backgroundImage: 'url(' + item.images.standard_resolution.url + ')' }"
            ></div>
            <div class="insta_content">
              <div class="insta_caption">
                <p v-if="item.caption">{{ item.caption.text }}</p>
                <div>
                  <span>
                    <i class="fa fa-heart"></i>
                    {{ item.likes.count }}
                  </span>
                  <span>
                    <i class="fa fa-comment"></i>
                    {{ item.comments.count }}
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div> -->
      </div>
    </div>
    <!-- <div style="height: 300px;margin-bottom:-30px;width: 100%;">
      <iframe
        :src="propertyAddress()"
        width="100%"
        height="300"
        frameborder="0"
        style="border:0"
        allowfullscreen
      ></iframe>
    </div> -->
    <div class="popup_container" v-if="currentPopup && show_popup">
      <i class="fa fa-times close_popup" @click="closePopup()"></i>
      <a v-if="currentPopup.photo_link" :href="currentPopup.photo_link" target="_target">
        <img :src="currentPopup.image_url">
      </a>
      <img v-else :src="currentPopup.image_url">
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Cookies from "js-cookie";

export default {
  data: function() {
    return {
      slickOptions: {
        arrows: false,
        autoplay: true,
        autoplaySpeed: 6000,
        cssEase: "linear",
        dots: true,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        speed: 1600
      },
      dataLoaded: false,
      show_popup: false,
      popup: null,
      tempSEO: null,
      currentSEO: {},
    };
  },
  transition: "page",
  components: {
    Slick: () => import("vue-slick"),
    featureMasonry: () => import("~/components/featureMasonry.vue")
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "banners" }),
        store.dispatch("getMMData", { resource: "feature_items" }),
        store.dispatch("getMMData", { resource: "popups" }),
        store.dispatch("LOAD_SEO", {
          url: "/"
        })
      ]);
      return {
        tempSEO: results[4].data.meta_data[0]
      };
    } catch (e) {
      console.log(e.message);
    }
  },
  mounted() {
    var viewed = null;
    if (this.locale == "en") {
      viewed = Cookies.get("popup_viewed_en");
    } else {
      viewed = Cookies.get("popup_viewed_fr");
    }

    if (this.currentPopup && viewed !== "true") {
      if (this.locale == "en") {
        Cookies.set("popup_viewed_en", "true");
      } else {
        Cookies.set("popup_viewed_fr", "true");
      }
      this.show_popup = true;
      this.currentPopup.image_url =
        "//mallmaverick.cdn.speedyrails.net" + this.currentPopup.photo_url;
      if (document.getElementById("popup_backdrop")) {
        document.getElementById("popup_backdrop").style.display = "block";
      }
    } else {
      if (document.getElementById("popup_backdrop")) {
        document.getElementById("popup_backdrop").style.display = "none";
      }
    }
  },
  watch: {
    show_popup() {
      if (this.show_popup === true) {
        document.body.classList.add("no-scroll");
      } else if (this.show_popup === false) {
        document.body.classList.remove("no-scroll");
      }
    }
  },
  computed: {
    ...mapGetters([
      "property",
      "timezone",
      "processedStores",
      "getTodayHours",
      "locale"
    ]),
    banners() {
      var all_banners = this.$store.state.banners;
      var banners = [];
      _.forEach(all_banners, function (value, key) {
        var today = new Date();
        var start = new Date (value.start_date);
        if (start <= today){
          if (value.end_date){
            var end = new Date (value.end_date);
            if (end >= today){
              banners.push(value);  
            }
          } else {
            banners.push(value);
          }
        }
      });
      banners = _.orderBy(banners, ["position"], ["asc"]);
      return banners;
    },
    feature_items() {
      var features = this.$store.state.feature_items;
      _.forEach(features, function(value, key) {
        if (_.includes([0, 6], key)) {
          value.masonry_class = "grid-item--height2";
        } else if (_.includes([2, 5], key)) {
          value.masonry_class = "grid-item--width2";
        } else {
          value.masonry_class = " ";
        }
        if (
          value.name === null ||
          value.name === undefined ||
          value.name.length == 0
        ) {
          value.no_hover_class = false;
        } else {
          value.no_hover_class = true;
        }
      });
      return _.slice(features, [0], [8]);
    },
    mobile_feature_items() {
      var features = this.$store.state.feature_items;
      _.forEach(features, function(value, key) {
        if (_.includes([0, 6], key)) {
          value.masonry_class = "grid-item--height2";
        } else if (_.includes([2, 5], key)) {
          value.masonry_class = "grid-item--width2";
        } else {
          value.masonry_class = " ";
        }
        if (key == 1) {
          value.mobile_order = 6;
        } else if (key == 6) {
          value.mobile_order = 1;
        } else {
          value.mobile_order = key;
        }

        if (_.includes(value.url, "//")) {
          value.do_anchor_tag = true;
        } else {
          value.do_anchor_tag = false;
        }
      });
      features = _.sortBy(features, [
        function(o) {
          return o.mobile_order;
        }
      ]);
      return _.slice(features, [0], [8]);
    },
    holiday_feature_items() {
      var features = _.slice(this.$store.state.feature_items, [8], [12]);
      _.forEach(features, function(value, key) {
        if (_.includes([2], key)) {
          value.masonry_class = "grid-item--width2";
        } else {
          value.masonry_class = " ";
        }

        if (_.includes(value.url, "//")) {
          value.do_anchor_tag = true;
        } else {
          value.do_anchor_tag = false;
        }
      });

      return features;
    },
    currentPopup() {
      var popup = null;
      if (this.$store.state.popups) {
        popup = this.$store.state.popups[0];
      }
      return popup;
    }
  },
  methods: {
    closePopup() {
      this.show_popup = false;
      document.getElementById("popup_backdrop").style.display = "none";
    },
    loadMap() {
      window.initMap();
    }
  }
};
</script>
<style>
@import "~/node_modules/slick-carousel/slick/slick.css";
</style>

