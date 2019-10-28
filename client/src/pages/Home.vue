<template>
  <div class="no-overflow">
    <Map @drawing="handleIsDrawing" @title-by-selection="title = $event" />
    <div v-show="isDrawing" class="absolute calculation-box truncate w44 h22 p1 text-center">
      <h4 class="mt2 mb2 font-medium">{{ title }}</h4>
      <div id="calculated-area" class="font-medium fs-regular" />
    </div>
  </div>
</template>

<script>
import Map from '@/components/Map.vue'
import { IS_DRAWING } from '../store/actionTypes'

export default {
  name: 'home',
  components: {
    Map
  },
  data: () => ({
    title: ''
  }),
  computed: {
    isDrawing() {
      return this.$store.state.isDrawing
    }
  },
  methods: {
    handleIsDrawing(bool) {
      this.$store.commit(`${IS_DRAWING}`, bool)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/home-styles.scss';
</style>
