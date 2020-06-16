<template>
  <div class="blog_container blog_dets_container" v-if="currentBlog">
    <div
      class="page_header"
      v-if="currentBlog"
      :style="{ 'background-image': 'linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url(' + currentBlog.image_url + ')' }"
    >
      <div class="site_container">
        <div class="header_content caps" v-if="currentBlog">
          <h1 class="page_header_title">{{currentBlog.title}}</h1>
          <p class="header_desc">
            Posted:
            <span>{{ currentBlog.publish_date | moment("MMMM D, YYYY", timezone)}}</span>
            <br>by
            <span>{{ property.name }}</span>
          </p>
        </div>
      </div>
    </div>
    <div class="site_container">
      <div class="blog_content_container text-left">
        <nuxt-link to="/blog/" class="back_to_list hvr-underline-from-center">
          <span class="promo_back caps">
            <i class="fa fa-angle-left" style="margin-right:10px;"></i>
            {{ $t("blog_page.back_to_blog") }}
          </span>
        </nuxt-link>
        <h3 style="margin: 20px auto 0px;" v-if="locale=='fr'">
          <span class="promo_name">{{currentBlog.title_2}}</span>
        </h3>
        <h3 style="margin: 20px auto 0px;" v-else>
          <span class="promo_name">{{currentBlog.title}}</span>
        </h3>
        <div class="clearfix">
          Posted
          <span>{{ currentBlog.publish_date | moment("MMMM D, YYYY", timezone)}}</span>
          by
          <span>{{ property.name }}</span>
        </div>
        <div class="blog_image_video_container" v-if="currentBlog.video_link">
          <!-- <img v-if="!currentBlog.video_link" v-lazy="currentBlog.image_url" class="image"> -->
          <iframe
            v-if="windowWidth >768"
            width="100%"
            height="600px"
            frameborder="0"
            :src="currentBlog.embedded_url"
          ></iframe>
          <iframe
            v-else-if="windowWidth <=768"
            width="100%"
            height="300px"
            frameborder="0"
            :src="currentBlog.embedded_url"
          ></iframe>
        </div>
        <div class="blog_description">
          <div class="text-left">
            <p v-if="locale=='fr'" v-html="currentBlog.html_body_2"></p>
            <p v-else v-html="currentBlog.html_body"></p>
          </div>
        </div>
        <div class="blog_gallery" v-if="gallery">
          <div class="row gallery_row" v-for="item in gallery" :key="item.id">
            <div class="col-md-3 gallery_image">
              <img class="image" :src="'//mallmaverick.com'+item.photo_url">
            </div>
            <div class="col-md-9">
              <div class="gallery_info">
                <h4>{{item.caption}}</h4>
                <div class="gallery_desc" v-html="item.description"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="blog_caption" v-if="currentBlog.html_caption" v-html="currentBlog.html_caption"></div>
        <!-- <script
          type="text/javascript"
          src="https://platform-api.sharethis.com/js/sharethis.js#property=5cc666dd0ff462001290daee&product=inline-share-buttons"
        ></script>
        <div class="sharethis-inline-share-buttons" style="margin:20px auto;"></div>-->
        <div class="blog_share">
          <social-sharing
            :url="$root.shareURL(currentBlog.slug, 'blog')"
            :title="currentBlog.title"
            :description="currentBlog.body"
            :quote="truncate(currentBlog.body, {'length': 99})"
            :twitter-user="$root.twitterUsername"
            :media="currentBlog.image_url"
            inline-template
          >
            <div class="blog-social-share text-center" style="margin: 15px auto;">
              <div class="social_share">
                <network network="facebook" class="facebook">
                  <i class="fa fa-facebook social_icons" aria-hidden="true"></i>
                </network>
                <network network="twitter" class="twitter">
                  <i class="fa fa-twitter social_icons" aria-hidden="true"></i>
                </network>
                <network network="pinterest" class="pinterest">
                  <i class="fa fa-pinterest social_icons" aria-hidden="true"></i>
                </network>
              </div>
            </div>
          </social-sharing>
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
  data: function() {
    return {
      currentBlog: null,
      storeEvents: null,
      storeHours: null,
      gallery: null
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "blogs" }),
        store.dispatch("LOAD_SEO", {
          url: "/blog"
        }),
        store.dispatch("getMMData", { resource: "fashions" })
      ]);
      return { tempSEO: results[1].data.meta_data[0] };
    } catch (e) {
      console.log(e.message);
    }
  },
  components: {
    // SocialSharing: () => import("vue-social-sharing")
  },
  beforeRouteUpdate(to, from, next) {
    this.updatecurrentBlog(this.$route.params.slug);
    this.events = this.event;
    next();
  },
  created() {
    this.updatecurrentBlog(this.$route.params.slug);
    this.events = this.event;
    this.getGalleries;
  },
  watch: {
    gallery() {
      console.log("gallery", this.gallery);
    }
  },
  computed: {
    ...mapGetters([
      "property",
      "processedEvents",
      "findBlogPostBySlugWithSlug",
      "timezone",
      "findRepoByName",
      "findGalleryBySlug",
      "locale"
    ]),
    allEvents() {
      return this.processedEvents;
    },
    pageBanner() {
      var pageBanner = null;
      var temp_repo = this.findRepoByName("Promos Banner");
      if (temp_repo && temp_repo.images) {
        pageBanner = temp_repo.images[0];
      } else {
        pageBanner = {};
        pageBanner.image_url = "";
      }
      return pageBanner;
    },
    getGalleries() {
      var all_galleries = [];
      var vm = this;
      setTimeout(() => {
        var galleries = document.getElementsByTagName("gallery");
        if (galleries.length > 0) {
          var gallery = [];
          var val = galleries[0];
          var container = $(val);
          var gallery_slug = $(val).attr("source");
          gallery = vm.findGalleryBySlug(gallery_slug);
          if (gallery && gallery.fashion_images) {
            all_galleries = gallery.fashion_images;
            vm.$nextTick(function() {
              vm.gallery = _.sortBy(all_galleries, ["created_at"]);
              console.log("vm.gallery", vm.gallery);
            });
          }
        }
      }, 200);
      return all_galleries;
    }
  },
  methods: {
    updatecurrentBlog(id) {
      this.$nextTick(function() {
        this.currentBlog = this.findBlogPostBySlugWithSlug(
          "coquitlam-blog",
          id
        );
        if (this.currentBlog === null || this.currentBlog === undefined) {
          //   this.$router.replace('/blog')
        } else {
          if (this.currentBlog != null) {
            this.currentBlog.embedded_url =
              "//www.youtube.com/embed/" +
              this.getId(this.currentBlog.video_link) +
              "?rel=0&mute=0";

            if (this.isMissingImage(this.currentBlog.image_url)) {
              this.currentBlog.image_url = "/images/blog_default_image.jpg";
            }
          }
        }
      });
    },
    getId(url) {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      var match = url.match(regExp);

      if (match && match[2].length == 11) {
        return match[2];
      } else {
        return "error";
      }
    }
  }
};
</script>