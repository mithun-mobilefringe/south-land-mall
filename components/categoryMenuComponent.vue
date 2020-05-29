<template>
<div class="">
<div class="category-menu content-container row">
    <div class="col-4 p-0">   
        <span @click="showList=!showList" class="category-lbl">
        <span style="margin-right: 5px">{{categoryLbl}}</span>
        <i class="fa fa-caret-right category-icon" style="font-size: small" :class="{'rotate': showList}"></i>
        </span>
    </div>
    <div class="col-4 map-category">
        Mall Map
    </div>
    <div class="col-4 search-category p-0">
        Search For Store
        <i class="fa fa-search search-icon"></i>
    </div>
    
</div>
<transition name="fade">
<div class="category-list content-container row" v-if="categories" v-show="showList">
    <div class="category-list-items">
    <div v-for="category in categories" class="category-item col-3" :key="category.id">
        {{category.name}}
    </div> 
    </div>
</div>
</transition>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'

export default {
    props: ['categoryType', 'showMap'],
  data() {
    return {
      socialFeed: null,
      categoryLbl: '',
      categories: null,
      showList: false,
      promotionCategories: []
    }
  },
  mounted() {
    this.loadData();
  },
  computed: {
      ...mapGetters([
      "processedCategories",
      "processedPromos"
    ]),
    filteredCategories() {
        return this.processedCategories.filter(category => {
        return category.parent_category_id == null
     })
    }
    
  },
  methods: {
    loadData: function() {
      if(this.categoryType == 'stores') {
          this.categoryLbl = 'Categories'
          this.loadStoreCategories();
      }
      if(this.categoryType == 'promotion') {
          this.categoryLbl = 'Promotion Categories'
          this.loadPromotionCategories();
      } else {
          this.categories = this.filteredCategories;
      }
      

    },
    loadPromotionCategories: function() {
        debugger;
        for(let promo of this.processedPromos) {
            if(promo.store.categories){
                let length = promo.store.categories.length;
            if(length == 1) {
                if(!this.promotionCategories.indexOf(promo.store.categories[0]) > -1)
                    this.promotionCategories.push(promo.store.categories[0])
            } else {
                for(let cat of promo.store.categories) {
                    if(!this.promotionCategories.indexOf(cat.id) > -1)
                        this.promotionCategories.push(cat)
                }
            }
            }
        }
        this.categories = this.processedCategories.filter(category => {
        return this.promotionCategories.indexOf(category.id) > -1
     })

    }
  }
}
</script>
<style scoped>
.category-menu {
    height: 40px;
    background-color: #000000;
    display: flex;
    color: #FFFFFF;
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
    background: #EEEEF0 0% 0% no-repeat padding-box;
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