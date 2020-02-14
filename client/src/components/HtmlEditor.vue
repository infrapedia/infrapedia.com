<template>
  <div class="mb4">
    <vue-editor v-model="content"></vue-editor>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor
  },
  data: () => ({
    content: ''
  })
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/html-editor-styles.scss';
</style>
