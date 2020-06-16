<template>
  <div class="blog_container">
    <div
      class="page_header"
      v-if="latestPost"
      :style="{ 'background-image': 'linear-gradient(0deg, rgba(0,0,0,0.4), rgba(0,0,0,0.3)), url(' + latestPost.image_url + ')' }"
    >
      <div class="site_container">
        <div class="header_content caps" v-if="latestPost">
          <h1 class="page_header_title">{{latestPost.title}}</h1>
          <p class="header_desc">{{truncate(latestPost.body,100)}}</p>
          <nuxt-link :to="'/blog/' + latestPost.slug" class="contact_btn">
            Read Blog
            <i class="fa fa-angle-right"></i>
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="site_container page_content" id="blog_content_container">
      <div class="row tags_container">
        <div class="col-md-4 tag_container">
          <nuxt-link
            :to="localePath({name : 'blog', query : { type : 'style'}})"
            v-smooth-scroll="{ duration: 1000, offset: 0, container: '#blog_section' }"
          >
            <div class="tag_background" v-lazy:background-image="blogTagStyle.image_url">
              <p class="hvr-underline-from-center">Style</p>
            </div>
          </nuxt-link>
        </div>
        <div class="col-md-4 tag_container">
          <nuxt-link
            :to="localePath({name : 'blog', query : { type : 'beauty'}})"
            v-smooth-scroll="{ duration: 1000, offset: -500, container: '#blog_section' }"
          >
            <div class="tag_background" v-lazy:background-image="blogTagBeauty.image_url">
              <p class="hvr-underline-from-center">Beauty</p>
            </div>
          </nuxt-link>
        </div>
        <div class="col-md-4 tag_container">
          <nuxt-link
            :to="localePath({name : 'blog', query : { type : 'lifestyle'}})"
            v-smooth-scroll="{ duration: 1000, offset: 0, container: '#blog_section' }"
          >
            <div class="tag_background" v-lazy:background-image="blogTagLifeStyle.image_url">
              <p class="hvr-underline-from-center">Lifestyle</p>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div v-if="blogType" class="blog_section_title_container" id="blog_list_section">
        <h2 class="blog_section_title caps">{{blogType}}</h2>
      </div>
      <div class="row">
        <div class="col-md-7" id="blog_section" v-if="filteredBlogs && filteredBlogs.length > 0">
          <div
            v-for="(promo,index) in filteredBlogs"
            :key="promo.id"
            v-if="showMore > index"
            class="blog_container"
          >
            <nuxt-link :to="'/blog/' + promo.slug">
              <div class="blog_image_container" v-lazy-container="{ selector: 'img' }">
                <img
                  v-if="!isMissingImage(promo.image_url)"
                  :data-src="promo.image_url"
                  data-loading="/images/Loading.png"
                  class="event_image image"
                  alt
                />
              </div>
              <div class="blog_dets_container">
                <h4 class="event_name bold" v-if="locale=='fr'">{{promo.title_2}}</h4>
                <h4 class="event_name bold" v-else>{{promo.title}}</h4>
                <p class="event_dates">
                  Posted
                  <span>{{ promo.publish_date | moment("MMMM D, YYYY", timezone)}}</span> by
                  <span>{{ property.name }}</span>
                </p>
                <p>{{truncate(promo.body, 150)}}</p>

                <div class="contact_btn">
                  Read More
                  <i class="fa fa-angle-right"></i>
                </div>
              </div>
            </nuxt-link>
          </div>
          <div class="show_more">
            <div
              class="pointer contact_btn"
              v-if="filteredBlogs && showMore < filteredBlogs.length"
              @click="loadMorePromos()"
            >
              Load More
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
        </div>
        <div id="no_events" class="col-md-7" v-else>
          <p>{{$t("blog_page.no_blog_message")}}</p>
        </div>
        <div class="col-md-5">
          <div class="right_container">
            <div class="follow_us_container top_left_border hidden_phone">
              <span class="section_title">Follow Us</span>
              <social-links class="social_icons"></social-links>
            </div>
            <div
              class="popular_posts top_left_border hidden_phone"
              v-if="featuredPosts && featuredPosts.length > 0"
            >
              <p class="section_title">Featured Posts</p>
              <div v-for="post in featuredPosts" :key="post.id" class="row">
                <nuxt-link :to="'/blog/' + post.slug" class="featured_blog_link">
                  <div class="popular_image col-12" v-lazy:background-image="post.image_url"></div>
                  <div class="col-12">
                    <p class="post_tag caps" v-if="post.categories[0]">{{ post.categories[0] }}</p>
                    <span class="hvr-underline-from-center">
                      <p class="post_title">{{ post.title }}</p>
                    </span>
                    <p class="post_date">
                      {{ post.publish_date | moment("MMMM D, YYYY", timezone) }}
                      <br />by
                      <span>{{ property.name }}</span>
                    </p>
                  </div>
                </nuxt-link>
              </div>
            </div>
            <div class="top_left_border" v-if="archives">
              <p class="section_title">Archives:</p>
            </div>
            <div class="archives_container" v-if="archives">
              <div role="tablist">
                <b-card
                  no-body
                  class="mb-1 top_left_border"
                  v-for="(posts, index) in archives"
                  :key="index"
                >
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button
                      block
                      href="#"
                      v-b-toggle="index"
                      variant="info"
                      class="bold"
                      :class="snakeCase(index)"
                    >
                      {{index}}
                      <i class="fa fa-angle-down"></i>
                    </b-button>
                  </b-card-header>
                  <b-collapse :id="index" visible accordion="my-accordion" role="tabpanel">
                    <b-card-body>
                      <div v-for="(post, i) in posts" :key="i" class="post_section">
                        <nuxt-link :to="'/blog/' + post.slug" class="hvr-underline-from-center">
                          <p class="post_title bold">{{post.title}}</p>
                        </nuxt-link>
                        <p class="post_date">
                          {{ post.publish_date | moment("MMMM D, YYYY", timezone)}}
                          <br />by
                          <span>{{ property.name }}</span>
                        </p>
                      </div>
                    </b-card-body>
                  </b-collapse>
                </b-card>
              </div>
            </div>
            <div class="top_left_border hidden_phone">
              <p class="section_title bold newsletter_title">Sign up for E-Newsletter:</p>
              <div class="blog_newsletter">
                <label for="newsletter_email" style="display:none;">Email</label>
                <input
                  name="newsletter_email"
                  id="newsletter_email"
                  type="email"
                  placeholder="Enter your Email Address"
                  v-model="newsletter_email"
                />
                <nuxt-link
                  class="contact_btn hvr-sweep-to-right"
                  data-i18n="general.submit"
                  :to="'/newsletter?email='+ newsletter_email"
                >
                  <p style="display:none;">Submit</p>
                  <i class="fa fa-angle-right"></i>
                </nuxt-link>
              </div>
              <p class="newsletter_desc" v-if="newsletterBlurb" v-html="newsletterBlurb.body"></p>
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
  transition: "page",
  components: {
    /* SocialLinks: () => import("~/components/socialLinks.vue") */
  },
  data: function() {
    return {
      incrementBy: 3,
      showMore: 3,
      newsletter_email: "",
      filteredBlogs: null,
      blogType: "All Posts",
      newsletterBlurb: ""
    };
  },
  async asyncData({ store, params }) {
    try {
      let results = await Promise.all([
        store.dispatch("getMMData", { resource: "blogs" }),
        store.dispatch("LOAD_SEO", {
          url: "/blog"
        }),
        store.dispatch("LOAD_PAGE_DATA", {
          url: process.env.MM_API_HOST + "/pages/stlaurent-newsletter-sign-up.json"
        })
      ]);
      return {
        tempSEO: results[1].data.meta_data[0],
        newsletterBlurb: results[2].data
      };
    } catch (e) {
      console.log(e.message);
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.$nextTick(function() {
      this.updateBlogList();
    });
    next();
  },
  mounted() {
    this.updateBlogList();
  },
  watch: {
    filteredBlogs() {
      if (!this.filteredBlogs) {
        this.updateBlogList();
      }
    }
  },
  computed: {
    ...mapGetters([
      "property",
      "timezone",
      "findBlogBySlug",
      "findRepoByName",
      "findRepoPostByIdWithId",
      "locale"
    ]),
    blogs() {
      var blogs = this.findBlogBySlug("southlandmall-blog").posts;
      var current_blogs = [];
      var vm = this;
      var today = moment().tz(vm.timezone);

      _.forEach(blogs, function(o) {
        var pub_date = moment(o.publish_date).tz(vm.timezone);
        if (today >= pub_date) {
          if (vm.isMissingImage(o.image_url)) {
            o.image_url = "/images/blog_default_image.png";
          }

          current_blogs.push(o);
        }
      });
      return _.sortBy(current_blogs, ["publish_date", "id"]).reverse();
    },
    sortedBlogs() {
      var blogs = this.blogs;
      return _.slice(
        _.sortBy(blogs, ["publish_date", "id"]).reverse(),
        1,
        blogs.length
      );
    },
    styleBlogs() {
      var blogs = _.filter(this.blogs, function(o) {
        return _.includes(o.categories, "Style");
      });
      return _.sortBy(blogs, ["publish_date", "id"]).reverse();
    },
    beautyBlogs() {
      var blogs = _.filter(this.blogs, function(o) {
        return _.includes(o.categories, "Beauty");
      });
      return _.sortBy(blogs, ["publish_date", "id"]).reverse();
    },
    lifestyleBlogs() {
      var blogs = _.filter(this.blogs, function(o) {
        return _.includes(o.categories, "Lifestyle");
      });
      return _.sortBy(blogs, ["publish_date", "id"]).reverse();
    },
    latestPost() {
      var post = _.head(this.blogs);
      if (this.isMissingImage(post.image_url)) {
        post.image_url = "/images/blog_default_image.jpg";
      }
      return post;
    },
    pageBanner() {
      var pageBanner = null;
      var temp_repo = this.findRepoByName("Blog Banner");
      if (temp_repo && temp_repo.images) {
        pageBanner = temp_repo.images[0];
      } else {
        pageBanner = {};
        pageBanner.image_url = "";
      }
      return pageBanner;
    },
    blogTagStyle() {
      return this.findRepoPostByIdWithId(1683, 52408);
    },
    blogTagBeauty() {
      return this.findRepoPostByIdWithId(1683, 52407);
    },
    blogTagLifeStyle() {
      return this.findRepoPostByIdWithId(1683, 52406);
    },
    featuredPosts() {
      var vm = this;
      var blogs = _.slice(
        _.filter(this.blogs, function(o) {
          if (vm.isMissingImage(o.image_url)) {
            o.image_url = "/images/blog_default_image.jpg";
          }
          return (
            _.includes(o.tag, "featured_post") || _.includes(o.tag, "featured")
          );
        }),
        0,
        3
      );
      return blogs;
    },
    archives() {
      var blogs = this.blogs;
      var vm = this;
      _.forEach(blogs, function(value) {
        value.month = moment
          .tz(value.publish_date, vm.timezone)
          .format("MMMM YYYY");
      });
      return _.groupBy(blogs, blog => blog.month);
    },
    isVisible() {
      index => {
        var name = this.snakeCase(index);
        var button = $("." + name).attr("aria-expanded");
        if (button == "true") {
          return true;
        } else {
          return false;
        }
      };
    }
  },
  methods: {
    loadMorePromos() {
      if (this.showMore <= this.filteredBlogs.length) {
        var num = this.showMore + this.incrementBy;
        this.showMore = num;
      }
    },
    updateBlogList() {
      if (this.$route.query.type == "style") {
        this.filteredBlogs = this.styleBlogs;
        this.scrollTo("blog_list_section");
        this.blogType = "Style";
      } else if (this.$route.query.type == "beauty") {
        this.scrollTo("blog_list_section");
        this.filteredBlogs = this.beautyBlogs;
        this.blogType = "Beauty";
      } else if (this.$route.query.type == "lifestyle") {
        this.scrollTo("blog_list_section");
        this.filteredBlogs = this.lifestyleBlogs;
        this.blogType = "Lifestyle";
      } else {
        this.filteredBlogs = this.sortedBlogs;
        this.blogType = "All Posts";
      }
    },
    scrollTo(refName) {
      var element = $("#blog_list_section");
      var position = 0;
      if (this.windowWidth > 768) {
        position = $(element).offset().top - 160;
      } else {
        position = $(element).offset().top - 200; //element.offsetTop;
      }
      window.scrollTo({
        top: position,
        behavior: "smooth"
      });
    }
  }
};
</script>
