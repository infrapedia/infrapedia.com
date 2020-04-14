<template>
  <el-header class="fs-small p4 vertical-align pr45 pl48 header">
    <h1 class="logo-title inline-block">
      <router-link :to="checkIfLoggedIn" class="hidden-sm-and-down">
        <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
      </router-link>
      <el-button
        circle
        icon="el-icon-menu"
        class="no-border hidden-md-and-up color-inherit mt1"
        @click="toggleMobileDrawer"
      />
    </h1>
    <el-divider class="transparent" />
    <div class="wrapper-right text-right hidden-sm-and-down">
      <template v-for="(link, i) in links">
        <a
          :key="i"
          :href="link.url"
          v-if="link.tab"
          class="underline-hover mr4"
        >
          {{ link.label }}
        </a>
        <template v-else>
          <router-link
            v-if="i === 0"
            :key="i"
            :to="checkIfLoggedIn"
            class="mr4 underline-hover"
          >
            {{ link.label }}
          </router-link>
          <router-link
            v-else
            :key="i"
            :to="link.url"
            class="mr4 underline-hover"
          >
            {{ link.label }}
          </router-link>
        </template>
      </template>
    </div>
  </el-header>
</template>

<script>
export default {
  data: () => ({
    links: [
      {
        label: 'Home',
        url: '/'
      },
      {
        label: 'Blog',
        url: 'https://infrapedia.com/blog',
        tab: true
      },
      {
        label: 'About us',
        url: '/about'
      },
      {
        label: 'Services',
        url: '/services'
      },
      {
        label: 'Sponsorships',
        url: '/sponsors'
      }
    ]
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    checkIfLoggedIn() {
      return this.$auth.isAuthenticated ? '/app' : '/'
    },
    imageURL() {
      return this.dark
        ? 'https://cdn.infrapedia.com/logos/dark-mode-logo.svg'
        : 'https://cdn.infrapedia.com/logos/light-mode-logo.svg'
    }
  },
  methods: {
    toggleMobileDrawer() {
      this.$emit('toggle-mobile-drawer')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/navbar-homepage-styles.scss';
</style>
