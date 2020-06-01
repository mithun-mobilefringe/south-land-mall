<template>
  <div>
    <category-menu-component categoryType="event"></category-menu-component>
    <div class="container">
      <div class="row" v-if="events">
        <div class="col-md-6 col-sm-12 event-section" v-for="event in events" :key="event.id">
          <div class="event-container">
            <div class="container-details col-7">
              <div v-if="event.store" class="promo-store-name">{{event.store.name}}</div>
              <div v-else class="promo-store-name">Southland Mall</div>
              <div class="promo-name">{{event.name}}</div>
              <div class="promo-date">
                <span
                  v-if="isMultiDay(event)"
                >{{ event.start_date | moment("MMM D", timezone)}} - {{ event.end_date | moment("MMM D", timezone)}}</span>
                <span v-else>{{ event.start_date | moment("MMM D", timezone)}}</span>
              </div>
              <div class="promo-button btn p-0">
                <nuxt-link :to="'/events/'+event.slug">Event Details</nuxt-link>
              </div>
            </div>
            <div class="container-img col-5">
              <div v-if="event.image_url" v-lazy:background-image="event.image_url"></div>
              <div v-else v-lazy:background-image="event.event_image2_url_abs"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row" v-else>
        There are no Events at this time. Please check back soon.
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import moment from "moment";
import tz from "moment-timezone";
export default {
  head() {
    return this.currentSEO;
  },
  transition: "page",
  components: {
    // insidePageHeader: () => import("~/components/insidePageHeader.vue")
    categoryMenuComponent: () =>
      import("~/components/categoryMenuComponent.vue")
  },
  data: function() {
    return {
      incrementBy: 9,
      showMore: 9,
      currentSEO: [],
      tempSEO: null
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getData", { resource: "events" }),
        store.dispatch("LOAD_SEO", { url: "/events" })
      ]);
      return { tempSEO: results[1].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (this.tempSEO) {
      this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
    }
    next();
  },
  created() {
    if (this.tempSEO) {
      this.currentSEO = this.localeSEO(this.tempSEO, this.locale);
    }
  },
  computed: {
    ...mapGetters([
      "property",
      "timezone",
      "processedEvents",
      "findRepoByName",
      "locale"
    ]),
    events() {
      var vm = this;
      var temp_event = [];
      var temp_job = [];
      _.forEach(this.processedEvents, function(value, key) {
        var today = moment().tz(vm.timezone);
        var showOnWebDate = moment(value.show_on_web_date).tz(vm.timezone);
        if (today >= showOnWebDate) {
          value.name_short = _.truncate(value.name, {
            length: 21,
            separator: " "
          });
          value.name_short_2 = _.truncate(value.name_2, {
            length: 21,
            separator: " "
          });
          value.description_short = _.truncate(value.description, {
            length: 60,
            separator: " "
          });
          value.description_short_2 = _.truncate(value.description_2, {
            length: 60,
            separator: " "
          });

          if (_.includes(value.image_url, "missing")) {
            value.image_url =
              "//codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1546551307522/eventplaceholder2@2x.png";
          }
          if (_.includes(value.event_image2_url_abs, "missing")) {
            value.event_image2_url_abs =
              "//codecloud.cdn.speedyrails.net/sites/5daf7e206e6f643cde010000/image/png/1546551307522/eventplaceholder2@2x.png";
          }

          temp_event.push(value);
        }
      });
      _.sortBy(temp_event, [
        function(o) {
          return o.start_date;
        }
      ]);
      return temp_event;
    }
  },
  methods: {
    loadMoreEvents() {
      if (this.showMore <= this.events.length) {
        var num = this.showMore + this.incrementBy;
        this.showMore = num;
      }
    },
    isMultiDay(event) {
      var timezone = this.timezone;
      var start_date = moment(event.start_date)
        .tz(timezone)
        .format("MM-DD-YYYY");
      var end_date = moment(event.end_date)
        .tz(timezone)
        .format("MM-DD-YYYY");
      if (start_date === end_date) {
        return false;
      } else {
        return true;
      }
    }
  }
};
</script>