<template>
  <div
    aria-haspopup="true"
    class="list-item pr4 pl4 no-selectable"
    v-click-outside="closeSheet"
  >
    <el-button
      class="drawer-opener fs-small font-regular mt-1"
      type="text"
      :class="{ 'text-white--hsl': dark }"
      @click="toggleVisibility"
    >
      Our Partners
      <i aria-hidden="true" class="el-icon-arrow-down icon sm-icon ml1" />
    </el-button>
    <transition
      tag="div"
      enter-active-class="animated faster slideInDown"
      leave-active-class="animated faster slideOutUp"
      mode="out-in"
    >
      <div
        v-if="isOpen"
        class="wrapper pr12 pl12 cursor-regular"
        :class="{
          'bg-white': !dark,
          'bg-charcoal': dark
        }"
      >
        <h2 class="title" :class="{ 'text-white--imp': dark }">
          Our Partners
        </h2>
        <div class="sponsors-wrapper">
          <template v-for="(item, i) in premium">
            <div
              :key="i"
              @click="setActiveCable({ id: item._id, option: 'organizations' })"
              class="img-wrapper"
            >
              <el-image :src="item.logo" class="img-sponsor" fit="contain" />
            </div>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  name: 'PremiumPartnersButton',
  data: () => ({
    isOpen: false
  }),
  computed: {
    premium() {
      return this.$store.state.premium
    },
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    toggleVisibility() {
      this.isOpen = !this.isOpen
    },
    closeSheet() {
      this.isOpen = false
    },
    setActiveCable(data) {
      this.closeSheet()
      this.$emit('item-selected', data)
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
