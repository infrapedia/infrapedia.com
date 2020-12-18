<template>
  <div
    aria-haspopup="true"
    class="text-center h-fit-full flex align-items-center"
    v-click-outside="closeSheet"
  >
    <el-button
      type="text"
      :class="{ 'text-white--hsl': dark }"
      class="drawer-opener fs-small font-regular mt-1"
      @click="toggleVisibility"
    >
      Trusted by
      <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon" />
    </el-button>
    <transition
      tag="div"
      enter-active-class="animated faster slideInDown"
      leave-active-class="animated faster slideOutUp"
      mode="out-in"
    >
      <div
        v-if="isOpen"
        :class="{
          'bg-white': !dark,
          'bg-charcoal': dark
        }"
        class="wrapper flex bg-white h-fit-full w-fit-full pr6 pl6 align-items-center"
      >
        <h1 class="title w34" :class="{ 'text-white--imp': dark }">
          Trusted by
        </h1>
        <el-button
          icon="el-icon-close"
          circle
          class="absolute no-border"
          style="top: 2rem; right: 12rem;"
          @click="toggleVisibility"
        />
        <div class="sponsors-wrapper">
          <div class="img-wrapper" v-for="(img, i) in sponsors" :key="i">
            <el-image
              :src="img.logo"
              fit="scale-down"
              class="img-sponsor w20 h16 no-selectable"
              @click="loadOrg({ id: img._id, option: 'organizations' })"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { getTrustedBy } from '../../services/api/organizations'
import ClickOutside from 'vue-click-outside'

export default {
  data: () => ({
    sponsors: [],
    isOpen: false
  }),
  async mounted() {
    await this.loadTrustedBy()
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    async loadTrustedBy() {
      const res = await getTrustedBy()
      if (res && res.data && res.data.r) {
        this.sponsors = res.data.r
      }
    },
    loadOrg(data) {
      this.$emit('item-selected', data)
    },
    toggleVisibility() {
      this.isOpen = !this.isOpen
    },
    closeSheet() {
      this.isOpen = false
    }
  },
  directives: {
    ClickOutside
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/premium-partners-styles.scss';
</style>
