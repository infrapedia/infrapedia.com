<template>
  <div class="overlay-wrapper">
    <slot name="toggler" />
    <transition
      name="animated faster2x"
      enter-active-class="heightIn"
      leave-active-class="heightOut"
    >
      <el-card
        shadow="hover"
        class="overlay text-center overflow-y-auto relative p4 transition-all"
        v-if="isVisible"
      >
        <h1 class="font-semibold capitalize fs-xlarge mb4">
          Infrapedia's recent news
        </h1>
        <div>
          <el-card
            v-for="i in 20"
            :key="i"
            size="mini"
            shadow="never"
            class="box p2 mb1 cursor-pointer h20"
          >
            {{ i }}
          </el-card>
        </div>
      </el-card>
    </transition>
  </div>
</template>

<script>
export default {
  data: () => ({
    posts: []
  }),
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    isVisible(bool) {
      if (bool && !this.posts.length) {
        this.loadBlogPosts()
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    handleClickOutside(e) {
      e.stopPropagation()
      this.$emit('close')
    },
    loadBlogPosts() {
      return console.warn('not done yet')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/blog-overlay-styles.scss';
</style>
