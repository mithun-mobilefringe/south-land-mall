<template>
<div>
<div class="category-menu">
    <div class="col-4">   
        <span style="margin-right: 5px">{{categoryLbl}}</span>
        <i class="fa fa-caret-right" style="font-size: small"></i>
    </div>
    <div class="col-4 map-category">
        Mall Map
    </div>
    <div class="col-4 search-category">
        Search For Store
        <i class="fa fa-search search-icon"></i>
    </div>
    
</div>
<div class="category-list">

</div>
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
      categoryLbl: ''
    }
  },
  mounted() {
    this.loadData();
  },
  computed: {
  },
  methods: {
    loadData: function() {
      if(this.categoryType == 'stores') {
          this.categoryLbl = 'Categories'
          this.getStoreCategories();
      }

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
    padding: 0px 88px;
    align-items: center;
    font-size: 16px;
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
</style>