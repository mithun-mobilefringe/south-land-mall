<template>
  <div
    v-if="property && (property.alert_display_type !== 'none')"
    class="alert-container"
    :class="{'warning': property.alert_display_type == 'warning', 'danger': property.alert_display_type == 'danger'}"
  >
    <div class="container">
      <h1 v-if="property.alert_title">{{property.alert_title}}</h1>
      <div v-if="property.alert_message" class="page-body" v-html="property.alert_message"></div>
    </div>
  </div>
</template>
<style scoped>
.alert-container {
  padding: 30px 20px 14px;
  text-align: center;
}
.page-body p {
  margin-bottom: 0;
}
.warning {
  background-color: #ffbc67;
  /* color: #fff; */
}
.danger {
  background-color: #fc727a;
}
</style>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['property'])
  }
}
</script>
