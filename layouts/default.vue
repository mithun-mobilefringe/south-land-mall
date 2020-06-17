<template>
  <div id="head_section">
    <div style="background: #EEEEF0 0% 0% no-repeat padding-box;">
      <div style="background: #FFFFFF 0% 0% no-repeat padding-box;" role="complementary">
        <h1 class="accessibility">{{ property.name }}</h1>
      <header-component :is-transparent="true" :menu_items="menu_items" />
      </div>
      <div class="main_content_container" role="main">
        <h1 class="accessibility">{{ property.name }}</h1>
        <nuxt class="router_content" />
      </div>
      <div role="contentinfo">
      <footer-component menu_items="menu_items" :footer_sub_menu="footer_sub_menu" />
      </div>
    </div>
    <!-- <cookie-consent
      :cookieExpiryDays="7"
      message="We use cookies to ensure you get the best experience on our website. By using our website, you agree to our use of cookies for the purposes listed in our "
      linkLabel="Privacy Policy."
      href="/pages/privacy-policy"
      cookieDomain="beverlycenter.com"
    /> -->
  </div>
</template>
<style>
/* cookie consent styling */
.cookie-consent section {
  padding: 0;
}
.cookie-consent-link {
  text-decoration: underline;
  font-weight: bold;
}
.cookie-consent-compliance {
  background-color: #000;
  border: none;
  text-transform: uppercase;
}
</style>

<script>
import { mapGetters } from 'vuex'
import Stickyfill from 'stickyfilljs'

import '~/node_modules/vue-cookieconsent-component/src/scss/_cookie-consent.scss'
import '~/node_modules/vue-cookieconsent-component/src/scss/_cookie-consent-bottom.scss'
import '~/node_modules/vue-cookieconsent-component/src/scss/_cookie-consent-transition.scss'
import '~/node_modules/vue-cookieconsent-component/src/scss/_cookie-consent-variables.scss'

export default {
  transition: 'page',
  data() {
    return {
      menu_items: [
        {
          name: 'Stores',
          id: 'stores',
          footer_name: 'Explore Stores',
          href: '/stores'
        },
        {
          name: 'Events',
          id: 'events',
          footer_name: 'Explore Events',
          href: '/events'
        },
        {
          name: 'Dining',
          id: 'dine',
          footer_name: 'Explore Dining',
          href: '/dining'
        },
        {
          name: 'Sales & Offers',
          id: 'promos',
          footer_name: 'Explore Deals',
          href: '/sales-offers'
        },
        {
          name: 'Hours & Map',
          id: 'hours',
          href: '/visit-hours',
          sub_menu: [
            {
              name: 'Mall Map',
              route_name: 'stores-mall-map',
              icon: 'icon ion-android-map'
            },
            {
              name: 'Hours',
              route_name: 'visit-hours-mall-hours',
              icon: 'icon ion-ios-time-outline'
            },
            {
              name: 'Directions',
              href: '/visit-hours/mall-directions',
              icon: 'icon ion-ios-navigate'
            },
            {
              name: 'Parking',
              href: '/visit-hours/mall-parking',
              icon: 'icon ion-android-car'
            },
            {
              name: 'Hotels',
              href: '/visit-hours/hotels',
              icon: 'icon ion-ios-moon'
            }
          ]
        },
        {
          name: 'Concierge',
          id: 'concierge',
          href: '/contact-us',
          sub_menu: [
            {
              name: 'Chat Live',
              href: '/',
              id: 'chat'
            },
            {
              name: 'Contact Us',
              href: '/contact-us',
              id: 'contact_us'
            },
            {
              name: 'Jobs',
              href: '/work-for-beverlycenter',
              id: 'jobs'
            },
            {
              name: 'FAQ',
              href: '/contact-us#FAQ',
              route_name: 'contact-us',
              params: 'faq'
            }
          ]
        },
        {
          name: 'My Account',
          id: 'account',
          href: '/account',
          sub_menu: [
            {
              name: 'Sign In',
              href: '/log-in',
              id: 'sign_in',
              showIfLoggedIn: false
            },
            {
              name: 'Register',
              href: '/register',
              id: 'register',
              showIfLoggedIn: false
            },
            {
              name: 'Your Account',
              href: '/account',
              id: 'account',
              showIfLoggedIn: true
            },
            {
              name: 'Your Favorites',
              href: '/account',
              id: 'your_favorites',
              icon: 'icon ion-ios-star',
              showIfLoggedIn: true
            },
            {
              name: 'Sign Out',
              id: 'sign_out',
              showIfLoggedIn: true
            }
          ]
        }
      ],
      footer_sub_menu: [
        {
          name: 'Jobs',
          href: '/work-for-beverlycenter'
        },
        {
          name: 'Advertise',
          href: '/advertising'
        },
        {
          name: 'Media',
          href: '/media'
        },
        {
          name: 'About Our Ads',
          href: '/pages/about-our-ads'
        },
        {
          name: 'Terms of Service',
          href: '/pages/terms-of-service'
        },
        {
          name: 'Leasing Information',
          href: '/leasing'
        },
        {
          name: 'Privacy Policy',
          href: '/pages/privacy-policy'
        }
      ]
    }
  },

  created() {
    // Login/Register
    // gapi.load('auth2', function() {})
    this.$store.dispatch('selectProperty', this.property)
  },
  computed: {
    ...mapGetters(['property'])
  },
  watch: {
    /* $route() {
      this.updateUserRoutes()
      // this.load()
    },
    isLoggedIn() {
      if (!this.isLoggedIn) {
        this.updateUserRoutes()
      }
    } */
  },
  components: {
    headerComponent: () => import('~/components/headerComponent.vue'),
    footerComponent: () => import('~/components/footerComponent.vue'),
    chatWindow: () => import('~/components/chatWindow.vue'),
    SmartAppBanner: () => import('~/components/smartAppBanner.vue'),
    AlertBanner: () => import('~/components/alertBanner.vue')
  },
  mounted: () => {
    // apply polyfill for CSS position: sticky
    const elements = $('.sticky-top')
    Stickyfill.add(elements)
  },
  methods: {
    // Expose hook to call from outside vue app when google maps api is loaded.
    googleMapAPIReady: () => {
      this.$emit('MapsApiLoaded')
    },
    // Expose hook to call from outside vue app when google api is loaded.
    googleAPIReady: () => {
      this.$emit('GoogleApiLoaded')
    }
  }
}
</script>
