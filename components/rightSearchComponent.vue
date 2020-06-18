<template>
  <div>
    <!-- without an outer container div this component template will not render -->
    <div id="nav-right" class="nav-right" style>
      <div class="container p-3">
        <div class="right-search-content">
          <p v-if="storeSearchResultList.length > 0" class="h5 card-title">Stores</p>
          <ul
            role="navigation"
            id="search-results"
            class="list-unstyled pl-4"
            v-if="storeSearchResultList.length > 0"
          >
            <li v-for="result in storeSearchResultList" class="py-1" :key="result.id">
              <nuxt-link
                class="result_link hvr-icon-forward"
                :to="'/stores/'+result.slug"
              >{{result.name}}</nuxt-link>
            </li>
          </ul>
          <p v-if="promoSearchResultList.length > 0" class="h5 card-title">Sales & Offers</p>
          <ul
            role="navigation"
            id="search-results"
            class="list-unstyled pl-4"
            v-if="promoSearchResultList.length > 0"
          >
            <li v-for="result in promoSearchResultList" class="py-1" :key="result.id">
              <nuxt-link
                class="result_link hvr-icon-forward"
                :to="'/promotions/'+result.slug"
              >{{result.name}}</nuxt-link>
            </li>
          </ul>
          <p v-if="eventSearchResultList.length > 0" class="h5 card-title">Events</p>
          <ul
            role="navigation"
            id="search-results"
            class="list-unstyled pl-4"
            v-if="eventSearchResultList.length > 0"
          >
            <li v-for="result in eventSearchResultList" class="py-1" :key="result.id">
              <nuxt-link
                class="result_link hvr-icon-forward"
                :to="'/events/'+result.slug"
              >{{result.name}}</nuxt-link>
            </li>
          </ul>
          <!-- <p v-if="jobSearchResultList.length > 0" class="h5 card-title">Jobs</p>
          <ul
            role="navigation"
            id="search-results"
            class="list-unstyled pl-4"
            v-if="jobSearchResultList.length > 0"
          >
            <li
              v-for="result in searchResultList"
              class="py-1"
              :key="result.id"
              v-if="result.jobable_id"
            >
              <nuxt-link class="result_link hvr-icon-forward" :to="{ name: 'jobs'}">{{result.name}}</nuxt-link>
            </li>
          </ul>-->
        </div>
        <div class="input-group mb-3">
          <search-component
            :list="searchList"
            :placeholder="'Search ' + property.name"
            :suggestion-attribute="suggestionAttribute"
            :keys="keys"
            v-model="search_result"
            :autocomplete="true"
            :tokenize="true"
            :minMatchCharLength="3"
            class="text-left"
            @updatedResults="updateSearchResults"
          />
        </div>
        <!-- Categories -->
        <div class="container">
        <div class="category-list row" v-if="processedCategories">
          <div class="col-12">
            <div class="category-list-items p-0">
              <div v-for="category in processedCategories" class="category-item col-6 col-sm-4 col-md-3" :key="category.id">
                <div class="items" @click="emitSelectedCategory(category)">{{category.name}}</div>
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
import { mapGetters } from 'vuex'

export default {
  components: {
    SearchComponent: () => import('~/components/SearchComponent.vue')
  },
  data: function() {
    return {
      search_result: null,
      suggestionAttribute: 'name',
      keys: ['name', 'description', 'tags', 'store.name'],
      searchResultList: [],
      storeSearchResultList: [],
      promoSearchResultList: [],
      eventSearchResultList: []
      // jobSearchResultList: []
    }
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'processedStores',
      'processedEvents',
      'processedPromos',
      'processedCategories'
      // 'processedJobs'
    ]),
    searchList() {
      var events = this.processedEvents
      _.forEach(events, function(value, key) {
        if (_.includes(value.eventable_type, 'Property')) {
          value.is_store = false
        } else {
          value.is_store = true
        }
      })
      var promos = this.processedPromos
      _.forEach(promos, function(value, key) {
        if (_.includes(value.promotionable_type, 'Property')) {
          value.is_store = false
        } else {
          value.is_store = true
        }
      })
      var stores = this.processedStores
      _.forEach(stores, function(value, key) {
        value.is_store = true
      })

      // var list = _.union(stores, events, promos, jobs)
      var list = _.union(stores, events, promos)
      return list
    }
  },
  methods: {
    updateSearchResults(results) {
      this.searchResultList = results
      this.storeSearchResultList = _.filter(results, function(o) {
        return o.categories
      })
      this.promoSearchResultList = _.filter(results, function(o) {
        return o.promotionable_type
      })
      this.eventSearchResultList = _.filter(results, function(o) {
        return o.eventable_type
      })
      // this.jobSearchResultList = _.filter(results, function(o) {
      //   return o.jobable_type
      // })
    },
    emitSelectedCategory: function(event) {
      this.$router.push("/stores");
      this.$forceUpdate();
      this.$emit("selectedCategoryFromSearch", event);
    },
  }
}
</script>
