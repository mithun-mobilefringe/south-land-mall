<template>
  <div v-masonry transition-duration="0.3s" item-selector=".grid-item">
    <div v-masonry-tile class="item">
      <div
        v-for="feature in feature_items"
        :class="'grid-item ' + feature.masonry_class "
        :key="feature.name"
      >
        <nuxt-link v-if="feature.url" :to="feature.url">
          <div v-if="feature.name" class="feature_item_container">
            <img :src="feature.image_url" alt>
            <div class="feature_item_info">
              <div class="feature_item_content">
                <h3 v-if="locale=='fr'">{{feature.name_2}}</h3>
                <h3 v-else>{{feature.name}}</h3>
              </div>
            </div>
          </div>
          <div v-else class="feature_item_container">
            <a :href="feature.url">
              <img :src="feature.image_url" :alt="feature.name">
            </a>
          </div>
        </nuxt-link>
        <div v-else>
          <div class="feature_item_container">
            <img :src="feature.image_url" :alt="feature.name">
            <div class="feature_item_info">
              <div class="feature_item_content">
                <h3 v-if="locale=='fr'">{{feature.name_2}}</h3>
                <h3 v-else>{{feature.name}}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  transition: "page",
  props: ["feature_items", "locale"]
};
</script>