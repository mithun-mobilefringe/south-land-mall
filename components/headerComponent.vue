<template>
  <!-- begin header nav -->
  <div class="nav-content sticky sticky-animate nav-spacing container">
    <div class="nav-container d-none d-sm-block">
      <div class="row">
        <div class="top-header col-12">
          <div class="top-header-mall">
            <div class="header-lang">
              <div>EN</div>
              <div>中文</div>
            </div>
            <div class="logo-header">
              <nuxt-link to="/" aria-label="logo">
                <div class="logo">
                  <h1 class="accessibility">{{ property.name }}</h1>
                </div>
              </nuxt-link>
            </div>
            <div class="header-signin"></div>
          </div>
        </div>
        <div class="d-none d-sm-block row">
          <div class="nav-container nav-bar col-12">
            <div @click="displayDropDown(1)" v-click-outside="hideShopDropDown" class="header-menu">
              Shop
              <div class="nav-arrow">
                <i class="fa fa-caret-down"></i>
              </div>
              <!-- <transition name="fade"> -->
              <shop-drop-down v-if="displayShopDropDown" :featured_stores="featuredStores"></shop-drop-down>
              <!-- </transition> -->
            </div>
            <div @click="displayDropDown(2)" v-click-outside="hideDineDropDown" class="header-menu">
              Dine
              <div class="nav-arrow">
                <i class="fa fa-caret-down"></i>
              </div>
              <!-- <transition name="fade"> -->
              <dine-drop-down v-if="displayDineDropDown" :featured_stores="featuredStores"></dine-drop-down>
              <!-- </transition> -->
            </div>
            <!-- <div @click="displayDropDown(3)" v-click-outside="hideStayDropDown" style="position: relative;">Stay<div class="nav-arrow"><i class="fa fa-caret-down"></i></div>
              <transition name="fade">
                <stay-drop-down v-if="displayStayDropDown"></stay-drop-down>
              </transition>
            </div>-->
            <div @click="displayDropDown(0)" class="header-menu">
              <nuxt-link to="/events">Events</nuxt-link>
            </div>
            <div @click="displayDropDown(0)" class="header-menu">
              <nuxt-link to="/news">News</nuxt-link>
            </div>
            <div @click="displayDropDown(0)" class="header-menu">
              <nuxt-link to="/services">Services</nuxt-link>
            </div>
            <div @click="displayDropDown(3)" v-click-outside="hideStayDropDown" class="header-menu">
              About
              <div class="nav-arrow">
                <i class="fa fa-caret-down"></i>
              </div>
              <!-- <transition name="fade"> -->
              <about-drop-down v-if="displayAboutDropDown"></about-drop-down>
              <!-- </transition> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- begin mobile header nav -->
    <div class="top-nav container-fluid d-sm-none nav-collapse" id="mob-top-nav">
      <div class="row">
        <div class="top-header col-12" v-if="!showMobileMenu">
          <div class="top-header-mall">
            <div class="header-lang">
              <div>EN</div>
              <div>中文</div>
            </div>
            <div class="logo-header">
              <nuxt-link to="/" aria-label="logo">
                <div class="logo">
                  <h1 class="accessibility">{{ property.name }}</h1>
                </div>
              </nuxt-link>
            </div>
            <div class="header-signin">
              <div class="hamburger" style="cursor: pointer;" @click="showMobileMenu=!showMobileMenu">
                <div class="hamburger__line">
                  <span class="hamburger__dots hamburger__dots--right"></span>
                </div>
                <div class="hamburger__line">
                  <span class="hamburger__dots hamburger__dots--up"></span>
                </div>
                <div class="hamburger__line">
                  <span class="hamburger__dots"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <transition
          name="custom-classes-transition"
          enter-active-class="animated slideInRight"
          leave-active-class="animated slideOutRight"
        >
        <mobile-menu-component v-if="showMobileMenu" @closeMenu="showMobileMenu=false"></mobile-menu-component>
      </transition>
    </div>
    <!-- end mobile header nav -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ClickOutside from "vue-click-outside";
import mobileMenuComponentVue from "./mobileMenuComponent.vue";
// import func from '../vue-temp/vue-editor-bridge';

export default {
  components: {
    shopDropDown: () => import("~/components/shopDropDown.vue"),
    dineDropDown: () => import("~/components/dineDropDown.vue"),
    stayDropDown: () => import("~/components/stayDropDown.vue"),
    aboutDropDown: () => import("~/components/aboutDropDown.vue"),
    mobileMenuComponent: () => import("~/components/mobileMenuComponent")
  },
  data: function data() {
    return {
      showOpaque: false,
      is_home: false,
      displayShopDropDown: false,
      displayStayDropDown: false,
      displayDineDropDown: false,
      displayAboutDropDown: false,
      featuredStores: [],
      showMobileMenu: false
    };
  },
  created() {
    this.$nextTick(function() {
      //Init
      debugger;
      this.featuredStores = this.homepage.featured_stores;
      this.getWindowWidth();
      if (this.$route.path === "/") {
        this.is_home = true;
      } else {
        this.is_home = false;
      }
    });
  },
  watch: {},
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function() {
      if (this.$route.path === "/") {
        this.is_home = true;
      } else {
        this.is_home = false;
      }
    });
  },
  computed: {
    ...mapGetters(["property", "homepage"]),
    menu1() {
      return _.slice(this.menu_items, 0, 4);
    },
    menu2() {
      return _.slice(this.menu_items, 4, this.menu_items.length);
    }
  },
  methods: {
    hideShopDropDown: function() {
      this.displayShopDropDown = false;
    },
    hideDineDropDown: function() {
      this.displayDineDropDown = false;
    },
    hideStayDropDown: function() {
      this.displayStayDropDown = false;
    },
    displayDropDown: function(menuItem) {
      if (menuItem == 1) {
        this.displayShopDropDown = !this.displayShopDropDown;
        this.displayDineDropDown = false;
        this.displayAboutDropDown = false;
      } else if (menuItem == 2) {
        this.displayDineDropDown = !this.displayDineDropDown;
        this.displayAboutDropDown = false;
        this.displayShopDropDown = false;
      } else if (menuItem == 3) {
        this.displayAboutDropDown = !this.displayAboutDropDown;
        this.displayDineDropDown = false;
        this.displayShopDropDown = false;
      } else {
        this.displayDineDropDown = false;
        this.displayShopDropDown = false;
        this.displayAboutDropDown = false;
      }
    }
  },
  mounted() {
    // prevent click outside event with popupItem.
    this.popupItem = this.$el;
  },

  // do not forget this section
  directives: {
    ClickOutside
  }
};
</script>