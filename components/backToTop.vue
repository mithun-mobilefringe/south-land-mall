<template>
  <div>
    <div class="footer">
      <div class="row" v-if="scrollY">
        <div class="back-to-top col-12">
          <!-- <v-elevator word="word" duration="1000"></v-elevator> -->
          <a href="#" class="btn" v-scroll-to="{ duration: 1000, offset: 0, container: '#blog_section'}">
            Back to Top</a>
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
      scrollY: true
    }
  },
  mounted() {
    this.loadData().then(response => {
    })
  },
  computed: {
  },
  methods: {
    loadData: async function(id) {
      
    }
  }
}
</script>
<style scoped>

</style>