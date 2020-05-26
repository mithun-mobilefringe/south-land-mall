<template>
  <!-- begin header nav -->
  <div
    class="nav-content sticky-aniamte nav-spacing"
    :class="{ sticky: scrolled, 'nav-up': navUp }"
  >
    <div
      class="nav-container"
      :class="{'float-top': !isScrolling, 'fixed-top': isScrolling, 'nav-opened': showLeftNav || showSearchWindow }"
    >
      <div
        class="top-nav container-fluid d-none d-md-block"
        :class="{'navbar-transparent': isTransparent, 'navbar-opaque': showOpaque || showLeftNav || showSearchWindow || scrolled || isMobile, 'home': ($route.path === '/' )}"
      >
        <nav aria-label="Header Navigation" class="navbar">
          <ul class="navbar-nav">
            <li role="menu" class="nav-item" v-for="(item, index) in  menu1" :key="index">
              <nuxt-link to="/" v-if="item.img">
                <img :src="item.img" :alt="item.alt" />
              </nuxt-link>
              <span
                to
                v-else-if="item.id=='stores'"
                class="nav-link"
                v-on:click.prevent="onStoresClick(); showOpaque = !showOpaque"
                @keydown.space.prevent="onStoresClick()"
                @keydown.down.prevent="focusOnStoresMenu"
                @keydown.esc.prevent="closeLeftNav('desktop')"
                @keydown.tab="closeLeftNav('events')"
                :aria-expanded="showLeftNav ? 'true' : 'false'"
              >
                {{ item.name }}
                <span
                  class="ion-android-close ml-1"
                  v-bind:class="{'invisible': !showLeftNav }"
                ></span>
              </span>
              <nuxt-link v-else :to="item.href" class="nav-link">{{ item.name }}</nuxt-link>
              <!-- <nuxt-link :to="item.href" aria-expanded="false" id="stores-desktop" class="nav-link">
                {{ item.name }}
                <span class="ion-android-close ml-1 invisible"></span>
              </nuxt-link>-->
            </li>
          </ul>
          <a href="/" alt="Home" class="branding" @keyup.tab="expandDropdown('')">
            <img
              v-if="scrolled || showOpaque || !is_home"
              class="img-fluid logo-dark"
              src="//codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1539292470000/southland-mall-logo2-01-compressor.png"
              :alt="property.name"
            />
            <img v-else class="img-fluid logo-light" src="//codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1539292470000/southland-mall-logo2-01-compressor.png" alt="Beverly Center" />
          </a>
          <ul class="navbar-nav">
            <li
              role="button"
              aria-expanded="false"
              class="nav-item"
              :class="{'dropdown':item.sub_menu}"
              v-for="(item, index) in  menu2"
              :key="index"
            >
              <a class="nav-item" v-if="item.id == 'account'">
                <span v-if="item.img">
                  <img :src="item.img" :alt="item.alt" />
                </span>

                <span v-else class="nav-link">{{ item.name }}</span>
              </a>
              <nuxt-link :to="item.href" class="nav-item" v-else>
                <span v-if="item.img">
                  <img :src="item.img" :alt="item.alt" />
                </span>

                <span v-else class="nav-link">{{ item.name }}</span>
              </nuxt-link>
              <div class="dropdown-container visit-dropdown">
                <div
                  aria-labelledby="navbarVisitHoursMenu"
                  class="dropdown-menu"
                  v-if="item.id === 'account'"
                >
                  <span v-for="(sub_item, index) in item.sub_menu">
                    <!-- <a
                      v-if="sub_item.id == 'sign_out' && (isLoggedIn === sub_item.showIfLoggedIn)"
                      @click="logOut()"
                      class="dropdown-item"
                      :class="{'last_dd_item':index == item.sub_menu.length-1}"
                    >{{ sub_item.name}}</a>
                    <nuxt-link
                      v-else-if="isLoggedIn === sub_item.showIfLoggedIn"
                      :to="sub_item.href"
                      class="dropdown-item"
                      :class="{'last_dd_item':index == item.sub_menu.length-1}"
                      tabindex="-1"
                      @keydown.up.prevent="prevItem($event)"
                      @keydown.down.prevent="nextItem($event)"
                      @keydown.esc.prevent="expandDropdown('')"
                    > 
                      <span v-if="sub_item.icon" :class="sub_item.icon" aria-hidden="true"></span>
                      {{ sub_item.name}}
                    </nuxt-link>-->
                  </span>
                </div>
                <div
                  aria-labelledby="navbarVisitHoursMenu"
                  class="dropdown-menu"
                  :class="{'service' : item.id == 'concierge'}"
                  v-else
                >
                  <span v-for="(sub_item, index) in item.sub_menu">
                    <nuxt-link
                      v-if="sub_item.route_name"
                      :to="localePath({name: sub_item.route_name, query: {type : sub_item.params}})"
                      class="dropdown-item"
                      :class="{'last_dd_item':index == item.sub_menu.length-1}"
                      tabindex="-1"
                      @keydown.up.prevent="prevItem($event)"
                      @keydown.down.prevent="nextItem($event)"
                      @keydown.esc.prevent="expandDropdown('')"
                    >
                      <span v-if="sub_item.icon" :class="sub_item.icon" aria-hidden="true"></span>
                      {{ sub_item.name}}
                    </nuxt-link>
                    <a
                      v-else-if="sub_item.id === 'chat'"
                      @click.prevent="$root.openChatWindow"
                      @keydown.space.prevent="$root.openChatWindow"
                      class="dropdown-item"
                      :class="{'last_dd_item':index == item.sub_menu.length-1}"
                      href
                    >{{ sub_item.name}}</a>
                    <a
                      v-else-if="sub_item.href"
                      :href="sub_item.href"
                      class="dropdown-item"
                      :class="{'last_dd_item':index == item.sub_menu.length-1}"
                      tabindex="-1"
                      @keydown.up.prevent="prevItem($event)"
                      @keydown.down.prevent="nextItem($event)"
                      @keydown.esc.prevent="expandDropdown('')"
                    >
                      <span v-if="sub_item.icon" :class="sub_item.icon" aria-hidden="true"></span>
                      {{ sub_item.name}}
                    </a>
                    <a
                      v-else
                      class="dropdown-item"
                      :class="{'last_dd_item':index == item.sub_menu.length-1}"
                      href
                      tabindex="-1"
                      @keydown.up.prevent="prevItem($event)"
                      @keydown.down.prevent="nextItem($event)"
                      @keydown.esc.prevent="expandDropdown('')"
                    >
                      <span v-if="sub_item.icon" :class="sub_item.icon" aria-hidden="true"></span>
                      {{ sub_item.name}}
                    </a>
                    <hr v-if="index != item.sub_menu.length-1" />
                  </span>
                  <div
                    class="get-help bg-primary brand-primary-inverse"
                    v-if="item.id == 'concierge'"
                  >
                    <div class="h6">{{property.contact_phone}}</div>
                  </div>
                </div>
              </div>
            </li>
            <li class="nav-item search">
              <a
                :aria-expanded="showSearchWindow ? 'true': 'false'"
                aria-label="Toggle site search window"
                class="nav-link icon search-btn"
                @click="showSearchWindow = !showSearchWindow; showLeftNav = false; showOpaque = !showOpaque"
              >
                <span
                  v-bind:class="{'ion-close-round': showSearchWindow, 'ion-search': !showSearchWindow}"
                ></span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <!-- end header nav -->
      <!-- begin mobile header nav -->
      <div
        class="top-nav container-fluid d-md-none nav-collapse"
        id="mob-top-nav"
        v-cloak
        :class="{'navbar-opaque': showOpaque, 'home': $route.path === '/'}"
      >
        <nav class="navbar" aria-label="Header Navigation">
          <ul class="navbar-nav">
            <!-- -->
            <li class="nav-item" role="menu">
              <!-- v-bind:class="{ 'active': showLeftNav }" -->
              <a
                class="nav-link icon"
                href="/"
                v-on:click.prevent="onStoresClick('mobile')"
                :aria-expanded="showLeftNav ? 'true' : 'false'"
                aria-label="Toggle left navigation window"
                aria-controls="nav-left-container"
                @keydown.space.prevent="onStoresClick('mobile')"
                @keydown.down.prevent="focusOnStoresMenu('sign-in')"
                @keydown.esc.prevent="closeLeftNav('mobile')"
                @keydown.tab="closeLeftNav('search')"
                id="stores-mobile"
              >
                <span class="ion-navicon-round" :class="storeTabClass" v-if="!showLeftNav"></span>
                <span class="ion-close-round" v-if="showLeftNav"></span>
              </a>
            </li>
            <li class="nav-item" v-bind:class="{ 'active': showSearchWindow }">
              <a
                class="nav-link icon"
                @click="showSearchWindow = !showSearchWindow"
                :aria-expanded="showSearchWindow ? 'true': 'false'"
                aria-label="Toggle site search window"
                aria-controls="nav-right"
                id="search"
              >
                <span class="ion-ios-search-strong"></span>
              </a>
            </li>
          </ul>
          <a class="branding" href="/" alt="Home" :tabindex="showLeftNav ? '-1': '0'">
            <img class="img-fluid logo-light" src="/images/logo.png" :alt="property.name" />
            <img class="img-fluid logo-dark" src="/images/logo-black.png" :alt="property.name" />
          </a>
          <ul class="navbar-nav">
            <li class="nav-item">
              <nuxt-link
                class="nav-link icon"
                :to="localePath({name: 'stores-mall-map'})"
                aria-label="Map"
                :tabindex="showLeftNav ? '-1': '0'"
              >
                <span class="ion-android-map"></span>
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link
                class="nav-link icon"
                :to="localePath({name: 'visit-hours-mall-directions'})"
                aria-label="Search Site"
                :tabindex="showLeftNav ? '-1': '0'"
              >
                <span class="ion-ios-navigate"></span>
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
      <!-- end mobile header nav -->
      <!-- begin left nav -->
      <transition
        name="custom-classes-transition"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <nav-left
          nav-item="navLeftLocation"
          @close-left-nav="showLeftNav= false"
          v-if="showLeftNav"
        ></nav-left>
        <!-- @open-chat="openChat" -->
        <!--  -->
      </transition>
      <transition
        name="custom-classes-transition"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <right-search-component v-if="showSearchWindow"></right-search-component>
        <!--  -->
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'

export default {
  components: {
  },
  data: function data() {
    return {
      showOpaque: false,
      isScrolling: false,
      showLeftNav: false,
      showSearchWindow: false,
      isTransparent: false,
      storeTabClass: false,
      is_home: false,
      scrolled: false,
      isOpen: false,
      showMenu: false,
      mobileScroll: false,
      lastScrollTop: 0,
      navUp: false,
      navDown: true
    }
  },
  props: ['menu_items'],
  created() {
    this.$nextTick(function() {
      //Init
      this.getWindowWidth()
      if (this.$route.path === '/') {
        this.is_home = true
      } else {
        this.is_home = false
      }
    })
  },
  watch: {
    $route(to, from) {
      this.navUp = false
      if (this.$route.path === '/') {
        this.is_home = true
      } else {
        this.is_home = false
      }
      this.showSearchWindow = false
    },
    showLeftNav() {
      if (this.showLeftNav || this.showSearchWindow) {
        document.body.classList.add('no_scroll')
      } else if (!this.showLeftNav || !this.showSearchWindow) {
        document.body.classList.remove('no_scroll')
      }
    },
    showSearchWindow() {
      if (this.showLeftNav || this.showSearchWindow) {
        document.body.classList.add('no_scroll')
      } else if (!this.showLeftNav || !this.showSearchWindow) {
        document.body.classList.remove('no_scroll')
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function() {
      if (this.$route.path === '/') {
        this.is_home = true
      } else {
        this.is_home = false
      }
    })
  },
  computed: {
    ...mapGetters(['property']),
    menu1() {
      return _.slice(this.menu_items, 0, 4)
    },
    menu2() {
      return _.slice(this.menu_items, 4, this.menu_items.length)
    }
  },
  methods: {
    handleScroll() {
      this.scrolled = window.pageYOffset > 100
    },
    mobileDidScrolled() {
      if (this.isMobile) {
        this.mobileScroll = window.pageYOffset > 0
        var _this = this
        // setTimeout(function() {
        if (_this.mobileScroll) {
          _this.mobileHasScrolled()
          _this.mobileScroll = false
        }
        // }, 150);
      }
    },
    mobileHasScrolled() {
      // var lastScrollTop = 0;
      var delta = 5
      var navbarHeight = document.getElementsByClassName('navbar').offsetHeight
      var st = $(window).scrollTop()

      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > this.lastScrollTop && st > navbarHeight) {
        // Scroll Down
        this.navUp = true
      } else {
        // Scroll Up
        if (st + $(window).height() < $(document).height()) {
          this.navUp = false
        }
      }

      this.lastScrollTop = st
    },
    onStoresClick() {
      this.showLeftNav = !this.showLeftNav
      this.showSearchWindow = false
    }
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('scroll', this.mobileDidScrolled)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('scroll', this.mobileDidScrolled)
  }
}
</script>
