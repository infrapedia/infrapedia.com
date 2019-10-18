<template>
  <div class="no-overflow">
    <Map />
  </div>
</template>

<script>
import Map from '@/components/Map.vue'

export default {
  name: 'home',
  components: {
    Map
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/home-styles.scss';
</style>
