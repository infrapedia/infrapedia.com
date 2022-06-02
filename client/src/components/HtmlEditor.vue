<template>
  <div class="mb4">
    <vue-editor v-model="text" @text-change="handleMessageChange" />
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    VueEditor
  },
  data: () => ({
    text: ''
  }),
  props: {
    reset: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    reset(bool) {
      if (bool) this.text = ''
    }
  },
  methods: {
    handleMessageChange() {
      return this.$emit('msg-change', this.text)
    }
  }
}
</script>

