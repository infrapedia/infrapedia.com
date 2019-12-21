<template>
  <header class="header fixed h12 w-full p0 bottom-shadow">
    <div class="flex justify-content-space-between  pr20 pl20">
      <h1 class="logo-title hidden-md-and-down">
        <router-link to="/">
          <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
        </router-link>
      </h1>

      <div class="pr2 pl2">
        <ul class="p0 m0 h-fit-full" role="group">
          <li
            class="inline-block relative hidden-sm-and-down"
            data-no-outline="true"
            role="listitem"
          >
            <div class="list-item pr3 pl3">
              <strong class="fs-small">
                Write a post
              </strong>
            </div>
          </li>
          <li
            class="inline-block relative hidden-sm-and-down"
            data-no-outline="true"
            role="listitem"
          >
            <router-link to="/" class="list-item pr1 pl1">
              <fa :icon="['fas', 'map']" class="sm-icon mr2" /> Map
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </header>
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
@import '../../assets/scss/components/blog/navbar-styles.scss';
</style>
