<template>
  <div>
    <div class="category-menu">
      <div class="container">
        <div class="row">
          <div class="col-4 p-0">
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
          <div class="col-4 map-category p-0">Mall Map</div>
          <div class="col-4 search-category p-0">
            Search For Store
            <i class="fa fa-search search-icon"></i>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="container">
        <div class="category-list row" v-if="categories" v-show="showList">
          <div class="category-list-items">
            <div
              v-for="category in categories"
              class="category-item col-3"
              :key="category.id"
            >{{category.name}}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["categoryType", "showMap"],
  data() {
    return {
      socialFeed: null,
      categoryLbl: "",
      categories: [],
      showList: false,
      promotionCategories: [],
      showBackButton: false,
      backlinkURL: ""
    };
  },
  mounted() {
    this.loadData();
  },
  computed: {
    ...mapGetters(["processedCategories", "processedPromos"]),
    filteredCategories() {
      return this.processedCategories.filter(category => {
        return category.parent_category_id == null;
      });
    }
  },
  methods: {
    loadData: function() {
      if (this.categoryType == "stores") {
        this.categoryLbl = "Categories";
        this.showBackButton = false;
        this.loadStoreCategories();
      }
      if (this.categoryType == "promotion") {
        this.categoryLbl = "Promotion Categories";
        this.showBackButton = false;
        this.loadPromotionCategories();
      }
      if (this.categoryType == "promotionDetails") {
        this.showBackButton = true;
        this.categoryLbl = "Back to Promotions";
        this.backlinkURL = "/promotions";
      } else {
        this.categories = this.filteredCategories;
      }
    },
    loadPromotionCategories: function() {
      this.$nextTick(function() {
      for (let promo of this.processedPromos) {
        if (promo.store.categories) {
          let length = promo.store.categories.length;
          if (length == 1) {
            if (
              !this.promotionCategories.indexOf(promo.store.categories[0]) > -1
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
.category-list {
  background: #eeeef0 0% 0% no-repeat padding-box;
  display: flex;
  flex-wrap: wrap;
}
.category-list-items {
  width: 100%;
  border-bottom: solid 0.5px #000000;
  display: flex;
  flex-wrap: wrap;
  font-size: 1.2rem;
  padding: 1.5rem 0rem;
}
.category-item {
  display: flex;
  padding: 1rem 0rem;
}

.rotate {
  transform: rotate(90deg);
}
</style>