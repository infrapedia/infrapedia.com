<template>
  <el-header class="fs-small vertical-align header">
    <div class="hidden-md-and-up flex nowrap mobile-items">
      <el-button
        circle
        :class="{ dark }"
        icon="el-icon-menu"
        class="no-border hidden-md-and-up color-inherit mt1"
        @click.stop="toggleMobileDrawer"
      />
      <div class="logo-link flex">
        <router-link :to="checkIfLoggedIn">
          <el-image
            class="mt2 logo-img"
            :src="imageURL"
            fit="scale-down"
            lazy
          />
        </router-link>
      </div>
    </div>

    <div class="hidden-md-and-down w-fit-full flex nowrap align-items-center">
      <router-link
        :to="checkIfLoggedIn"
        class="hidden-sm-and-down logo-title inline-block"
      >
        <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" lazy />
      </router-link>

      <el-divider class="transparent" />
      <div class="wrapper-right text-right hidden-sm-and-down">
        <template v-for="(link, i) in links">
          <a
            v-if="link.tab"
            :key="i"
            :href="link.url"
            class="underline-hover mr4"
          >
            {{ link.label }}
          </a>
          <el-dropdown v-else-if="link.dropdown" :key="`${i}`">
            <span class="el-link mr4 font-regular fs-small">
              {{ link.label }}
              <i aria-hidden="true" class="el-icon-arrow-down ml1 fs-small" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="dropdownItem in link.dropdown"
                :key="dropdownItem.url"
              >
                <a
                  v-if="dropdownItem.tab"
                  :href="dropdownItem.url"
                  target="_blank"
                  class="underline-hover"
                >
                  {{ dropdownItem.label }}
                </a>
                <router-link
                  v-else
                  :to="dropdownItem.url"
                  class="underline-hover"
                >
                  {{ dropdownItem.label }}
                </router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <template v-else>
            <!-- <router-link
              v-if="i == 0"
              :key="i"
              :to="checkIfLoggedIn"
              class="mr4 underline-hover"
            >
              {{ link.label }}
            </router-link> -->
            <!-- v-else -->
            <router-link :key="i" :to="link.url" class="mr4 underline-hover">
              {{ link.label }}
            </router-link>
          </template>
        </template>
      </div>
    </div>
  </el-header>
</template>

<script>
import { navbarLinks } from '../../config/infoMenuLinks'

export default {
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    links() {
      return navbarLinks
    },
    checkIfLoggedIn() {
      return this.$auth.isAuthenticated ? '/' : '/'
    },
    imageURL() {
      return this.dark
        ? 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo.svg'
        : 'https://cdn1.infrapedia.com/assets/img/light-mode-logo.svg'
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
