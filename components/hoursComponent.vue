<template>
  <div class="week-hours">
    <div class="week-hours-header mb-2">
      <button
        class="btn-link btn-past btn-left-arrow"
        @click.prevent="pastWeek()"
        aria-label="View previous week's hours"
        :disabled="isCurrentWeek"
      >Past Week</button>
      <span
        class="date-range"
      >{{ startOfWeek | moment("MMM D") }} - {{ endOfWeek | moment("MMM D")}}</span>
      <button
        class="btn-link btn-next btn-right-arrow"
        @click.prevent="nextWeek()"
        aria-label="View next week's hours"
      >Next Week</button>
    </div>
    <div class="table table-sm week-hours-table">
      <div
        v-for="hour in hours"
        :key="hour.id"
        :class="['day-hours',{ 'active': (today.day_of_week == hour.day_of_week) &&  isCurrentWeek }]"
      >
        <div class="day">{{ hour.day_of_week | moment("ddd", timezone) }}</div>
        <div>
          <span class="hours" v-if="hour.is_closed">Closed</span>
          <span
            class="hours"
            v-else
          >{{ hour.open_time | moment("h:mm A", timezone) }} - {{ hour.close_time | moment("h:mm A", timezone) }}</span>
        </div>
      </div>
    </div>
    <span class="text-muted">
      <p>Restaurant and department store hours may vary.</p>
    </span>
    <div v-if="extraHours" v-html="extraHours.extra_hours"></div>
  </div>
</template>

<style>
.week-hours .btn-past:disabled {
  color: #b2b2b2;
}
</style>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import tz from 'moment-timezone'

export default {
  props: ['extraHours'],
  data: function data() {
    return {
      startOfWeek: null,
      endOfWeek: null,
      selectedWeek: null,
      selectedDate: moment(),
      hours: []
    }
  },
  watch: {
    selectedDate: function() {
      if (this.selectedDate) {
        this.getWeek(this.selectedDate)
        this.setHours(this.selectedDate)
      }
    }
  },
  mounted() {
    // Set this week's date to today
    this.selectedDate = moment()
      .tz(this.timezone)
      .format('MMM D, YYYY')
  },
  computed: {
    ...mapGetters([
      'property',
      'timezone',
      'locale',
      'getPropertyHours',
      'getPropertyHolidayHours'
    ]),
    today() {
      //gets day of the week of today
      var today = {}
      today.date = moment().format()
      today.day_of_week = moment(today.date)
        .tz(this.timezone)
        .format('d')
      return today
    },
    regularHours() {
      var hours = []
      _.forEach(this.getPropertyHours, function(val) {
        if (val.day_of_week == 0) {
          val.sort_id = 7
        } else {
          val.sort_id = val.day_of_week
        }
        hours.push(val)
      })
      return _.sortBy(hours, [
        function(o) {
          return o.sort_id
        }
      ])
    },
    holidayHours() {
      return _.sortBy(this.getPropertyHolidayHours, [
        function(o) {
          return o.holiday_date
        }
      ])
    },
    nextHolidayHours() {
      var holiday = null
      var today = moment().format('X')
      _.forEach(this.holidayHours, function(val) {
        if (today < moment(val.holiday_date).format('X') && !holiday) {
          holiday = val
        }
      })
      return holiday
    },
    isCurrentWeek() {
      var today = moment().format('MMM D, YYYY')
      if (
        moment(today).isBetween(this.startOfWeek, this.endOfWeek, null, '[]')
      ) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getWeek(date) {
      var start = moment(date).startOf('isoWeek')
      start = moment(start).year(start.year())
      this.startOfWeek = moment(start).format('MMM D, YYYY')
      var end = moment(date).endOf('isoWeek')

      end = moment(end).year(end.year())
      this.endOfWeek = moment(end).format('MMM D, YYYY')
    },
    nextWeek() {
      var selected_date = this.selectedDate
      selected_date = moment(selected_date).add(7, 'days')
      selected_date = moment(selected_date)
        .tz(this.timezone)
        .format('MMM D, YYYY')
      this.selectedDate = selected_date
    },
    pastWeek() {
      var selected_date = this.selectedDate
      selected_date = moment(selected_date).subtract(7, 'days')
      selected_date = moment(selected_date)
        .tz(this.timezone)
        .format('MMM D, YYYY')
      this.selectedDate = selected_date
    },
    setHours(date) {
      var _this = this
      var hours = this.getPropertyHours

      var holiday_hours = this.getPropertyHolidayHours
      var next_holiday = []
      _.forEach(holiday_hours, function(value, key) {
        var this_holiday = value
        // Convert dates to timestamp
        var holiday_date = moment(this_holiday.holiday_date)
          .hour(0)
          .minute(0)
          .tz(_this.timezone)
          .format('X')
        var start_week = moment(_this.startOfWeek).format('X')
        var end_week = moment(_this.endOfWeek).format('X')

        // As the weeks change, check to see if any holidays are in that week
        if (this_holiday.holiday_end_date) {
          // Convert end date
          var holiday_end_date = moment(this_holiday.holiday_end_date)
            .tz(_this.timezone)
            .format('X')
          _.forEach(
            _.range(
              0,
              moment(this_holiday.holiday_end_date).diff(
                moment(this_holiday.holiday_date),
                'days'
              ) + 1
            ),

            function(i) {
              var current_holiday = {}
              var current_date = moment(this_holiday.holiday_date).add(
                i,
                'days'
              )

              // current_holiday.day_of_week = moment(current_holiday.date).day()
              current_holiday.date = current_date
                .hour(0)
                .minute(0)
                .format()
              current_holiday.close_time = this_holiday.close_time
              current_holiday.day_of_week = moment(current_holiday.date).day()
              current_holiday.holiday_date = current_date
              current_holiday.holiday_name = this_holiday.holiday_name
              current_holiday.open_time = this_holiday.open_time
              current_holiday.is_closed = this_holiday.is_closed
              current_holiday.is_holiday = this_holiday.is_holiday
              current_holiday.open_full_day = this_holiday.open_full_day

              var temp_date = moment(current_holiday.date).format('X')

              if (temp_date >= start_week && temp_date <= end_week) {
                next_holiday.push(current_holiday)
              }
            }
          )
        } else if (holiday_date >= start_week && holiday_date <= end_week) {
          // Set the day_of_week for each Holiday Date
          this_holiday.day_of_week = moment(this_holiday.holiday_date).day()
          next_holiday.push(this_holiday)
        }
      })

      if (_.isEmpty(next_holiday)) {
        this.hours = this.regularHours
      } else {
        // start with the regular hours
        var modified_hours = _.orderBy(
          this.regularHours,
          ['day_of_week'],
          ['asc']
        )

        //loops through the list of holidays and compare it to regular hours
        _.forEach(next_holiday, function(holiday, index) {
          _.forEach(hours, function(hour, key) {
            //if there is a holiday in this week, replace regular hour with holiday hour

            if (hour.day_of_week === holiday.day_of_week) {
              //preserve the sort order from regular hours
              var sort_id = modified_hours[key].sort_id
              modified_hours[key] = holiday
              //re-assign sort order to the holiday hour
              modified_hours[key].sort_id = sort_id
              //break out of the hours lopp if you find the matching day of the week
              return false
            }
          })
        })
        // assingn new hours to the hours
        this.hours = _.orderBy(modified_hours, ['sort_id'], ['asc'])
      }
    }
  }
}
</script>
