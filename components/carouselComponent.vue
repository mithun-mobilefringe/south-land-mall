<template>
  <div class="homepage_view_container">
    <!-- <div class="homepage_view_container" > -->
    <slick ref="slick" :options="slickOptions" class="d-none d-sm-block slick-height">
      <div class="homepage-view-1" style="flex-direction: column;">
        <div class="banner-slider d-flex">
          <div v-if="banners[0].name && banners[0].image_url" class="banner_height">
            <a :href="banners[0].url" :aria-label="banners[0].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[0].image_url + ')' }"
              >
                <div class="banner-label">{{banners[0].name}}</div>
              </div>
            </a>
          </div>
          <div v-if="banners[1].name && banners[1].image_url" class="banner_height">
            <a :href="banners[1].url" :aria-label="banners[1].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[1].image_url + ')' }"
              ><div class="banner-label">{{banners[1].name}}</div></div>
            </a>
          </div>
        </div>
        <div class="banner-slider d-flex">
          <div
            v-if="banners[2].name && banners[2].image_url"
            class="banner_height"
            style="flex:25%"
          >
            <a :href="banners[2].url" :aria-label="banners[2].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[2].image_url + ')' }"
              ><div class="banner-label">{{banners[2].name}}</div></div>
            </a>
          </div>
          <div
            v-if="banners[3].name && banners[3].image_url"
            class="banner_height"
            style="flex:50%"
          >
            <a :href="banners[3].url" :aria-label="banners[3].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[3].image_url + ')' }"
              ><div class="banner-label">{{banners[3].name}}</div></div>
            </a>
          </div>
          <div
            v-if="banners[4].name && banners[4].image_url"
            class="banner_height"
            style="flex:25%"
          >
            <a :href="banners[4].url" :aria-label="banners[4].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[4].image_url + ')' }"
              ><div class="banner-label">{{banners[4].name}}</div></div>
            </a>
          </div>
        </div>
      </div>

      <div class="homepage-view-2" style="flex-direction: column;">
        <div class="banner-slider d-flex">
          <div v-if="banners[5].name && banners[5].image_url" class="banner_height">
            <a :href="banners[5].url" :aria-label="banners[5].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[5].image_url + ')' }"
              ><div class="banner-label">{{banners[5].name}}</div>
              </div>
            </a>
          </div>
          <div v-if="banners[6].name && banners[6].image_url" class="banner_height">
            <a :href="banners[6].url" :aria-label="banners[6].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[6].image_url + ')' }"
              ><div class="banner-label">{{banners[6].name}}</div></div>
            </a>
          </div>
        </div>
        <div class="banner-slider d-flex">
          <div
            v-if="banners[4].name && banners[4].image_url"
            class="banner_height"
            style="flex:25%"
          >
            <a :href="banners[4].url" :aria-label="banners[4].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[4].image_url + ')' }"
              ><div class="banner-label">{{banners[4].name}}</div></div>
            </a>
          </div>
          <div
            v-if="banners[7].name && banners[7].image_url"
            class="banner_height"
            style="flex:25%"
          >
            <a :href="banners[7].url" :aria-label="banners[7].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[7].image_url + ')' }"
              ><div class="banner-label">{{banners[7].name}}</div></div>
            </a>
          </div>
          <div
            v-if="banners[8].name && banners[8].image_url"
            class="banner_height"
            style="flex:50%"
          >
            <a :href="banners[8].url" :aria-label="banners[8].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[8].image_url + ')' }"
              ><div class="banner-label">{{banners[8].name}}</div></div>
            </a>
          </div>
        </div>
      </div>
    </slick>

    <!-- <slick ref="slick" :options="slickOptions" class="d-sm-none slick-height mobile-carousel">
        
    </slick> -->


    <VueSlickCarousel :arrows="true" :dots="true" :autoplay="true" class="slick-height mobile-carousel d-sm-none">
      
          <div v-if="banners[1].name && banners[1].image_url" class="banner_height">
            <a :href="banners[1].url" :aria-label="banners[1].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[1].image_url + ')' }"
              >
                <div class="banner-label">
                  <p>{{banners[1].name}}</p>
                  <nuxt-link class="btn" to="/stores">Stores Directory</nuxt-link>
                </div>
              </div>
            </a>
          </div>
          <div v-if="banners[5].name && banners[5].image_url" class="banner_height">
            <a :href="banners[5].url" :aria-label="banners[5].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[5].image_url + ')' }"
              ><div class="banner-label">
                <p>{{banners[5].name}}</p>
                  <nuxt-link class="btn" to="/dine">Dine</nuxt-link>
              </div>
              </div>
            </a>
          </div>
          <div v-if="banners[2].name && banners[2].image_url" class="banner_height">
            <a :href="banners[2].url" :aria-label="banners[2].name" class="banner_content">
              <div
                class="banner_image"
                v-bind:style="{ backgroundImage: 'url(' + banners[2].image_url + ')' }"
              >
                <div class="banner-label">{{banners[2].name}}</div>
              </div>
            </a>
          </div>
    </VueSlickCarousel>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import tz from "moment-timezone";

export default {
  props: ["banners"],
  components: {
    Slick: () => import("vue-slick"),
    VueSlickCarousel: () => import("vue-slick-carousel")
  },
  data() {
    return {
      slickOptions: {
        adaptiveHeight: true,
        cssEase: "linear",
        infinite: false,
        slidesToShow: 1,
        speed: 2000,
        draggable: false,

        arrows: true,
        nextArrow: '<i class="fa fa-chevron-right"></i>',
        prevArrow: '<i class="fa fa-chevron-left"></i>',

        responsive: [
          {
            breakpoint: 768,
            settings: {
              swipe: false,
              waitForAnimate: false
            },
            breakpoint: 480,
            settings: {
              swipe: false,
              waitForAnimate: false
            }
          }
        ]
      },
    };
  },
  mounted() {
    debugger;
    if (this.featured_stores) this.featured_store = this.featured_stores[1];
  },
  computed: {},
  methods: {
    getEncodeURI: function(string) {
      return "/dine?type=" + encodeURIComponent(string);
    }
  }
};
</script>
<style scoped>
.slick-height {
  height: 35rem;
}
@media (max-width: 566.99px) {
  .slick-height {
  height: 22rem;
}
  
}
</style>