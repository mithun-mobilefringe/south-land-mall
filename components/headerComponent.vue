<template>
  <!-- begin header nav -->
  <div class="nav-content sticky-aniamte nav-spacing container">
    <div class="nav-container">
      <div class="d-none d-md-block row">
        <div class="top-header col-12">
          <div class="top-header-mall">
          <div class="header-lang">
            <div>EN</div>
            <div>中文</div>
          </div>
          <div class="logo-header">
            <nuxt-link to="/">
            <div class="logo"></div>
            </nuxt-link>
          </div>
          <div class="header-signin">
          </div>
          </div>
        </div>
        <div class="nav-container nav-bar col-12">
            <div @click="displayDropDown(1)" v-click-outside="hideShopDropDown" class="header-menu">Shop<div class="nav-arrow"><i class="fa fa-caret-down"></i></div>
              <transition name="fade">
                <shop-drop-down v-if="displayShopDropDown"></shop-drop-down>
              </transition>
            </div>
            <div @click="displayDropDown(2)" v-click-outside="hideDineDropDown" class="header-menu">Dine<div class="nav-arrow"><i class="fa fa-caret-down"></i></div>
              <transition name="fade">
                <dine-drop-down v-if="displayDineDropDown"></dine-drop-down>
              </transition>
            </div>
            <!-- <div @click="displayDropDown(3)" v-click-outside="hideStayDropDown" style="position: relative;">Stay<div class="nav-arrow"><i class="fa fa-caret-down"></i></div>
              <transition name="fade">
                <stay-drop-down v-if="displayStayDropDown"></stay-drop-down>
              </transition>
            </div> -->
            <div @click="displayDropDown(0)" class="header-menu"><nuxt-link to="/events"> Events</nuxt-link></div>
            <div @click="displayDropDown(0)" class="header-menu"><nuxt-link to="/news">News</nuxt-link></div>
            <div @click="displayDropDown(0)">Services</div>
            <div @click="displayDropDown(3)" v-click-outside="hideStayDropDown" style="position: relative;">About<div class="nav-arrow"><i class="fa fa-caret-down"></i></div>
              <transition name="fade">
                <about-drop-down v-if="displayAboutDropDown"></about-drop-down>
              </transition>
            </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ClickOutside from 'vue-click-outside'
// import func from '../vue-temp/vue-editor-bridge';

export default {
  components: {
    shopDropDown: () => import('~/components/shopDropDown.vue'),
    dineDropDown: () => import('~/components/dineDropDown.vue'),
    stayDropDown: () => import('~/components/stayDropDown.vue'),
    aboutDropDown: () => import('~/components/aboutDropDown.vue'),
  },
  data: function data() {
    return {
      showOpaque: false,
      is_home: false,
      displayShopDropDown: false,
      displayStayDropDown: false,
      displayDineDropDown: false,
      displayAboutDropDown: false
    };
  },
  created() {
    this.$nextTick(function() {
      //Init
      this.getWindowWidth();
      if (this.$route.path === "/") {
        this.is_home = true;
      } else {
        this.is_home = false;
      }
    });
  },
  watch: {
  },
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
    ...mapGetters(["property"]),
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
    hideStayDropDown: function () {
      this.displayStayDropDown = false;
    },
    displayDropDown: function(menuItem) {
      if(menuItem == 1) {
        this.displayShopDropDown = !this.displayShopDropDown;
        this.displayDineDropDown = false;
        this.displayAboutDropDown = false;
      } else if(menuItem == 2) {
        this.displayDineDropDown = !this.displayDineDropDown;
        this.displayAboutDropDown = false;
        this.displayShopDropDown = false;
      } else if(menuItem == 3) {
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
  mounted () {
    // prevent click outside event with popupItem.
    this.popupItem = this.$el
  },
 
  // do not forget this section
  directives: {
    ClickOutside
  }
};
</script>