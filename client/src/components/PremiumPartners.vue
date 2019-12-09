<template>
  <div
    aria-haspopup="true"
    class="list-item pr4 pl4 no-selectable" @click.stop="toggleVisibility">
    <div class="flex align-items-center">
      Our Partners
      <i
        aria-hidden="true"
        class="el-icon-arrow-down icon sm-icon ml1"
      />
    </div>
    <transition
      tag="div"
      enter-active-class="animated faster slideInDown"
      leave-active-class="animated faster slideOutUp"
      mode="out-in"
    >
      <div v-if="isOpen" class="bg-white wrapper pr12 pl12 cursor-regular">
        <h2 class="title">
          Our Partners
        </h2>
        <div class="sponsors-wrapper">
          <template v-for="(item, i) in premium">
            <div
              :key="i"
              @click="setActiveCable(item, 'partners')"
              class="img-wrapper"
            >
              <el-image
                :src="item.logo"
                class="img-sponsor"
                fit="contain"
              />
            </div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { bus } from '../helpers/eventBus'

export default {
  name: 'PremiumPartnersButton',
  data: () => ({
    isOpen: false
  }),
  computed: {
    premium() {
      return this.$store.state.premium
    }
  },
  mounted() {
    window.addEventListener('click', this.handleCloseSheet)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.handleCloseSheet)
  },
  methods: {
    toggleVisibility() {
      this.isOpen = !this.isOpen
    },
    handleCloseSheet() {
      this.isOpen = false
    },
    setActiveCable(cable, option) {
      bus.$emit('close-trustedby')
      this.$emit('item-selected', {
        option,
        id:
          cable.cable_id ||
          cable.org_id ||
          cable.fac_id ||
          cable.ix_id ||
          cable.net_id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/premium-partners-styles.scss';
</style>
