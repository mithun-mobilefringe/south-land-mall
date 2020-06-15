<template>
  <div>
    <category-menu-component
      categoryType="storeDetails"
      :showMap="false"
    ></category-menu-component>
    <div class="container">
      <div class="row">
        <div class="col-3 store-dropdown">
          <v-select
                :options="allStores"
                label="name"
                :searchable="false"
                @change="dropPin($event)"
                v-model="selectedStore"
                id="mobile_alpha_list"
                :placeholder="$t('stores_page.select_a_store')"
              ></v-select>
        </div>
      </div>
      <div id="directory" class="row">

        <div class="col-12 map-container">
          <!-- Mall Map-->
            <div class="map-view d-flex" ref="mallMap">
              
                <mapplic-map
                  class
                  ref="svgmap_ref"
                  :height="720"
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
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'
import helpers from 'assets/javascripts/helpers'
import vSelect from 'vue-select'

export default {
  head() {
    return this.currentSEO
  },
  components: {
    categoryMenuComponent: () =>
      import("~/components/categoryMenuComponent.vue"),
    SearchComponent: () => import('~/components/SearchComponent.vue'),
    MapplicMap: () => import('~/components/Mapplic.vue'),
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
  watch:{
    selectedStore : function(val) {
      if(val != null){
        this.dropPin(val);
      }
    },
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
<style scoped>
.map-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.store-dropdown {
  position: absolute;
  z-index: 10;
  padding-top: 2.5rem;
  width: 20rem;
  text-transform: uppercase;
}
.store-dropdown input[type="search"]{
  height: 3rem !important;
  font-size: 1.5rem !important;

}
</style>