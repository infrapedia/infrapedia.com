<template>
  <el-container class="vph-full w-fit-full overflow-y-auto no-overflow-x">
    <el-header
      class="w-fit-full flex justify-content-space-between bottom-shadow"
    >
      <h1 class="inline-block logo-title">
        <router-link to="/">
          <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
        </router-link>
      </h1>
      <div class="mt2">
        <el-button type="text" class="mr8">
          Login
        </el-button>
        <el-button type="primary">
          Create an account
        </el-button>
      </div>
    </el-header>
    <transition name="fade" mode="out-in" tag="div"><router-view /></transition>
  </el-container>
</template>

<script>
export default {
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    imageURL() {
      return this.dark
        ? 'https://cdn.infrapedia.com/logos/dark-mode-logo.svg'
        : 'https://cdn.infrapedia.com/logos/light-mode-logo.svg'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/layouts/dashboard-styles.scss';
</style>
