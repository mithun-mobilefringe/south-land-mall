<template>
  <div>
    <category-menu-component
      :categoryType="categoryType"
      :subCategoryType="subCategoryType"
      :filteredStores="filteredStores"
      @selectedCategory="filterStoresByCategory"
    ></category-menu-component>
    <div class="container">
      <div class="row" v-if="filteredStores.length>0">
        <div
          class="col-lg-2 col-md-3 col-sm-4 col-6 store-section"
          v-for="store in filteredStores"
          :key="store.id"
        >
          <div class="store-item">
            <nuxt-link :to="'/stores/' +store.slug">
              <div v-if="!store.no_store_logo" class="store-logo">
                <img class="store_img" :src="store.logo_image_url" alt />
              </div>

              <div class="store_text" v-else>
                <p>{{ store.name }}</p>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="row" v-else style="margin-top: 30px">
        <p>There are no Stores at this time. Please check back soon.</p>
      </div>
      <back-to-top></back-to-top>
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
      import("~/components/categoryMenuComponent.vue"),
    backToTop: () => import("~/components/backToTop.vue")
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
      incrementBy: 18,
      urlParams: null,
      categoryType: "dine"
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "categories" }),
        store.dispatch("getMMData", { resource: "stores" }),
        store.dispatch("LOAD_SEO", {
          url: "/dine"
        })
      ]);
      return { tempSEO: results[2].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  beforeRouteUpdate(to, from, next) {
    debugger;
    this.$nextTick(function() {
      this.urlParams = this.$route.query;
      debugger;
      if (this.urlParams && this.urlParams.type) {
        this.categoryType = "dine";
        this.subCategoryType = this.urlParams.type;
        var cat = this.getCategory(this.urlParams.type);
        this.filterStoresByCategory(cat);
      } else {
        this.filteredStores = this.allStores;
        this.urlParams = null;
        this.categoryType = "dine";
        if (this.tempSEO) {
          this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
        }
      }
    });
    next();
  },
  created() {
    this.urlParams = this.$route.query;
    if (this.urlParams && this.urlParams.type) {
      this.categoryType = "dine";
      this.subCategoryType = this.urlParams.type;
      var cat = this.getCategory(this.urlParams.type);
        this.filterStoresByCategory(cat);
    } else {
      this.filteredStores = this.allStores;
      this.urlParams = null;
      this.categoryType = "dine";
    }
    if (this.tempSEO) {
      this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
    }
  },
  beforeMount() {
    // window.addEventListener("scroll", this.isScrolled);
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
      "locale",
      "processedDineStores"
    ]),
    allStores() {
      var stores = this.processedDineStores;
      debugger;
      var vm = this;
      _.forEach(stores, function(store, key) {
        if (store.logo_image_url) {
          store.no_store_logo = false;
        } else {
          store.no_store_logo = true;
        }
      });
      window.addEventListener("scroll", this.isScrolled);
      return stores;
    },
    filterByCategory(selectedCat) {
      var category_id = selectedCat.id;
      debugger;
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
    getCategory: function(categoryType) {
      var cat = null;
      for (const category of this.processedCategories) {
        if (category.name.toLowerCase() == categoryType.toLowerCase()) {
          cat = category;
          break;
        }
      }
      return cat;
    },
    filterStoresByCategory: function(selectedCat) {
      debugger;
      console.log(selectedCat);
      var filtered = [];
      if (this.urlParams && this.urlParams.type) {
        var cat = this.getCategory(this.urlParams.type);
        filtered = _.filter(this.allStores, function(o) {
          return _.indexOf(o.categories, _.toNumber(cat.id)) > -1;
        });
      } else {
        filtered = this.allStores;
      }

      if (selectedCat == "all") {
        this.filteredStores = filtered;
      } else {
        var category_id = selectedCat.id;
        if (
          category_id == 0 ||
          category_id == null ||
          category_id == undefined
        ) {
          this.filteredStores = filtered;
        } else {
          var categoryFiltered = _.filter(filtered, function(o) {
            return _.indexOf(o.categories, _.toNumber(category_id)) > -1;
          });
          this.filteredStores = categoryFiltered;
        }
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
