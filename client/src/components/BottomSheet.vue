<template>
  <div
    class="text-center h-fit-full flex align-items-center"
    @click.stop="toggleVisibility"
  >
    <span class="drawer-opener">Trusted by</span>
    <transition
      tag="div"
      enter-active-class="animated faster slideInDown"
      leave-active-class="animated faster slideOutUp"
      mode="out-in"
    >
      <div
        v-if="isOpen"
        class="wrapper flex bg-white h-fit-full w-fit-full pr6 pl6 align-items-center"
      >
        <h1 class="title w34">Trusted by</h1>
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
// import sponsors from '../config/sponsors'
import { bus } from '../helpers/eventBus'
import { getTrustedBy } from '../services/api/organizations'

export default {
  data: () => ({
    sponsors: [],
    isOpen: false
  }),
  mounted() {
    this.loadTrustedBy()
    window.addEventListener('click', this.handleCloseSheet)
    bus.$on('close-trustedby', this.handleCloseSheet)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.handleCloseSheet)
  },
  methods: {
    async loadTrustedBy() {
      const res = await getTrustedBy()
      if (res && res.data && res.data.r) {
        this.sponsors = res.data.r
      }
    },
    loadOrg(data) {
      return this.$emit('item-selected', data)
    },
    toggleVisibility() {
      this.isOpen = !this.isOpen
    },
    handleCloseSheet() {
      this.isOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '../assets/scss/components/bottom-sheet-styles.scss';
@import '../assets/scss/components/premium-partners-styles.scss';
</style>
