<template>
  <div>
    <header
      class="half-banner d-flex flex-column justify-content-center align-items-center"
      :style="{ backgroundImage: 'url(' + pageBanner.image_url  + ')' }"
    >
      <div class="header-content">
        <div class="inner">
          <h1 class="display-4"></h1>
        </div>
      </div>
    </header>
    <section class="directory-section stores-section">
      <div id="directory">
        <div class="directory-header sticky-top">
          <div class="row no-gutters bg-alt directory-search" :class="{'not-active': isMobile}">
            <div class="col-md-6">
              <div class="input-group">
                <search-component
                  :list="allStores"
                  placeholder="Store Name"
                  suggestion-attribute="name"
                  v-model="search_result"
                  @select="onOptionSelect"
                  :keys="['name']"
                  :tokenize="true"
                  class="inline_block"
                >
                  <template slot="item" scope="option" class="manual">
                    <article class="media">
                      <p>
                        <strong>{{ option.data.name }}</strong>
                      </p>
                    </article>
                  </template>
                </search-component>
              </div>
            </div>
            <div class="col-md-6 search-right" :class="{'menu-active': !isMobile}">
              <button
                class="btn btn-list d-none d-md-block mr-3 btn-outline-light"
                type="button"
                @click="goToStores()"
              >Store List</button>
              <button
                class="btn btn-map d-none d-md-block btn-light"
                type="button"
                @click="onToggleMapView(true)"
              >Map</button>
            </div>
          </div>
        </div>

        <div class="results-content results-with-map">
          <!-- Mall Map-->
          <div class="results-map">
            <div class="map-view d-flex" ref="mallMap">
              <div class="map m-auto">
                <mapplic-map
                  class
                  ref="svgmap_ref"
                  :height="700"
                  :minimap="false"
                  :deeplinking="false"
                  :sidebar="false"
                  :hovertip="true"
                  :maxscale="5"
                  :storelist="allStores"
                  :mapData="mapData"
                  :mousewheel="false"
                  tooltiplabel="Store Info"
                  @updateMap="updateSVGMap"
                ></mapplic-map>
              </div>
            </div>
          </div>
          <transition name="mapToggle">
            <button
              class="btn bg-alt btn-mapview d-md-none animated btn-list"
              type="button"
              v-show="isMobile"
              @click="goToStores()"
            >List View</button>
          </transition>
        </div>
      </div>
    </section>

    <footer-ads></footer-ads>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'
import helpers from 'assets/javascripts/helpers'

export default {
  head() {
    return this.currentSEO
  },
  components: {
    /* SearchComponent: () => import('~/components/SearchComponent.vue'),
    MapplicMap: () => import('~/components/Mapplic.vue'),
    FooterAds: () => import('~/components/footerAds.vue') */
  },
  data: function() {
    return {
      tempSEO: {},
      currentSEO: {},
      search_result: null,
      selectedStore: null,

      mapData: null
    }
  },
  async asyncData({ store, params, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('getMMData', { resource: 'stores' }),
        store.dispatch('LOAD_PAGE_DATA', {
          url: process.env.MM_API_URL + 'mapplic?api_key=' + process.env.API_KEY
        }),
        store.dispatch('LOAD_SEO', { url: route.fullPath })
      ])
      return { mapData: results[1].data, tempSEO: results[2].data }
    } catch (e) {
      console.log(e.message)
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function() {
      if (!_.isEmpty(this.tempSEO)) {
        this.currentSEO = this.localeSEO(this.tempSEO)
      }
    })
    next()
  },
  created() {
    if (!_.isEmpty(this.tempSEO)) {
      this.currentSEO = this.localeSEO(this.tempSEO)
    }
  },
  mounted() {
    // if params store_id is passed, set selectedStore
    var store_id = _.toNumber(this.$route.query.store_id)
    if (store_id) {
      this.selectedStore = _.find(this.allStores, function(o) {
        return o.id == store_id
      })
    }
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'findBannerByName',
      'processedStores'
    ]),
    allStores() {
      var stores = this.processedStores
      stores = _.orderBy(stores, function(o) {
        return _.lowerCase(o.name)
      })
      return stores
    },
    pageBanner() {
      var pageBanner = null
      var temp_repo = this.findBannerByName('Shopping Banner')
      if (
        temp_repo &&
        temp_repo.gallery_items &&
        temp_repo.gallery_items.length > 0
      ) {
        pageBanner = temp_repo.gallery_items[0]
      } else if (this.propertyBanner) {
        pageBanner = this.propertyBanner
      } else {
        pageBanner = {}
        pageBanner.image_url = ''
      }
      return pageBanner
    },
    svgMapRef() {
      return this.$refs.svgmap_ref
    }
  },
  methods: {
    centerView() {
      helpers.scrollToAnchor('#directory', false, 0)
    },
    onOptionSelect(option) {
      this.dropPin(option)
      this.$nextTick(function() {
        this.search_result = ''
      })
    },
    updateSVGMap(map) {
      if (this.selectedStore) {
        this.centerView()
        setTimeout(
          () => {
            this.dropPin(this.selectedStore)
          },
          1000,
          this
        )
      }
    },
    dropPin(store) {
      var map_id = null
      // Find store data from mapplic
      _.forEach(this.mapData.levels, function(o) {
        map_id = _.find(o.locations, function(location) {
          return location.store_id == store.id
        })
        if (map_id) return false
      })
      if (map_id) this.svgMapRef.showLocation(map_id.id)
    },
    goToStores() {
      this.$router.push('/stores')
    }
  }
}
</script>
