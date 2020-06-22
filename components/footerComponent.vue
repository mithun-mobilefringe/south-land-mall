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
          <div class="social-links d-none d-sm-block">
            <div class="icons">
              <i class="fa fa-facebook-square"></i>
              <i class="fa fa-instagram"></i>
              <i class="fa fa-youtube"></i>
            </div>
          </div>
          <div class="subscribe-text d-none d-sm-block" style="margin-top: 1rem">
            <p>Follow Us on Social Media</p>
          </div>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="footer-links col-12">
          <div class="footer_property_dets text-left col-6 col-sm-3">
            {{property.name}}
            <p>
              {{ property.address1 }},
              <br />
              {{ property.city }}, {{ property.province_state }} {{ property.postal_code }}
            </p>
            <p class="phone">{{ property.contact_phone }}</p>
          </div>
          <div class="col-9 menu-links d-none d-sm-block">
            <div
              class="col-2 menu-header"
              v-for="menulist in footer_menu_list"
              :key="menulist.index"
            >
              <p v-if="menulist.submenus">{{menulist.name}}</p>
              <p v-else>
                <nuxt-link :to="menulist.link">{{menulist.name}}</nuxt-link>
              </p>
              <div v-if="menulist.submenus" class="menu-list">
                <div v-for="menu in menulist.submenus" :key="menu.index">
                  <p>
                    <nuxt-link :to="menu.link">{{menu.name}}</nuxt-link>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="social-links d-sm-none col-6">
            <div class="icons">
              <i class="fa fa-facebook-square"></i>
              <i class="fa fa-instagram"></i>
              <i class="fa fa-youtube"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <div class="row">
          <div class="footer-links col-12 d-none d-sm-block">
            <div style="text-align: left">Mall Maverick {{copyright_year}}</div>
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
          <div class="footer-links col-12 d-sm-none">
            <div style="text-align: left">
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
            <div style="text-align-right">CopyRight {{copyright_year}}@</div>
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
      footer_menu_list: [
        {
          name: "Shop",
          link: "",
          submenus: [
            {
              name: "Stores Directory",
              link: "/stores"
            },
            {
              name: "New Stores",
              link: "/stores"
            },
            {
              name: "Promotions",
              link: "/promotions"
            }
          ]
        },
        {
          name: "Dine",
          link: "",
          submenus: [
            {
              name: "Restaurants",
              link: "/dine"
            },
            {
              name: "Cafes",
              link: "/stores"
            },
            {
              name: "Fast Food",
              link: "/promotions"
            }
          ]
        },
        { name: "Events", link: "/events" },
        { name: "News", link: "/news" },
        { name: "Services", link: "/services" },
        {
          name: "About",
          link: "",
          submenus: [
            {
              name: "ABOUT US",
              link: "/"
            },
            {
              name: "CAREERS",
              link: "/jobs"
            },
            {
              name: "CONTESTS",
              link: "/"
            }
          ]
        }
      ]
    };
  },
  props: ["menu_items", "footer_sub_menu"],
  components: {
    //SocialLinks: () => import('~/components/propertySocialLinks.vue')
  },
  created() {
    this.$nextTick(function() {});
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
    }
  },
  beforeDestroy: function() {}
};
</script>
