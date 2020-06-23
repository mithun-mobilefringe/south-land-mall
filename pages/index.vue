<template>
  <div>
    <div class="row">
      <div class="col-12 slick-carousel">
        <!-- <VueSlickCarousel v-bind="slickSettings">
          <div class v-for="banner in banners" :key="banner.id">
            <div
              class="home-banner"
              :style="{ 'background-image': 'url(' + banner.image_url + ')' }"
            ></div>
          </div>
        </VueSlickCarousel>-->
        <carousel-component :banners="banners"></carousel-component>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-12 homepage-label">
          <div class="home-page-title">The Art of Shopping</div>
          <div class="home-page-title-2">At {{property.name}}</div>
          <div class="home-page-title-3">Hundreds of Brand Name Stores & Services under one roof.</div>
        </div>
      </div>
      <div class="row mt-5" v-if="homepage_features.length >0">
        <div class="col-12" style="display: flex;">
          <div class="col-sm-4 p-0 d-none d-sm-block">
            <div class="featured-row-1">
              <div class="feature-store">
                <div style="font-family: Pistilli; font-size: 4rem;">50%</div>
                <div style="font-size: 2rem;">WINTER SALE AT H&M</div>
              </div>
            </div>
          </div>
          <div
            class="col-12 col-sm-8 p-0 feature-img"
            v-lazy:background-image="homepage_features[0].image_url"
          >
            <div class="label">{{homepage_features[0].name}}</div>
            <div class="btn feature-btn">
              <nuxt-link
                :to="'/promotions/' + homepage_features[0].slug"
                :aria-label="homepage_features[0].slug"
              >Promotion Details</nuxt-link>
            </div>
          </div>
        </div>
        <div class="col-12 d-flex">
          <div class="col-12 col-sm-8 feature-row-2 p-0">
            <div class="feature-img" v-lazy:background-image="homepage_features[1].image_url">
              <div class="label display-right">{{homepage_features[1].name}}</div>
              <div class="btn feature-btn display-right">
                <nuxt-link :to="'/events/' + homepage_features[1].slug">Event Details</nuxt-link>
              </div>
            </div>
            <div class="feature-img" v-lazy:background-image="homepage_features[2].image_url">
              <div class="label">{{homepage_features[2].name}}</div>
              <div class="btn feature-btn">
                <nuxt-link :to="'/promotions/' + homepage_features[2].slug">Promotion Details</nuxt-link>
              </div>
            </div>
          </div>
          <div class="col-4 p-0 d-none d-sm-block">
            <div class="feature-hours">
              <div>
                <div>
                  <i class="fa fa-clock-o clock"></i>
                </div>
                <div style="text-align: center;">
                  <span style="font-size: 1.5rem">WE ARE OPEN ON FAMILY DAY</span>
                  <br />
                  <span>9am to 9pm</span>
                </div>
                <div>
                  <button class="btn" style="border: solid 0.5px white; color: white">SHOPPING HOURS</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <instafeed></instafeed>
      </div>
      <div class="popup_container" v-if="currentPopup && show_popup">
        <i class="fa fa-times close_popup" @click="closePopup()"></i>
        <a v-if="currentPopup.photo_link" :href="currentPopup.photo_link" target="_target">
          <img :src="currentPopup.image_url" />
        </a>
        <img v-else :src="currentPopup.image_url" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Cookies from "js-cookie";
import carouselComponentVue from "../components/carouselComponent.vue";

export default {
  data: function() {
    return {
      slickOptions: {
        arrows: false,
        autoplay: true,
        autoplaySpeed: 6000,
        cssEase: "linear",
        dots: false,
        fade: true,
        infinite: true,
        slidesToShow: 1,
        speed: 1600,
        appendDots: ".hero-nav"
      },
      dataLoaded: false,
      show_popup: false,
      popup: null,
      tempSEO: null,
      currentSEO: {},
      homepage_features: [],
      slickSettings: {
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnDotsHover: true,
        pauseOnFocus: true,
        pauseOnHover: true,
        arrows: true,
        dots: true,
        rows: 2,
        slidesToShow: 2,
        slidesToScroll: 2,
        centerPadding: "0px",
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 700,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
              initialSlide: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      }
    };
  },
  transition: "page",
  components: {
    Slick: () => import("vue-slick"),
    VueSlickCarousel: () => import("vue-slick-carousel"),
    featureMasonry: () => import("~/components/featureMasonry.vue"),
    instafeed: () => import("~/components/instafeed.vue"),
    carouselComponent: () => import("~/components/carouselComponent.vue")
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "banners" }),
        store.dispatch("getMMData", { resource: "feature_items" }),
        store.dispatch("getMMData", { resource: "homepage" }),
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

    this.homepage_features = this.feature_homepage_items;

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
      "locale",
      "homepage"
    ]),
    banners() {
      var all_banners = this.$store.state.banners;
      var banners = [];
      _.forEach(all_banners[0].gallery_items, function(value, key) {
        var today = new Date();
        var start = new Date(value.start_date);
        if (start <= today) {
          if (value.end_date) {
            var end = new Date(value.end_date);
            if (end >= today) {
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
      debugger;
      var features = this.homepage;
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
    feature_homepage_items() {
      var homepage_features = [];
      _.forEach(this.homepage.featured_on_home_page_promotions, function(
        value,
        key
      ) {
        homepage_features.push(value);
      });
      _.forEach(this.homepage.featured_on_home_page_events, function(
        value,
        key
      ) {
        homepage_features.push(value);
      });
      homepage_features = _.orderBy(
        homepage_features,
        ["position_featured_on_home_page"],
        ["asc"]
      );
      _.forEach(homepage_features, function(value, key) {
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
      return homepage_features;
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
.home-banner {
  height: 340px;
}
.homepage-label {
  display: flex;
  flex-direction: column;
  color: #363636;
  margin-top: 2rem;
  justify-content: center;
  align-items: center;
}
.feature-row-2 {
  display: flex;
  flex-direction: column;
}
.featured-row-1 {
  background-color: #8b9595;
  padding: 1rem;
  height: 100%;
}
.feature-store {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  border: solid 0.5px white;
  color: #ffffff;
}
.feature-img {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 25rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  color: white;
}

.feature-hours {
  display: flex;
  padding: 1rem;
  background-color: #646e87;
  height: 100%;
  color: white;
}
.feature-hours > div {
  border: solid 0.5px white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
}
.feature-hours .clock {
  color: white;
  font-size: 6.5rem;
}
.feature-img .label {
  flex: 80%;
  justify-content: flex-start;
  padding: 1rem;
  align-items: center;
  display: flex;
  font-family: Pistilli;
  font-size: 2rem;
}
.feature-btn {
  flex: 20%;
  align-items: flex-end;
  display: flex;
  margin: 1rem;
}
.feature-btn a {
  border: solid 0.5px white;
  color: white;
  padding: 0.55rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
}
.display-right {
  justify-content: flex-end !important;
}
.slick-slide > div {
  height: 340px;
}
</style>

