<template>
  <div class="container">
    <h3>Shopping Hours</h3>
    <p v-if="!getTodayHours.is_closed">{{todayDate | moment("ddd", timezone)}} {{getTodayHours.open_time | moment("LT", timezone)}} - {{getTodayHours.close_time | moment("LT", timezone)}}</p>
    <p v-if="getTodayHours.is_closed">Closed</p>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import moment from 'moment'
  import tz from 'moment-timezone'

  export default {
    data: function(){
      return {
        todayDate: new Date()
      }
    },
    computed: {
      ...mapGetters([
        'getTodayHours',
        'timezone'
      ])
    }
  }
</script>