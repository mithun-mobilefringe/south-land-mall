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
          <div
            class="row no-gutters bg-alt directory-search"
            :class="{'not-active': showMobileMenu}"
          >
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
            <div class="col-md-6 search-right" :class="{'menu-active': showMobileMenu}">
              <!-- desktop buttons-->
              <button class="btn btn-list d-none d-md-block mr-3 btn-light" type="button">Store List</button>
              <button
                class="btn btn-map d-none d-md-block btn-outline-light"
                type="button"
                @click="goToMap()"
              >Map</button>
              <!-- mobile buttons-->
              <button
                class="btn btn-block btn-menu d-md-none"
                type="button"
                @click="onToggleCategories"
                :class="{'btn-up-arrow': showMobileMenu, 'btn-down-arrow': !showMobileMenu }"
                v-if="selectedCategory"
              >{{ selectedCategory.name.length > 0 ? selectedCategory.name : 'All Categories' }}</button>
            </div>
          </div>
          <!-- desktop tabs nav-->
          <div class="tabs-nav-container d-none d-md-block" id="desktop-nav-1">
            <nav class="tabs-nav" aria-label="Stores Category Navigation">
              <slick
                class="nav"
                id="cat-slide-nav"
                ref="slick"
                role="toolbar"
                :options="catCarousel"
              >
                <a
                  v-for="item in categories"
                  class="nav-link"
                  href="#"
                  @click="scrollToSticky()"
                  @click.prevent="onCategorySelected(item); getCategoryUrl(item);"
                  :class="{'active' : item.id === selectedCategory.id }"
                  role="button"
                  :aria-pressed="item.id === selectedCategory.id ? true : false"
                >{{ item.name }}</a>
              </slick>
            </nav>
          </div>
          <!-- desktop subtabs nav-->
          <div
            class="tabs-nav-container d-none d-md-block"
            id="desktop-nav-2"
            v-show="showSubCategoriesMenu"
          >
            <nav class="tabs-nav subtabs-nav" id="subcat-slide-nav">
              <slick ref="slick2" role="toolbar" :options="catCarousel">
                <a
                  v-for="subCat in subCategories"
                  :key="subCat.id"
                  href="#"
                  class="nav-link"
                  @click.prevent="onSubCategorySelected(subCat)"
                  :class="{'active' : subCat.id === selectedSubCategory.id }"
                  role="button"
                  :aria-pressed="subCat.id === selectedSubCategory.id ? true : false"
                >{{ subCat.short_name }}</a>
              </slick>
            </nav>
          </div>
        </div>

        <!-- mobile tabs nav-->
        <div
          class="tabs-nav-container mobile-menu d-md-none"
          v-show="showCategoriesMenu && !showSubCategoriesMenu"
        >
          <div class="list-group nav-list-group" role="menu" aria-label="Store Categories">
            <button
              class="list-group-item list-group-item-action align-items-center d-flex btn-right-arrow"
              type="button"
              v-for="item in categories"
              :key="item.id"
              @click="onCategorySelected(item)"
              :class="{'active' : item.id === selectedCategory.id }"
              :aria-label="item.name"
              role="menuitem"
              tabindex="-1"
            >{{ item.name }}</button>
          </div>
        </div>
        <!-- mobile subtabs nav-->
        <div
          class="tabs-nav-container mobile-menu d-md-none"
          v-show="!showCategoriesMenu && showSubCategoriesMenu"
        >
          <div class="list-group nav-list-group" role="menu" aria-label="Store Subcategories">
            <button
              class="list-group-item list-group-item-action btn-left-arrow btn-back"
              type="button"
              @click="showSubCategoriesMenu = false; showCategoriesMenu = true"
              aria-label="Return to categories"
            >Categories</button>

            <button
              class="list-group-item list-group-item-action align-items-center d-flex btn-right-arrow"
              v-for="item in subCategories"
              :key="item.id"
              type="button"
              @click="onSubCategorySelected(item)"
              :class="{'active' : item.id === selectedSubCategory.id }"
              :aria-label="item.name"
              role="menuitem"
              tabindex="-1"
            >{{ item.name }}</button>
          </div>
        </div>
        <div class="results-content results-with-map">
          <div class="list-view">
            <!-- desktop table columns-->
            <ul class="list-group d-none d-md-block">
              <li class="list-group-item results-list-header p-4">
                <div class="row no-gutters align-items-center small text-uppercase">
                  <div class="col-1 mx-4"></div>
                  <div class="col-2 mx-4"></div>
                  <div class="col">Phone Number</div>
                  <div class="col" v-if="property.meta_data_object.show_store_hours">Today's Hours</div>
                  <div class="col">Store Location</div>
                  <div class="col text-center">Map</div>
                  <div class="col text-center">Favorite</div>
                </div>
              </li>
            </ul>
            <!-- desktop results-->
            <div class="results-list d-none d-md-block">
              <ul class="list-group">
                <li class="list-group-item" v-for="store in filteredStores">
                  <div class="row no-gutters align-items-center">
                    <div class="col-1 mx-4">
                      <img
                        v-if="!store.no_store_logo"
                        class="img-fluid"
                        :src="store.logo_image_url"
                        alt
                      />
                      <p v-else>{{store.name}}</p>
                      <!-- </a> -->
                    </div>
                    <div class="col-2 mx-4 font-weight-bold">
                      <div>
                        <nuxt-link :to="'/stores/' + store.slug" class="link-dark">{{ store.name }}</nuxt-link>
                      </div>
                      <div v-if="store.flag">
                        <span
                          class="listing-flag"
                          :class="store.flag.type"
                        >{{ store.flag.text }}</span>
                      </div>
                    </div>
                    <div class="col">{{ store.phone }}</div>
                    <div class="col" v-if="property.meta_data_object.show_store_hours">
                      <span v-if="store.todaysHours">
                        <span v-if="store.todaysHours.is_closed">Closed</span>
                        <span
                          v-else
                        >{{ store.todaysHours.open_time.utc | moment("h:mm A", timezone) }} - {{ store.todaysHours.close_time.utc | moment("h:mm A", timezone) }}</span>
                      </span>
                    </div>
                    <div class="col">
                      <span v-if="store.location_information" v-html="store.location_information"></span>
                    </div>
                    <div class="col text-center">
                      <a class="btn-link" href="#" @click.prevent="onViewOnMap(store)">View On Map</a>
                    </div>
                    <div class="col text-center">
                      <button
                        class="btn-link btn-favorite"
                        type="button"
                        :aria-label="store.addToFavorites"
                        @click="$refs.favoriteRegisterModal.toggleFavorite($event,store)"
                        :class="{'active' : isFavourited('store', store)}"
                      ></button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- mobile results-->
            <div class="results-list d-md-none" v-show="!showMobileMenu">
              <ul class="list-group">
                <li class="list-group-item" v-for="store in filteredStores">
                  <div class="row">
                    <a
                      class="col-4 align-self-center"
                      :href="'/stores/' + store.slug"
                      :alt="store.name"
                    >
                      <img
                        v-if="!store.no_store_logo"
                        class="img-fluid"
                        :src="store.logo_image_url"
                        alt
                      />
                      <p v-else>{{store.name}}</p>
                    </a>
                    <a class="col-6 link-dark" :href="'/stores/' + store.slug">
                      <h5 class="font-weight-bold">{{ store.name }}</h5>
                      <p v-if="store.todaysHours && property.meta_data_object.show_store_hours">
                        <span v-if="store.todaysHours.is_closed">Closed</span>
                        <span
                          v-else
                        >{{ store.todaysHours.open_time.utc | moment("h:mm A", timezone) }} - {{ store.todaysHours.close_time.utc | moment("h:mm A", timezone) }}</span>
                      </p>
                      <p>{{ store.phone }}</p>
                      <span
                        class="listing-flag"
                        v-if="store.flag"
                        :class="store.flag.type"
                      >{{ store.flag.text }}</span>
                    </a>
                    <div class="col-2 text-right">
                      <button
                        class="btn-link btn-favorite"
                        type="button"
                        :aria-label="store.addToFavorites"
                        @click="$refs.favoriteRegisterModal.toggleFavorite($event,store)"
                        :class="{'active' : isFavourited('store', store)}"
                      ></button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <transition name="mapToggle">
            <button
              class="btn bg-alt btn-mapview d-md-none animated btn-map"
              type="button"
              v-show="!showMobileMenu"
              @click="goToMap()"
            >Map View</button>
          </transition>
        </div>

        <taub-favorite-register-modal ref="favoriteRegisterModal" type="store" item_type="store"></taub-favorite-register-modal>
      </div>
    </section>

    <footer-ads></footer-ads>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'
import '~/node_modules/slick-carousel/slick/slick.css'
import '~/node_modules/slick-carousel/slick/slick-theme.scss'
import helpers from 'assets/javascripts/helpers'

export default {
  head() {
    return this.currentSEO
  },
  components: {
    /* Slick: () => import('vue-slick'),
    SearchComponent: () => import('~/components/SearchComponent.vue'),
    FooterAds: () => import('~/components/footerAds.vue'),
    TaubFavoriteRegisterModal: () =>
      import('~/components/favouriteRegisterModal.vue') */
  },
  data: function() {
    return {
      tempSEO: {},
      currentSEO: {},
      showMobileMenu: false,
      showCategoriesMenu: false,
      showSubCategoriesMenu: false,
      search_result: null,
      selectedCategory: {
        name: 'All Categories',
        id: 0
      },
      selectedSubCategory: {
        short_name: 'All ',
        name: 'All ',
        id: 0
      },
      filteredStores: [],
      catCarousel: {
        arrows: true,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 300,
        variableWidth: true
      }
    }
  },
  async asyncData({ store, params, route }) {
    try {
      let results = await Promise.all([
        store.dispatch('getMMData', { resource: 'stores' }),
        store.dispatch('LOAD_PAGE_DATA', {
          url:
            process.env.MM_API_URL +
            'store_hours?api_key=' +
            process.env.API_KEY
        }),
        store.dispatch('LOAD_SEO', { url: '/stores' })
      ])
      return { allHours: results[1].data, tempSEO: results[2].data }
    } catch (e) {
      console.log(e.message)
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function() {
      this.updatePageContent()
    })
    next()
  },
  created() {
    if (!_.isEmpty(this.tempSEO)) {
      this.currentSEO = this.localeSEO(this.tempSEO)
    }
  },
  mounted() {
    this.updatePageContent()
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'findBannerByName',
      'processedStores',
      'processedCategories',
      'processedSubcategories',
      'findHourById',
      'findCategoryById',
      'findSubcategoryById',
      'getPropertyHours'
    ]),
    allStores() {
      var stores = this.processedStores
      stores = _.orderBy(stores, function(o) {
        return _.lowerCase(o.name)
      })
      var vm = this
      _.forEach(stores, function(store, key) {
        if (_.includes(store.logo_image_url, 'missing')) {
          store.no_store_logo = true
        } else {
          store.no_store_logo = false
        }

        // Store Hours
        if (vm.allHours) {
          // Check to see that store has it's own hours and if hours+storehours is loaded
          if (!store.sync_with_centre_hours && vm.allHours.store_hours) {
            // Find the store's hours with store id
            var store_hour = _.find(vm.allHours.store_hours, function(o) {
              return o.id == store.id
            })
            if (store_hour) {
              // Assign stores's hours to variable
              store_hour = store_hour.store_hours
              var todays_hour = store_hour.todays_hours
              // check if open time and close time are present
              if ((todays_hour.open_time && todays_hour.close_time) || todays_hour.is_closed) {
                vm.$set(store, 'todaysHours', todays_hour)
              }
            }
          } else if (store.sync_with_centre_hours) {
            var property_hour = vm.allHours.property_hours.todays_hours
            vm.$set(store, 'todaysHours', property_hour)
          }
        }

        // add flag
        if (store.is_new_store) {
          store.flag = {}
          store.flag.type = 'new'
          store.flag.text = 'New'
        } else if (store.is_coming_soon_store) {
          store.flag = {}
          store.flag.type = 'coming-soon'
          store.flag.text = 'Coming Soon'
        } else if (store.is_relocated_store) {
          store.flag = {}
          store.flag.type = 'relocated'
          store.flag.text = 'Relocated'
        } else if (store.active_promotions_count > 0) {
          store.flag = {}
          store.flag.type = 'sale'
          store.flag.text = 'Sale'
        } else if (store.active_events_count > 0) {
          store.flag = {}
          store.flag.type = 'event'
          store.flag.text = 'Event'
        }
      })
      return stores
    },
    categories() {
      var categories = _.filter(this.processedCategories, function(o) {
        return (
          o.name &&
          o.name.length > 0 &&
          !o.parent_category_id &&
          o.name != 'Dining'
        )
      })
      var all_cat = {
        name: 'All Categories',
        id: 0
      }
      categories.unshift(all_cat)
      return this.getOrderedCategories(categories)
    },
    subCategories() {
      var cat_id = this.selectedCategory.id
      var cats = []
      cats = _.filter(this.processedCategories, function(o) {
        return o.parent_category_id == _.toNumber(cat_id)
      })
      var all_cat = {}
      if (cat_id == 0) {
        all_cat = {
          short_name: ' ',
          name: ' ',
          id: 0
        }
      } else {
        all_cat = {
          short_name: 'All ' + this.selectedCategory.name,
          name: 'All ' + this.selectedCategory.name,
          id: 0
        }
      }
      if (!cats) {
        var cats = []
        cats.unshift(all_cat)
      } else {
        cats.unshift(all_cat)
      }
      return cats
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
    }
  },
  methods: {
    onViewOnMap(store) {
      this.$router.push(
        this.localePath({
          name: 'stores-mall-map',
          query: { store_id: store.id }
        })
      )
    },
    onToggleCategories() {
      this.showCategoriesMenu = !this.showCategoriesMenu
      this.showMobileMenu = !this.showMobileMenu
    },
    onCategorySelected(item) {
      if (this.$refs.slick2) {
        this.$refs.slick2.destroy()
      }
      this.selectedCategory = item
      //call filter function
      this.filterByCategory(item)
      //get all subcategories
      this.subCategories
      //set selected sub cat to all
      this.selectedSubCategory = this.subCategories[0]
      if (this.isMobile) {
        if (this.selectedCategory.id == 0) {
          this.showCategoriesMenu = false
        } else {
          //show category menu if this didnt come with category query
          if (!this.$route.query.category) {
            this.showSubCategoriesMenu = true
          }
          this.showCategoriesMenu = false
        }
      }
    },
    getCategoryUrl(item) {
      this.selectedCategory = item;
      this.filterByCategory(item);
      if (this.selectedCategory) {   
        this.$router.push(
          this.localePath({
            name: 'stores',
            query: { category: this.selectedCategory.id }
          })
        )
      }
    },
    onSubCategorySelected(item) {
      this.selectedSubCategory = item
      this.filterBySubCategory(item)
      if (this.isMobile) {
        this.showSubCategoriesMenu = false
        this.showCategoriesMenu = false
      }
      // check for subcat. if subcat, push subcat
      if (this.selectedSubCategory && this.selectedSubCategory.id != 0) {
        this.$router.push(
          this.localePath({
            name: 'stores',
            query: { subcategory: this.selectedSubCategory.id }
          })
        )
      } else if (this.selectedSubCategory.id == 0) {
        this.$router.push(
          this.localePath({
            name: 'stores',
            query: { category: this.selectedCategory.id }
          })
        )
      }
      // else push store
      else {
        this.$router.push({ name: 'stores' })
      }
    },
    onOptionSelect(option) {
      this.filteredStores = [option]
      this.$nextTick(function() {
        this.search_result = ''
      })
    },
    filterByCategory(item) {
      var category_id = item.id
      if (
        category_id !== 0 &&
        category_id !== null &&
        category_id !== undefined
      ) {
        category_id = this.findCategoryById(category_id).id
      } else {
        category_id = 0
      }
      if (category_id == 0) {
        this.filteredStores = this.allStores
      } else {
        var find = this.findCategoryById(category_id)
        var category = find.slug
        var filtered = _.filter(this.allStores, function(o) {
          return _.indexOf(o.categories, _.toNumber(category_id)) > -1
        })
        this.filteredStores = filtered
      }
      this.showCategoriesMenu = false
      this.showMobileMenu = false
    },
    filterBySubCategory(item) {
      var vm = this
      var category_id = item.id
      var subcategory = item.slug
      this.$nextTick(function() {
        if (category_id == 0) {
          //returns all for that cat
          this.filterByCategory(this.selectedCategory)
        } else if (subcategory != null) {
          var filtered = _.filter(this.allStores, function(o) {
            return _.includes(o.categories, category_id)
          })
          this.filteredStores = filtered
        }
        this.showCategoriesMenu = false
        this.showMobileMenu = false
      })
    },
    updatePageContent() {
      var vm = this
      //check if a category is set
      var categoryID = _.toNumber(this.$route.query.category)
      var category = this.findCategoryById(categoryID)

      if(this.$route.query.subcategory) {
        var subCategoryID = _.toNumber(this.$route.query.subcategory)
      }

      if (categoryID && category) {
        this.selectedCategory = category

        _.forEach(this.categories, function(val, key) {
          if (val.id == categoryID && vm.$refs.slick) {
            setTimeout(function() {
              vm.$refs.slick.goTo(key)
            }, 500)
          }
        })
        this.scrollToSticky();
        this.onCategorySelected(this.selectedCategory)
      } else if (subCategoryID) {
        this.$nextTick(function() {
          this.selectedSubCategory = this.findSubcategoryById(subCategoryID)
          this.selectedCategory = this.findCategoryById(
            this.selectedSubCategory.parent_category_id
          )
          this.filterBySubCategory(this.selectedSubCategory)
          _.forEach(this.subCategories, function(val, key) {
            if (val.id == subCategoryID) {
              setTimeout(function() {
                vm.$refs.slick2.goTo(key)
              }, 500)
            }
          })
          this.onCategorySelected(this.selectedCategory)
        })
      } else {
        this.filteredStores = this.allStores
        if (vm.$refs.slick) {
          setTimeout(function() {
            vm.$refs.slick.goTo(0)
          }, 500)
        }
        this.selectedCategory = {
          name: 'All Categories',
          id: 0
        }
        this.onCategorySelected(this.selectedCategory)
      }
    },
    goToMap() {
      this.$router.push('/stores/mall-map')
    },
    scrollToSticky(){
      let stickyStart = document.getElementById('directory');
      stickyStart.scrollIntoView({ behavior: 'smooth' });
    }
  },
  updated() {
    if (
      this.$refs.slick2 &&
      !this.$refs.slick2.$el.classList.contains('slick-initialized')
    ) {
      this.$nextTick(() => {
        this.$refs.slick2.create(this.catCarousel)
      })
    }
  }
}
</script>

