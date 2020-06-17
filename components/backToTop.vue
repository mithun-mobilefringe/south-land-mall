<template>
  <div>
    <div class="footer">
      <div class="row" v-if="isBackToButtonVisible">
        <div class="back-to-top col-12">
          <!-- <v-elevator word="word" duration="1000"></v-elevator> -->
          <button class="btn" v-scroll-to="{ el: '#head_section' }">
            Back to Top</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'

export default {
  data() {
    return {
      scrollY: true,
      isBackToButtonVisible: false
    }
  },
  mounted() {
    this.loadData();
  },
  computed: {
    
  },
  methods: {
    loadData: function() {
      window.addEventListener("scroll", this.isScrolled);
    },
    isScrolled() {
      if (window.pageYOffset > 300) {
        this.isBackToButtonVisible = true;
      } else {
        this.isBackToButtonVisible = false;
      }
    },
  },
  beforeDestroy: function() {
    window.removeEventListener("scroll", this.isScrolled);
  }
}
</script>
<style scoped>

</style>