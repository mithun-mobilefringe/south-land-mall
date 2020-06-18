<template>
  <div>
    <div class="category-menu">
      <div class="container">
        <div class="row">
          <div class="col-4">
            <div v-if="!showBackButton">
              <span @click="showList=!showList" class="category-lbl">
                <span style="margin-right: 5px">{{categoryLbl}}</span>
                <i
                  class="fa fa-caret-right category-icon"
                  style="font-size: small"
                  :class="{'rotate': showList}"
                ></i>
              </span>
            </div>
            <div v-if="showBackButton">
              <nuxt-link :to="backlinkURL" style="color: white">
                <i class="fa fa-caret-left category-icon" style="font-size: small"></i>
                <span style="margin-right: 5px;">{{categoryLbl}}</span>
              </nuxt-link>
            </div>
          </div>
          <div class="col-4 map-category"><nuxt-link to="/map" v-if="showMap">Map</nuxt-link></div>
          <div class="col-4 search-category">
            <div class="d-flex" @click="showSearchWindow=!showSearchWindow">
            Search For Store
            <i class="fa fa-search search-icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="container">
        <div class="category-list row" v-if="categories" v-show="showList">
          <div class="col-12">
            <div class="category-list-items">
              <div v-for="category in categories" class="category-item col-6 col-sm-4 col-md-3" :key="category.id">
                <div class="items" @click="emitSelectedCategory(category)">{{category.name}}</div>
              </div>
              <div class="cross-item col-12" v-if="displayCross">
                <i class="fa fa-times items" aria-hidden="true" @click="loadAllCategories()"></i>
              </div>
            </div>
          </div>
        </div>
        <right-search-component v-if="showSearchWindow" @selectedCategoryFromSearch="filterCategoriesFromSearch" @closeSearch="showSearchWindow=false"></right-search-component>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {
    RightSearchComponent: () => import('~/components/rightSearchComponent.vue')
  },
  props: {
    "categoryType": String,
    "showMap": {
      type: Boolean,
      default:true
    },
    "filteredStores": {
      type: Array
    }, "subCategoryType": String},
  data() {
    return {
      socialFeed: null,
      categoryLbl: "",
      categories: [],
      showList: false,
      promotionCategories: [],
      storeCategories: [],
      eventCategories: [],
      jobCategories: [],
      newsCategories: [],
      showBackButton: false,
      backlinkURL: "",
      displayCross: false,
      showSearchWindow: false
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.loadData();
    });
  },
  computed: {
    ...mapGetters([
      "processedCategories",
      "processedPromos",
      "processedStores",
      "processedEvents",
      "processedJobs",
      "processedNews",
      "findNewStores",
      "processedDineStores"
    ]),
    filteredCategories() {
      return this.processedCategories.filter(category => {
        return category.parent_category_id == null;
      });
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function() {
      this.loadData();
    });
    next();
  },
  watch: {
    categoryType: function(val) {
      this.loadData();
    },
    subCategoryType: function(val) {
      this.loadData();
    }
  },
  methods: {
    loadData: function() {
      if (this.categoryType == "stores" || this.categoryType == "dine") {
        this.categoryLbl = "Store Categories";
        this.showBackButton = false;
        this.loadStoreCategories();
      } else if (this.categoryType == "newstores") {
        this.categoryLbl = "New Store Categories";
        this.showBackButton = false;
        this.loadNewStoreCategories();
      } else if (this.categoryType == "storeDetails") {
        this.showBackButton = true;
        this.categoryLbl = "Back to Stores";
        this.backlinkURL = "/stores";
      } else if (this.categoryType == "promotions") {
        this.categoryLbl = "Promotion Categories";
        this.showBackButton = false;
        this.loadPromotionCategories();
      } else if (this.categoryType == "promotionDetails") {
        this.showBackButton = true;
        this.categoryLbl = "Back to Promotions";
        this.backlinkURL = "/promotions";
      } else if (this.categoryType == "events") {
        this.categoryLbl = "Event Categories";
        this.showBackButton = false;
        this.loadEventCategories();
      } else if (this.categoryType == "eventDetails") {
        this.showBackButton = true;
        this.categoryLbl = "Back to Events";
        this.backlinkURL = "/events";
      } else if (this.categoryType == "jobs") {
        this.categoryLbl = "Job Categories";
        this.showBackButton = false;
        this.loadJobCategories();
      } else if (this.categoryType == "jobDetails") {
        this.showBackButton = true;
        this.categoryLbl = "Back to Jobs";
        this.backlinkURL = "/jobs";
      } else if (this.categoryType == "news") {
        this.categoryLbl = "News Categories";
        this.showBackButton = false;
        this.loadNewsCategories();
      } else if (this.categoryType == "newsDetails") {
        this.showBackButton = true;
        this.categoryLbl = "Back to News";
        this.backlinkURL = "/news";
      } else {
        this.categories = this.filteredCategories;
      }
    },
    loadAllCategories: function() {
      this.loadData();
      this.displayCross = false;
      this.$emit("selectedCategory", "all");
    },
    emitSelectedCategory: function(event) {
      this.$emit("selectedCategory", event);
      this.filterCategories(event);
    },
    filterCategories: function(cat) {
      this.displayCross = true;
      this.categories = _.filter(this.categories, function(o) {
        return o.id == cat.id;
      });
    },
    filterCategoriesFromSearch: function(cat) {
      this.displayCross = true;
      this.showSearchWindow = false;
      this.categories = this.filterItemCategories(this.storeCategories);
      this.emitSelectedCategory(cat);
    },
    loadStoreCategories: function() {
      this.$nextTick(function() {
        this.storeCategories = [];
        var stores = [];
        if(this.categoryType == "stores") {
          stores = this.processedStores;
        } else {
          if(this.subCategoryType) {
            stores = this.filteredStores;
          } else {
            stores = this.processedDineStores;
          }
        }
        for (let store of stores) {
          if (store && store.categories) {
            let length = store.categories.length;
            if (length == 1) {
              if (!this.storeCategories.indexOf(store.categories[0]) > -1)
                this.storeCategories.push(store.categories[0]);
            } else {
              for (let cat of store.categories) {
                if (!this.storeCategories.indexOf(cat.id) > -1)
                  this.storeCategories.push(cat);
              }
            }
          }
        }
        this.categories = this.filterItemCategories(this.storeCategories);
      });
    },
    loadNewStoreCategories: function() {
      this.$nextTick(function() {
        this.storeCategories = [];
        for (let store of this.findNewStores) {
          if (store && store.categories) {
            let length = store.categories.length;
            if (length == 1) {
              if (!this.storeCategories.indexOf(store.categories[0]) > -1)
                this.storeCategories.push(store.categories[0]);
            } else {
              for (let cat of store.categories) {
                if (!this.storeCategories.indexOf(cat.id) > -1)
                  this.storeCategories.push(cat);
              }
            }
          }
        }
        this.categories = this.filterItemCategories(this.storeCategories);
      });
    },
    loadPromotionCategories: function() {
      this.$nextTick(function() {
        this.promotionCategories = [];
        for (let promo of this.processedPromos) {
          if (promo.store && promo.store.categories) {
            let length = promo.store.categories.length;
            if (length == 1) {
              if (
                !this.promotionCategories.indexOf(promo.store.categories[0]) >
                -1
              )
                this.promotionCategories.push(promo.store.categories[0]);
            } else {
              for (let cat of promo.store.categories) {
                if (!this.promotionCategories.indexOf(cat.id) > -1)
                  this.promotionCategories.push(cat);
              }
            }
          }
        }
        this.categories = this.filterItemCategories(this.promotionCategories);
      });
    },
    loadEventCategories: function() {
      this.$nextTick(function() {
        this.eventCategories = [];
        for (let event of this.processedEvents) {
          if (event.tags && event.tags.length > 0) {
            for (let tag of event.tags) {
              if (!this.isTagAlreadyAdded(tag)) {
                var category = {
                  name: tag,
                  id: this.eventCategories.length
                };
                this.eventCategories.push(category);
              }
            }
          }
        }
        this.categories = this.eventCategories;
      });
    },
    isTagAlreadyAdded: function(tag) {
      let isTagAdded= false;
      if(this.eventCategories.length == 0) {
        isTagAdded = false;
      } else {
      for (let eventCat of this.eventCategories) {
        if (tag.indexOf(eventCat.name) > -1) {
          isTagAdded = true;
          break;
        } else {
          isTagAdded = false;
        }
      }
      }
      return isTagAdded;
    },
    loadJobCategories: function() {
      this.$nextTick(function() {
        this.jobCategories = [];
        for (let job of this.processedJobs) {
          if (job.store && job.store.categories) {
            let length = job.store.categories.length;
            if (length == 1) {
              if (!this.jobCategories.indexOf(job.store.categories[0]) > -1)
                this.jobCategories.push(job.store.categories[0]);
            } else {
              for (let cat of job.store.categories) {
                if (!this.jobCategories.indexOf(cat.id) > -1)
                  this.jobCategories.push(cat);
              }
            }
          }
        }
        this.categories = this.filterItemCategories(this.jobCategories);
      });
    },
    loadNewsCategories: function() {
      this.$nextTick(function() {
        this.newsCategories = [];
        for (let news of this.processedNews) {
          if (news.store && news.store.categories) {
            let length = news.store.categories.length;
            if (length == 1) {
              if (!this.newsCategories.indexOf(news.store.categories[0]) > -1)
                this.newsCategories.push(news.store.categories[0]);
            } else {
              for (let cat of news.store.categories) {
                if (!this.newsCategories.indexOf(cat.id) > -1)
                  this.newsCategories.push(cat);
              }
            }
          }
        }
        this.categories = this.filterItemCategories(this.newsCategories);
      });
    },
    filterItemCategories: function(itemCategories) {
      return this.processedCategories.filter(category => {
        return itemCategories.includes(category.id);
      });
    }
  }
};
</script>
<style scoped>
.category-menu {
  height: 2.5rem;
  background-color: #000000;
  display: flex;
  color: #ffffff;
  align-items: center;
  font-size: 1rem;
}
.category-menu a {
  color: white;
}
.category-icon {
  transition: transform 0.3s ease-in-out;
}
.category-lbl:hover {
  cursor: pointer;
}
.map-category {
  display: flex;
  justify-content: center;
}
.search-category {
  display: flex;
  justify-content: flex-end;
}
.search-icon {
  font-size: small;
  display: flex;
  align-items: center;
  margin-left: 5px;
}

.items {
  cursor: pointer;
}

.cross-item {
  display: flex;
  font-size: 1rem;
  padding: 1rem 2rem 0rem 1rem;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
}

.rotate {
  transform: rotate(90deg);
}
</style>