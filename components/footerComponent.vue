<template>
  <div>
    <div class="container footer">
      <div class="row">
        <div class="subscribe-section col-12">
          <div class="subscribe-button">
            <div class="btn">Subscribe</div>
          </div>
          <div class="subscribe-text">
            <p>Promos & Offers, Events, News & Much More!</p>
          </div>
          <div class="shopping-hours-btn">
            <div class="btn">Shopping Hours</div>
          </div>
          <div class="social-links">
            <div class="icons">
              <i class="fa fa-facebook-square"></i>
              <i class="fa fa-instagram"></i>
              <i class="fa fa-youtube"></i>
            </div>
          </div>
          <div class="subscribe-text" style="margin-top: 1rem">
            <p>Follow Us on Social Media</p>
          </div>
        </div>
      </div>
      <hr/>
      <div class="row">
          <div class="footer-links col-12">
            <div class="footer_property_dets text-left col-3">
              {{property.name}}
              <p>
                {{ property.address1 }},
                <br />
                {{ property.city }}, {{ property.province_state }} {{ property.postal_code }}
              </p>
              <p class="phone">{{ property.contact_phone }}</p>
            </div>
            <div class="col-2 menu-links">
              <div class="menu-header">
                <p>Shop</p>
              </div>
              <div class="menu-list">
                <p><nuxt-link to="/stores">Stores Directory</nuxt-link></p>
              </div>
              <div class="menu-list">
                <p><nuxt-link to="/stores?type=newstores">New Stores</nuxt-link></p>
              </div>
              <div class="menu-list">
                <p><nuxt-link to="/promotions">Promotion</nuxt-link></p>
              </div>
            </div>
            <div class="col-2 menu-links">
              <div class="menu-header">
                <p>Dine</p>
              </div>
              <div class="menu-list">
                <p>Restaurants</p>
              </div>
              <div class="menu-list">
                <p>Cafes</p>
              </div>
              <div class="menu-list">
                <p>Fast Food</p>
              </div>
            </div>
            <div class="col-1 menu-links">
              <div class="menu-header">
                <p><nuxt-link to="/events">Events</nuxt-link></p>
              </div>
            </div>
            <div class="col-1 menu-links">
              <div class="menu-header">
                <p><nuxt-link to="/news">News</nuxt-link></p>
              </div>
            </div>
            <div class="col-1 menu-links">
              <div class="menu-header">
                <p>Services</p>
              </div>
            </div>
            <div class="col-2 menu-links">
              <div class="menu-header">
                <p>About</p>
              </div>
              <div class="menu-list">
                <p>About Us</p>
              </div>
              <div class="menu-list">
                <p><nuxt-link to="/jobs">Careers</nuxt-link></p>
              </div>
              <div class="menu-list">
                <p>Contests</p>
              </div>
            </div>
          </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <div class="row">
          <div class="footer-links col-12">
            <div  style="text-align: left">Mall Maverick {{copyright_year}}</div>
            <div style="text-align: center">
              <p>
                <a href target="_blank">{{$t("footer.privacy_policy")}}</a>
                <span>|</span>
                <a href target="_blank">{{$t("footer.terms_of_use")}}</a>
                <span>|</span>
                <a href target="_blank">{{$t("footer.disclaimer")}}</a>
              </p>
            </div>
            <div style="text-align: right">
              <p>
                <span>
                  {{$t("footer.powered_by")}}
                  <a
                    href="//www.mallmaverick.com"
                    target="_blank"
                  >Mall Maverick</a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import tz from "moment-timezone";

export default {
  data: function data() {
    return {
    };
  },
  props: ["menu_items", "footer_sub_menu"],
  components: {
    //SocialLinks: () => import('~/components/propertySocialLinks.vue')
  },
  created() {
    this.$nextTick(function() {
    });
  },
  computed: {
    ...mapGetters(["route", "property", "timezone", "getPropertyHours"]),
    exploreMenu() {
      var menu_items = this.menu_items;
      return _.slice(menu_items, 0, 4);
    },
    hoursMenu() {
      var menu_items = this.menu_items;
      var sub_menu = [];
      _.forEach(menu_items, function(value, key) {
        if (_.includes(value.id, "hours")) {
          var sub_menu_items = value.sub_menu;
          _.forEach(sub_menu_items, function(value, key) {
            sub_menu.push(value);
          });
        }
      });
      if (sub_menu) {
        return sub_menu;
      }
    },
    conciergeMenu() {
      var menu_items = this.menu_items;
      var sub_menu = [];
      _.forEach(menu_items, function(value, key) {
        if (_.includes(value.id, "concierge")) {
          var sub_menu_items = value.sub_menu;
          _.forEach(sub_menu_items, function(value, key) {
            sub_menu.push(value);
          });
        }
      });
      if (sub_menu) {
        return sub_menu;
      }
    },
    getHours() {
      return _.filter(this.getPropertyHours, function(o) {
        return o.day_of_week == 1;
      });
    },
    copyright_year() {
      return moment().year();
    },
  },
  beforeDestroy: function() {
  }
};
</script>
