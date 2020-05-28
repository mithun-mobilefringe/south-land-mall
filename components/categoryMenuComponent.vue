<template>
<div>
<div class="category-menu">
    <div class="col-4">   
        <span @click="showList=!showList" class="category-lbl">
        <span style="margin-right: 5px">{{categoryLbl}}</span>
        <i class="fa fa-caret-right category-icon" style="font-size: small" :class="{'rotate': showList}"></i>
        </span>
    </div>
    <div class="col-4 map-category">
        Mall Map
    </div>
    <div class="col-4 search-category">
        Search For Store
        <i class="fa fa-search search-icon"></i>
    </div>
    
</div>
<transition name="fade">
<div class="category-list col-12" v-if="categories" v-show="showList">
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
      showList: false
    }
  },
  mounted() {
    this.loadData();
  },
  computed: {
      ...mapGetters([
      "processedCategories"
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
          this.getStoreCategories();
      }
      this.categories = this.filteredCategories;

    },
    getStoreCategories: function() {

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
    padding: 0px 70px;
    align-items: center;
    font-size: 16px;
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
    height: 235px;
    background: #EEEEF0 0% 0% no-repeat padding-box;
    display: flex;
    flex-wrap: wrap;
    padding: 30px 85px 0px 85px;
    margin-bottom: 30px;
    
}
.category-list-items {
    border-bottom: solid 0.5px #000000;
    display: flex;
    flex-wrap: wrap;
}
.category-item {
    display: flex;
    height: 25px;
    padding-left: 0px;
    padding-right: 0px;
}

.rotate {
    
    transform: rotate(90deg);
}
</style>