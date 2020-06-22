<template>
  <div>
    <div id="nav-right" class="nav-right" v-if="banners.length > 1" v-lazy:background-image="banners[1].cover_image_url">
      <div class="mobile-menu">
      <div class="row">
        <div class="top-header col-12">
          <div class="top-header-mall">
            <div class="header-lang justify-content-center align-middle">
              <div class="text-center">EN</div>
              <div class="text-center">中文</div>
            </div>
            <div class="logo-header">
              <nuxt-link to="/" aria-label="logo">
                <div class="logo">
                  <h1 class="accessibility">{{ property.name }}</h1>
                </div>
              </nuxt-link>
            </div>
            <div class="header-signin">
              <div class="hamburger open" style="cursor: pointer;" @click="$emit('closeMenu')">
                <div class="hamburger__line">
                  <span class="hamburger__dots"></span>
                  <span class="hamburger__dots hamburger__dots--right"></span>
                  <span class="hamburger__dots"></span>
                </div>
                <div class="hamburger__line">
                  <span class="hamburger__dots hamburger__dots--up"></span>
                  <span class="hamburger__dots"></span>
                  <span class="hamburger__dots hamburger__dots--down"></span>
                </div>
                <div class="hamburger__line">
                  <span class="hamburger__dots"></span>
                  <span class="hamburger__dots hamburger__dots--left"></span>
                  <span class="hamburger__dots"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mobile-opacity">
        <div class="row m-4">
          <div class="col-12 d-flex justify-content-center align-middle">Open Now until 9 pm</div>
          <div class="col-12 d-flex justify-content-center align-middle">
            <nuxt-link to="/">Shopping Hours</nuxt-link>
          </div>
        </div>
        <div class="row m-0">
          <div class="col-12" style="margin-bottom: 15px;">
            <input type="search" placeholder="Search for Stores" />
          </div>
        </div>
        <div class="row m-0">
          <div class="col-6 btn-menu" v-for="menu in menulist" :key="menu.index">
            <div class="btn btn-outline-light" @click="$emit('closeMenu')">
              <nuxt-link :to="menu.link">{{menu.name}}</nuxt-link>
            </div>
          </div>
        </div>
        <div>
          <div class="row m-3">
            <div
              class="col-12 d-flex justify-content-center align-middle"
            >Guest Services: {{property.contact_phone}}</div>
          </div>
          <div class="row m-3">
            <div class="col-12">
              <div class="icons">
                <i class="fa fa-facebook-square"></i>
                <i class="fa fa-instagram"></i>
                <i class="fa fa-youtube"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {
    SearchComponent: () => import("~/components/SearchComponent.vue")
  },
  data: function() {
    return {
      search_result: null,
      suggestionAttribute: "name",
      keys: ["name", "description", "tags", "store.name"],
      searchResultList: [],
      storeSearchResultList: [],
      promoSearchResultList: [],
      eventSearchResultList: [],
      banners: [],
      menulist: [
        { name: "Shop", link: "/stores" },
        { name: "News", link: "/news" },
        { name: "Mall Map", link: "/map" },
        { name: "Events", link: "/events" },
        { name: "Promos", link: "/promotions" },
        { name: "Services", link: "/services" },
        { name: "Dine", link: "/dine" },
        { name: "About", link: "/" },
        { name: "Careers", link: "/jobs" },
        { name: "Directions", link: "/" }
      ]
      // jobSearchResultList: []
    };
  },
  computed: {
    ...mapGetters([
      "property",
      "timezone",
      "processedStores",
      "processedEvents",
      "processedPromos",
      "processedCategories"
      // 'processedJobs'
    ])
  },
  created() {
    this.banners =  this.$store.state.banners;
  },
  methods: {
    searchList() {
      var events = this.processedEvents;
      _.forEach(events, function(value, key) {
        if (_.includes(value.eventable_type, "Property")) {
          value.is_store = false;
        } else {
          value.is_store = true;
        }
      });
      var promos = this.processedPromos;
      _.forEach(promos, function(value, key) {
        if (_.includes(value.promotionable_type, "Property")) {
          value.is_store = false;
        } else {
          value.is_store = true;
        }
      });
      var stores = this.processedStores;
      _.forEach(stores, function(value, key) {
        value.is_store = true;
      });

      // var list = _.union(stores, events, promos, jobs)
      var list = _.union(stores, events, promos);
      return list;
    }
  },
  mounted() {
    debugger;
    this.banners =  this.$store.state.banners;
  }
};
</script>
