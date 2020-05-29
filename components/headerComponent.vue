<template>
  <!-- begin header nav -->
  <div class="nav-content sticky-aniamte nav-spacing">
    <div class="nav-container">
      <div class="content-container d-none d-md-block row">
        <div class="top-header">
          <div class="header-lang">
            <div>EN</div>
            <div>中文</div>
          </div>
          <div class="logo-header">
            <img
              href="/"
              class="logo"
              src="//codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1539292470000/southland-mall-logo2-01-compressor.png"
              alt="SouthLand Mall"
            />
          </div>
          <div class="header-signin">
          </div>
        </div>
        <div class="nav-container nav-bar">
            <div @click="displayDropDown(1)" v-click-outside="hideShopDropDown" style="position: relative;">Shop<div class="nav-arrow"><i class="fa fa-caret-down"></i></div>
              <transition name="fade">
                <shop-drop-down v-if="displayShopDropDown"></shop-drop-down>
              </transition>
            </div>
            <div @click="displayDropDown(2)" v-click-outside="hideDineDropDown" style="position: relative;">Dine<div class="nav-arrow"><i class="fa fa-caret-down"></i></div>
              <transition name="fade">
                <dine-drop-down v-if="displayDineDropDown"></dine-drop-down>
              </transition>
            </div>
            <div @click="displayDropDown(3)" v-click-outside="hideStayDropDown" style="position: relative;">Stay<div class="nav-arrow"><i class="fa fa-caret-down"></i></div>
              <transition name="fade">
                <stay-drop-down v-if="displayStayDropDown"></stay-drop-down>
              </transition>
            </div>
            <div @click="displayDropDown(0)">News</div>
            <div @click="displayDropDown(0)">Services</div>
            <div @click="displayDropDown(0)">About</div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import tz from "moment-timezone";
import ClickOutside from 'vue-click-outside'
// import func from '../vue-temp/vue-editor-bridge';

export default {
  components: {
    shopDropDown: () => import('~/components/shopDropDown.vue'),
    dineDropDown: () => import('~/components/dineDropDown.vue'),
    stayDropDown: () => import('~/components/stayDropDown.vue'),
  },
  data: function data() {
    return {
      showOpaque: false,
      is_home: false,
      displayShopDropDown: false,
      displayStayDropDown: false,
      displayDineDropDown: false
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
        this.displayStayDropDown = false;
      } else if(menuItem == 2) {
        this.displayDineDropDown = !this.displayDineDropDown;
        this.displayStayDropDown = false;
        this.displayShopDropDown = false;
      } else if(menuItem == 3) {
        this.displayStayDropDown = !this.displayStayDropDown;
        this.displayDineDropDown = false;
        this.displayShopDropDown = false;
      } else {
        this.displayDineDropDown = false;
        this.displayShopDropDown = false;
        this.displayStayDropDown = false;
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
