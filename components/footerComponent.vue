<template>
  <footer class="pt-5" id="footer" v-cloak>
    <div class="container">
      <nav aria-label="Copyright 2019 &copy; Taubman Centers. All Rights Reserved.">
        <div class="row">
          <div class="col-md-4 col-lg-3 col-xl-2">
            <div
              class="navbar navbar-expand-md p-0 mb-3 flex-column align-items-center align-items-md-start"
            >
              <h4>
                <span class="h4 text-uppercase m-0 d-none d-md-block">Explore</span>
              </h4>

              <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarExplore"
                aria-controls="navbarExplore"
                aria-expanded="false"
                aria-label="Toggle Explore Mall navigation"
              >
                <h4>
                  <span class="h4 text-uppercase m-0">
                    Explore
                    <span class="ion-chevron-down ml-2"></span>
                  </span>
                </h4>
              </button>
              <div class="collapse navbar-collapse" id="navbarExplore">
                <ul class="navbar-nav align-items-center flex-column align-items-md-start my-4">
                  <li class="nav-item">
                    <a class="nav-link px-md-0 py-md-1" href="/stores" target="_self">Explore Stores</a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link px-md-0 py-md-1" href="/dining" target="_self">Explore Dining</a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link px-md-0 py-md-1" href="/events" target="_self">Explore Events</a>
                  </li>

                  <li class="nav-item">
                    <a
                      class="nav-link px-md-0 py-md-1"
                      href="/sales-offers"
                      target="_self"
                    >Explore Deals</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-lg-3 col-xl-2">
            <div
              class="navbar navbar-expand-md p-0 mb-3 flex-column align-items-center align-items-md-start"
            >
              <h4>
                <a class="h4 text-uppercase m-0 d-none d-md-block" href="/visit-hours">Hours & Map</a>
              </h4>

              <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarVisit"
                aria-controls="navbarVisit"
                aria-expanded="false"
                aria-label="Toggle Hours & Map navigation"
              >
                <h4>
                  <span class="h4 text-uppercase m-0">
                    Hours & Map
                    <span class="ion-chevron-down ml-2"></span>
                  </span>
                </h4>
              </button>
              <div class="collapse navbar-collapse" id="navbarVisit">
                <ul class="navbar-nav align-items-center flex-column align-items-md-start my-4">
                  <li class="nav-item">
                    <nuxt-link
                      class="nav-link px-md-0 py-md-1"
                      :to="localePath({name: 'visit-hours-mall-hours'})"
                      target="_self"
                    >Hours</nuxt-link>
                  </li>

                  <li class="nav-item">
                    <nuxt-link
                      class="nav-link px-md-0 py-md-1"
                      :to="localePath({name: 'visit-hours-mall-directions'})"
                      target="_self"
                    >Directions</nuxt-link>
                  </li>

                  <li class="nav-item">
                    <nuxt-link
                      class="nav-link px-md-0 py-md-1"
                      :to="localePath({name: 'stores-mall-map'})"
                      target="_self"
                    >Map</nuxt-link>
                  </li>

                  <li class="nav-item">
                    <nuxt-link
                      class="nav-link px-md-0 py-md-1"
                      :to="localePath({name: 'visit-hours-hotels'})"
                      target="_self"
                    >Hotels</nuxt-link>
                  </li>

                  <li class="nav-item">
                    <nuxt-link
                      class="nav-link px-md-0 py-md-1"
                      :to="localePath({name: 'visit-hours-mall-parking'})"
                      target="_self"
                    >Parking</nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-lg-3 col-xl-2">
            <div
              class="navbar navbar-expand-md p-0 mb-3 flex-column align-items-center align-items-md-start"
            >
              <h4>
                <a class="h4 text-uppercase m-0 d-none d-md-block" href="/contact-us">Concierge</a>
              </h4>

              <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarCustomerService"
                aria-controls="navbarCustomerService"
                aria-expanded="false"
                aria-label="Toggle Concierge navigation"
              >
                <h4>
                  <span class="h4 text-uppercase m-0">
                    Concierge
                    <span class="ion-chevron-down ml-2"></span>
                  </span>
                </h4>
              </button>
              <div class="collapse navbar-collapse" id="navbarCustomerService">
                <ul class="navbar-nav align-items-center flex-column align-items-md-start my-4">
                  <li class="nav-item">
                    <a
                      class="nav-link px-md-0 py-md-1"
                      @click.prevent="$root.openChatWindow"
                      @keydown.space.prevent="$root.openChatWindow"
                    >Chat Live</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link px-md-0 py-md-1" href="/contact-us" target="_self">Contact Us</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link px-md-0 py-md-1" href="/contact-us" target="_self">FAQ</a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link px-md-0 py-md-1"
                      href="mailto:BeverlyCenter@Taubman.com"
                      target="_self"
                    >Feedback</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="col-md-4 col-lg-3 col-xl-2">
            <div
              class="navbar navbar-expand-md p-0 mb-3 flex-column align-items-center align-items-md-start"
            >
              <h4>
                <a class="h4 text-uppercase m-0 d-none d-md-block" href="/our-partners">Our Partners</a>
              </h4>

              <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarPartners"
                aria-controls="navbarPartners"
                aria-expanded="false"
                aria-label="Toggle Our Partners navigation"
              >
                <h4>
                  <span class="h4 text-uppercase m-0">
                    Our Partners
                    <span class="ion-chevron-down ml-2"></span>
                  </span>
                </h4>
              </button>
              <div class="collapse navbar-collapse" id="navbarPartners">
                <ul class="navbar-nav align-items-center flex-column align-items-md-start my-4">
                  <li class="nav-item d-lg-none">
                    <a
                      class="nav-link px-md-0 py-md-1"
                      href="/our-partners"
                      target="_self"
                    >All Partners</a>
                  </li>

                  <li class="nav-item">
                    <a
                      class="nav-link px-md-0 py-md-1"
                      href="http://www.cedars-sinai.edu"
                      target="_blank"
                    >Cedars-Sinai</a>
                  </li>

                  <li class="nav-item">
                    <a
                      class="nav-link px-md-0 py-md-1"
                      href="http://pepsi.com"
                      target="_blank"
                    >Pepsi</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-lg-3 col-xl-2">
            <div
              class="navbar navbar-expand-md p-0 mb-3 flex-column align-items-center align-items-md-start"
            >
              <h4>
                <span class="h4 text-uppercase m-0 d-none d-md-block">Get The App</span>
              </h4>
              <button
                type="button"
                data-toggle="collapse"
                data-target="#navbarGetTheApp"
                aria-controls="navbarGetTheApp"
                aria-expanded="false"
                aria-label="Toggle Get The App navigation"
                class="navbar-toggler"
              >
                <h4>
                  <span class="h4 text-uppercase m-0">
                    Get The App
                    <span class="ion-chevron-down ml-2"></span>
                  </span>
                </h4>
              </button>
              <div id="navbarGetTheApp" class="collapse navbar-collapse">
                <ul class="navbar-nav align-items-center flex-column align-items-md-start my-4">
                  <li class="nav-item">
                    <a
                      href="https://apps.apple.com/us/app/beverly-center/id1206738635"
                      target="_blank"
                      class="nav-link px-md-0 py-md-1"
                    >iOS</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-4 col-lg-3 col-xl-2 p-0">
            <div
              class="navbar navbar-expand-md p-md-0 mb-3 flex-column align-items-center align-items-md-start"
            >
              <span class="h4 text-uppercase m-0 d-none d-md-block">Newsletter Sign Up</span>
              <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNewsletter"
                aria-controls="navbarNewsletter"
                aria-expanded="false"
                aria-label="Toggle Newsletter Sign Up"
              >
                <span class="h4 text-uppercase m-0">
                  Newsletter Sign Up
                  <span class="ion-chevron-down ml-2"></span>
                </span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNewsletter">
                <ul class="navbar-nav align-items-center flex-column align-items-md-start my-4">
                  <li
                    class="mb-3"
                  >Be the first to hear about new discounts, events, products, and services.</li>
                  <li>
                    <nuxt-link
                      class="btn btn-block btn-primary text-uppercase form-group"
                      to="/subscribe"
                    >Subscribe</nuxt-link>
                  </li>
                  <li>
                    <p class="mb-2 small">
                      See
                      <nuxt-link class="link-u text-white" to="/pages/privacy-policy">Privacy Policy</nuxt-link>
                      <span>for info use details.</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <hr />
      <div class="footer_subtext">
        <div class="text-center mb-2 footer_logo_container">
          <img class="img-fluid logo-light" src="/images/logo.png" alt="Beverly Center" />
          <img class="img-fluid logo-dark" src="/images/logo-black.png" alt="Beverly Center" />
        </div>
        <div class="order-1">
          <social-links type="footer"></social-links>
        </div>
        <div class>
          <hr class="d-lg-none" />
          <ul
            class="bottom-nav list-unstyled d-flex flex-row flex-wrap justify-content-around justify-content-lg-between mb-md-1"
          >
            <nuxt-link
              v-for="(item, index) in  footer_sub_menu"
              :key="index"
              :to="item.href"
              tag="li"
            >
              <a class="nav-link px-md-0 py-md-1">{{ item.name }}</a>
            </nuxt-link>
          </ul>
          <div class="copyright text-center">
            Copyright &copy; {{copyright_year}} Taubman Centers. All Rights Reserved | Powered by
            <a
              href="https://www.mallmaverick.com/"
              target="_blank"
            >Mall Maverick</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'

export default {
  data: function data() {
    return {}
  },
  props: ['menu_items', 'footer_sub_menu'],
  components: {
    //SocialLinks: () => import('~/components/propertySocialLinks.vue')
  },
  computed: {
    ...mapGetters(['route', 'property', 'timezone', 'getPropertyHours']),
    exploreMenu() {
      var menu_items = this.menu_items
      return _.slice(menu_items, 0, 4)
    },
    hoursMenu() {
      var menu_items = this.menu_items
      var sub_menu = []
      _.forEach(menu_items, function(value, key) {
        if (_.includes(value.id, 'hours')) {
          var sub_menu_items = value.sub_menu
          _.forEach(sub_menu_items, function(value, key) {
            sub_menu.push(value)
          })
        }
      })
      if (sub_menu) {
        return sub_menu
      }
    },
    conciergeMenu() {
      var menu_items = this.menu_items
      var sub_menu = []
      _.forEach(menu_items, function(value, key) {
        if (_.includes(value.id, 'concierge')) {
          var sub_menu_items = value.sub_menu
          _.forEach(sub_menu_items, function(value, key) {
            sub_menu.push(value)
          })
        }
      })
      if (sub_menu) {
        return sub_menu
      }
    },
    getHours() {
      return _.filter(this.getPropertyHours, function(o) {
        return o.day_of_week == 1
      })
    },
    copyright_year() {
      return moment().year()
    }
  }
}
</script>
