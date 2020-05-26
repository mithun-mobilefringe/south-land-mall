<template>
  <div>
    <transition name="smart-banner">
      <div class="fixed-top smart-app-banner animated" v-if="appStoreUrl" v-cloak>
        <button
          class="close btn-close"
          type="button"
          @click="close"
          aria-label="Close 'Download our app' banner"
        ></button>
        <a :href="appStoreUrl" target="_blank" rel="noopener">
          <img src="/images/mobile-app-banner.jpg" alt="Download our app" />
        </a>
      </div>
    </transition>
  </div>
</template>
<script>
import helpers from 'assets/javascripts/helpers'
export default {
  props: ['android', 'ios'],
  data() {
    return {
      appStoreUrl: null
    }
  },
  created() {
    setTimeout(() => {
      if (!sessionStorage.getItem('smart-app-banner')) {
        const mobileOS = helpers.getMobileOS()

        // ad should only show on mobile
        if (helpers.isBreakpoint('sm')) {
          if (this.android && mobileOS === 'Android')
            this.appStoreUrl = `https://play.google.com/store/apps/details?id=${
              this.android
            }`
          else if (this.ios && mobileOS === 'iOS')
            this.appStoreUrl = `https://itunes.apple.com/us/app/apple-store/id${
              this.ios
            }`

          if (this.appStoreUrl)
            sessionStorage.setItem('smart-app-banner', 'true') // mark as shown
        }
      }
    }, 2000)
  },
  methods: {
    close() {
      this.appStoreUrl = ''
    }
  }
}
</script>
