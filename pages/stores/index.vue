<template>
  <div>
    <category-menu-component categoryType="stores"></category-menu-component>
    <div class="site_container page_content">
      <div class="row bold store_btns">
        <div class="col-sm-6 col-md-4">
          <div class="store_search">
            <!-- <search-component
              :list="allStores"
              :placeholder="$t('stores_page.find_your_store')"
              suggestion-attribute="name"
              :keys="['name']"
              :tokenize="true"
              v-model="search_result"
              @select="onOptionSelect"
              class="text-left"
            > 
              <template slot="item" scope="option" class="manual">
                <article class="media">
                  <p>
                    <strong>{{ option.data.name }}</strong>
                  </p>
                </article>
              </template>
            </search-component>-->
            <img src="/images/search_icon.png" class="pull-right" id="store_search_img" alt />
          </div>
        </div>
        <div class="col-sm-6 col-md-4">
          <div class="store_search">
            <div class="category-select-container" v-if="windowWidth > 768">
              <div
                class="directory_btn caps"
                @click="showCategories = !showCategories; showSubCategories = false"
              >{{$t("stores_page.categories")}}</div>
            </div>
            <div class="category-select-container" v-else>
              <!-- <v-select
                v-model="selectedParentCat"
                :options="allCatergories"
                label="name"
                :searchable="false"
                :on-change="filterByParentCategory"
                class="category-select"
                :placeholder="$t('stores_page.sort_by_cats')"
                id="selectByCat"
              ></v-select> -->
            </div>
          </div>
        </div>
        <div class="col-md-4 col-sm-12">
          <div class="store_search">
            <nuxt-link class="directory_link" :to="localePath({name: 'map'})">
              <div class="directory_btn caps">{{$t("stores_page.view_map")}}</div>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div id="store_list_container">
        <transition v-on:enter="enter" v-on:leave="leave">
          <div class="categories_container" v-if="showCategories && windowWidth >= 768">
            <span
              v-for="category in allCatergories"
              class="category hvr-underline-from-center"
              :class="{'active': selectedParentCat.id == category.id}"
              @click="selectedParentCat = category; getSubcategories()"
              :key="category.id"
            >{{category.name}}</span>
          </div>
        </transition>
        <transition v-on:enter="enter" v-on:leave="leave">
          <div class="categories_container" v-if="showSubCategories && windowWidth >= 768">
            <span class="category caps" @click="backToParentCategories()">
              <i class="fa fa-caret-left"></i>
              Back
            </span>
            <span
              v-for="category in subcategories"
              class="category hvr-underline-from-center"
              :class="{'active': selectedCat.id == category.id}"
              @click="selectedCat = category; filterByCategory"
              :key="category.id"
            >{{category.name}}</span>
          </div>
        </transition>
        <div
          v-masonry
          transition-duration="0.2s"
          item-selector=".stores-grid-item"
          horizontal-order="true"
        >
          <transition-group
            name="custom-classes-transition"
            enter-active-class="animated fade"
            leave-active-class="animated fade"
            tag="div"
          >
            <div
              v-masonry-tile
              v-for="(store, index) in filteredStores"
              v-if="showMore > index"
              :key="index"
              class="stores-grid-item"
            >
              <div class="store_logo_container">
                <nuxt-link :to="localePath({name: 'stores-slug', params:{slug:store.slug}})">
                  <img
                    v-if="!store.no_store_logo"
                    class="store_img"
                    :src="store.store_front_url_abs"
                    alt
                  />
                  <div v-else class="no_logo_container">
                    <img class="store_img" src="/images/transparent_logo.png" alt />
                    <div class="no_logo_text">
                      <div class="store_text">
                        <h4 v-if="locale=='fr' && store.name_2">{{ store.name_2 }}</h4>
                        <h4 v-else>{{ store.name }}</h4>
                      </div>
                    </div>
                  </div>
                  <div class="store_tag" v-if="store.is_coming_soon_store">
                    <div class="store_tag_text">Coming Soon</div>
                  </div>
                  <div class="store_tag" v-else-if="store.is_new_store">
                    <div class="store_tag_text">New Store</div>
                  </div>
                  <div class="store_tag" v-else-if="store.total_published_promos">
                    <div class="store_tag_text">Promotion</div>
                  </div>
                  <div class="store_tag" v-else-if="store.events">
                    <div class="store_tag_text">Event</div>
                  </div>
                  <div class="store_tag" v-else-if="store.total_published_jobs">
                    <div class="store_tag_text">Job</div>
                  </div>
                  <div class="store_details">
                    <div class="store_text">
                      <h4 v-if="locale=='fr' && store.name_2">{{ store.name_2 }}</h4>
                      <h4 v-else>{{ store.name }}</h4>
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>
          </transition-group>
        </div>
        <div
          id="load_more"
          v-if="filteredStores && showMore <= filteredStores.length"
          @click="loadMore()"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  head() {
    return this.currentSEO;
  },
  transition: "page",
  components: {
    /* SearchComponent: () => import("~/components/SearchComponent.vue"),
    MapplicMap: () => import("~/components/Mapplic.vue"),
    VSelect: () => import("vue-select"),
    insidePageHeader: () => import("~/components/insidePageHeader.vue") */
    categoryMenuComponent: () =>
      import("~/components/categoryMenuComponent.vue")
  },
  data() {
    return {
      selectedCat: { id: 0, name: "ALL" },
      selectedParentCat: { id: 0, name: "ALL" },
      filteredStores: null,
      search_result: null,
      tempSEO: null,
      currentSEO: {},
      showCategories: false,
      showSubCategories: false,
      subcategories: null,
      showMore: 18,
      incrementBy: 18
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "categories" }),
        store.dispatch("getMMData", { resource: "stores" }),
        store.dispatch("LOAD_SEO", {
          url: "/stores"
        }),
        store.dispatch("getMMData", { resource: "subcategories" })
      ]);
      return { tempSEO: results[2].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function() {
      this.filteredStores = this.allStores;
      if (this.tempSEO) {
        this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
      }
    });
    next();
  },
  created() {
    this.filteredStores = this.allStores;
    if (this.tempSEO) {
      this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
    }
    var newStores = this.findNewStores;
    console.log("New Stores: " + newStores);
  },
  beforeMount() {
    window.addEventListener("scroll", this.isScrolled);
  },
  watch: {
    filteredStores() {
      if (!this.filteredStores) {
        this.filteredStores = this.allStores;
      }
    }
  },
  computed: {
    ...mapGetters([
      "property",
      "timezone",
      "processedStores",
      "processedCategories",
      "storesByAlphaIndex",
      "storesByCategoryName",
      "findCategoryById",
      "findCategoryByName",
      "findSubcategoriesByParentID",
      "findRepoByName",
      "locale"
    ]),
    allStores() {
      var stores = this.processedStores;
      var vm = this;
      _.forEach(stores, function(store, key) {
        if (_.includes(store.store_front_url_abs, "missing")) {
          store.no_store_logo = true;
        } else {
          store.no_store_logo = false;
        }
      });
      return stores;
    },
    allCatergories() {
      var cats = this.processedCategories; //_.map(this.processedCategories, 'name')
      cats.unshift({ id: 0, name: "ALL" });
      return cats;
    },
    dropDownCats() {
      var cats = _.map(
        _.filter(this.processedCategories, function(o) {
          return o.store_ids;
        }),
        "name"
      );
      cats.unshift("ALL");
      return cats;
    },
    filterByCategory() {
      var category_id = this.selectedCat.id;

      if (category_id == 0 || category_id == null || category_id == undefined) {
        this.filteredStores = this.allStores;
      } else {
        var filtered = _.filter(this.allStores, function(o) {
          return _.indexOf(o.subcategories, _.toNumber(category_id)) > -1;
        });

        this.filteredStores = filtered;
      }
      if (this.windowWidth < 769) {
        this.showSubCategories = false;
        this.showCategories = false;
      }
    },
    // filterByParentCategoryMobile() {
    //   var category_id = this.selectedParentCat.name;

    //   if (
    //     category_id == "ALL" ||
    //     category_id == null ||
    //     category_id == undefined
    //   ) {
    //     this.filteredStores = this.allStores;
    //   } else {
    //     category_id = this.findCategoryByName(category_id).id;
    //     var find = this.findCategoryById;
    //     var filtered = _.filter(this.allStores, function(o) {
    //       return _.indexOf(o.categories, _.toNumber(category_id)) > -1;
    //     });

    //     this.filteredStores = filtered;
    //   }
    // },
    pageBanner() {
      var pageBanner = null;
      var temp_repo = this.findRepoByName("Stores Banner");
      if (temp_repo && temp_repo.images) {
        pageBanner = temp_repo.images[0];
      } else {
        pageBanner = {};
        pageBanner.image_url = "";
      }
      return pageBanner;
    },
    mobile_store() {
      if (this.windowWidth <= 768) {
        this.showCategories = false;
        this.showSubCategories = false;
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    loadData: async function() {
      try {
        let results = await Promise.all([
          this.$store.dispatch("getData", "categories"),
          this.$store.dispatch("getData", "repos")
        ]);
      } catch (e) {
        console.log("Error loading data: " + e.message);
      }
    },
    onOptionSelect(option) {
      this.search_result = "";
      this.$router.push("/stores/" + option.slug);
    },
    getSubcategories() {
      var category_id = this.selectedParentCat.id;
      if (category_id == 0 || category_id == null || category_id == undefined) {
        this.filterByParentCategory();
        this.showSubCategories = false;
      } else {
        this.filterByParentCategory();

        var subcategories = this.findSubcategoriesByParentID(category_id);
        if (subcategories && subcategories.length > 0) {
          this.subcategories = subcategories;
          this.showSubCategories = true;
          this.showCategories = false;
        }
      }
    },
    loadMore() {
      if (this.showMore <= this.filteredStores.length) {
        var num = this.showMore + this.incrementBy;
        this.showMore = num;
      }
    },
    isScrolled() {
      if (window.pageYOffset > 300) {
        var button = document.getElementById("load_more");
        if (button) {
          this.isScrolledIntoView(button);
        }
      }
    },
    isScrolledIntoView(button) {
      var docViewTop = $(window).scrollTop();
      var docViewBottom = docViewTop + $(window).height();
      var elemTop = $(button).offset().top;
      var elemBottom = elemTop + $(button).height();

      if (elemBottom <= docViewBottom && elemTop >= docViewTop) {
        this.loadMore();
      }
    },
    filterByParentCategory() {
      var category_id = this.selectedParentCat.id;
      if (category_id == 0 || category_id == null || category_id == undefined) {
        this.filteredStores = this.allStores;
      } else {
        var find = this.findCategoryById;
        var filtered = _.filter(this.allStores, function(o) {
          return _.indexOf(o.categories, _.toNumber(category_id)) > -1;
        });
        this.filteredStores = filtered;
      }
    },
    backToParentCategories() {
      this.showCategories = true;
      this.showSubCategories = false;
      this.filterByParentCategory();
    }
  },
  beforeDestroy: function() {
    window.removeEventListener("scroll", this.isScrolled);
  }
};
</script>
