<template>
  <div :style="sidebarStyleOnMobile">
    <transition
      tag="div"
      mode="out-in"
      :name="transitionsClasses.name"
      :enter-active-class="transitionsClasses.active"
      :leave-active-class="transitionsClasses.leave"
      >
      <div
        v-if="isSidebar"
        :style="sidebarStyle"
        class="sidebar-wrapper"
      >
        <el-card shadow="never" v-loading="isLoading">
          <header class="header pt8 pr8 pl14 pb12 h12">
            <h1 class="title mbold m0 p1 round truncate fs-large underline">
              {{ currentSelection.name }}
            </h1>
            <p><strong> {{ currentSelection.segment_name || '' }} </strong></p>
          </header>
        </el-card>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ISidebar',
  data: () => ({
    sidebarStyleOnMobile: {},
    sidebarStyle: {},
    transitionsClasses: {
      name: 'animated faster',
      active: 'slideInLeft',
      leave: 'slideOutLeft'
    }
  }),
  computed: {
    currentSelection() {
      return this.$store.state.map.currentSelection
    },
    isLoading() {
      return this.$store.state.isLoading
    },
    isSidebar() {
      return this.$store.state.isSidebar
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.resizeWatcher)
    this.resizeWatcher()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeWatcher)
  },
  methods: {
    setFullSidebarHeight() {
      const mobileWidth = 425
      if (window.innerWidth <= mobileWidth) {
        this.sidebarStyleOnMobile = {
          height: '97vh',
          overflowY: 'auto',
          overflowX: 'hidden'
        }
        this.sidebarStyle = { height: '100%', overflow: 'auto' }
      } else {
        this.sidebarStyle = { height: '100%', overflow: 'auto' }
      }
    },
    resizeWatcher() {
      const mobileWidth = 425
      if (window.innerWidth <= mobileWidth) {
        this.transitionsClasses = {
          name: 'animated faster',
          active: 'slideInUp',
          leave: 'zoomOutLeft'
        }
        return true
      } else {
        this.transitionsClasses = {
          name: 'animated faster',
          active: 'slideInLeft',
          leave: 'slideOutLeft'
        }
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/sidebar-styles.scss';
</style>
