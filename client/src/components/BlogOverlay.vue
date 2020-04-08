<template>
  <div class="overlay-wrapper">
    <div class="toggler-wrapper">
      <slot name="toggler" />
    </div>
    <transition
      name="animated faster2x"
      enter-active-class="slideInLeft"
      leave-active-class="slideOutLeft"
    >
      <el-card
        v-if="isVisible"
        shadow="hover"
        class="overlay relative overflow-y-auto transition-all"
      >
        <h1 class="font-semibold text-center capitalize fs-xlarge pt4">
          Infrapedia's blog
        </h1>
        <span
          class="h8 w8 vertical-align cursor-pointer gray-hover close-btn transparent"
          @click="$emit('close')"
        >
          <fa :icon="['fas', 'times']" class="sm-icon" />
        </span>
        <el-divider inset />
        <div class="p4 ml5 mt4 mb4" v-loading="loading">
          <a
            v-for="(post, i) in posts"
            :key="i"
            :href="post.link"
            target="_blank"
            class="cursor-pointer inline-block m2"
          >
            <el-card
              size="mini"
              shadow="hover"
              class="box p2 cursor-pointer h42"
            >
              <header class="p2">
                <span class="fs-small inline-block mb4">
                  {{ formatDate(post.modified) }}
                </span>
                <h2 class="m0 fs-medium font-bold">
                  {{ post.title.rendered }}
                </h2>
              </header>
              <div class="flex row nowrap justify-content-space-between">
                <div v-html="post.excerpt.rendered" />
              </div>
            </el-card>
          </a>
        </div>
      </el-card>
    </transition>
  </div>
</template>

<script>
import getBlogPosts from '../services/api/blog'
import { formatDate } from '../helpers/formatDate'

export default {
  data: () => ({
    posts: [],
    formatDate,
    loading: false
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
    async loadBlogPosts() {
      this.loading = true
      const res = await getBlogPosts()
      if (res) this.posts = res
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/blog-overlay-styles.scss';
</style>
