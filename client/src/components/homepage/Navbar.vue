<template>
  <el-header class="fs-small p4 vertical-align header">
    <h1 class="logo-title inline-block">
      <router-link :to="checkIfLoggedIn" class="hidden-sm-and-down">
        <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
      </router-link>
      <el-button
        circle
        :class="{ dark }"
        icon="el-icon-menu"
        class="no-border hidden-md-and-up color-inherit mt1"
        @click.stop="toggleMobileDrawer"
      />
    </h1>
    <el-divider class="transparent" />
    <div class="wrapper-right text-right hidden-sm-and-down">
      <template v-for="(link, i) in links">
        <a
          v-if="link.tab"
          :key="i"
          :href="link.url"
          target="_blank"
          class="underline-hover mr4"
        >
          {{ link.label }}
        </a>
        <el-dropdown v-else-if="link.dropdown" :key="i">
          <span class="el-link mr4 font-regular fs-small">
            {{ link.label }}
            <i aria-hidden="true" class="el-icon-arrow-down ml1 fs-small" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="dropdownItem in link.dropdown"
              :key="dropdownItem.url"
            >
              <router-link :to="dropdownItem.url" class="underline-hover">
                {{ dropdownItem.label }}
              </router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <template v-else>
          <router-link
            v-if="i == 0"
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
        label: 'Map',
        url: '/app'
      },
      {
        label: 'Blog',
        url: 'https://blog.infrapedia.com',
        tab: true
      },
      {
        label: 'About',
        dropdown: [
          {
            label: 'Our team',
            url: '/about'
          },
          {
            label: 'Advisory Board',
            url: '/advisory-board'
          }
        ]
      },
      {
        label: 'Services',
        url: '/services'
      },
      {
        label: 'Sponsorships',
        url: '/sponsors'
      },
      {
        label: 'Contact Us',
        url: '/contact'
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
@import '../../assets/scss/components/homepage/navbar-homepage-styles.scss';
</style>
