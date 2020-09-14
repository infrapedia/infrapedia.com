<template>
  <transition
    tag="div"
    mode="out-in"
    name="animated faster"
    enter-active-class="slideInLeft"
    leave-active-class="slideOutLeft"
  >
    <el-card
      v-if="visibility"
      shadow="hover"
      :class="{ dark, light: !dark }"
      class="drawer-wrapper overflow-y"
    >
      <div class="overflow-y-auto">
        <header
          class="h14 pr4 pl4 pb2 flex justify-content-space-between align-items-center"
          :class="{ dark, light: !dark }"
        >
          <router-link :to="checkIfLoggedIn">
            <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
          </router-link>
          <el-button
            @click="toggleVisibility"
            type="text"
            circle
            :class="{ dark }"
          >
            <fa :icon="['fas', 'times']" />
          </el-button>
        </header>
        <el-collapse
          v-if="!isHomepageDrawer"
          accordion
          v-model="collapseActive"
          :class="{ dark, light: !dark }"
        >
          <el-collapse-item name="partners" class="pr4 pl4">
            <span slot="title" class="underline">Our Partners</span>
            <i-list
              class="w-fit-full-imp overflow-y-auto no-overflow-x"
              option="partners"
              @click="emitSelected"
              :is-search-visible="false"
            />
          </el-collapse-item>
        </el-collapse>
        <ul class="links-wrapper mb6" :class="{ dark }">
          <li class="pr4 pl4 fs-regular" v-for="(link, i) in links" :key="i">
            <a
              v-if="link.tab"
              :href="link.url"
              class="inline-flex no-border-radius align-items-center color-inherit h-fit-full w-fit-full no-outline"
            >
              {{ link.label }}
            </a>
            <!-- <el-collapse v-else-if="link.dropdown">
            <el-collapse-item>
              <span class="el-link fs-regular font-regular" slot="title">
                {{ link.label }}
              </span> -->
            <div v-else-if="link.dropdown" class="dropdown-links">
              <template v-for="dropdownItem in link.dropdown">
                <a
                  v-if="dropdownItem.tab"
                  :href="dropdownItem.url"
                  target="_blank"
                  :key="dropdownItem.url"
                  class="inline-flex no-border-radius align-items-center color-inherit h-fit-full w-fit-full no-outline"
                >
                  {{ dropdownItem.label }}
                </a>
                <el-button
                  v-else
                  plain
                  type="text"
                  :key="dropdownItem.url"
                  class="inline-flex no-border-radius align-items-center color-inherit h-fit-full block no-outline"
                  @click="goToRoute(link.url)"
                  :class="{ dark, light: !dark }"
                >
                  {{ dropdownItem.label }}
                </el-button>
              </template>
            </div>
            <!-- </el-collapse-item>
          </el-collapse> -->
            <template v-else>
              <el-button
                v-if="i == 0"
                plain
                type="text"
                class="inline-flex mt4 no-border-radius align-items-center color-inherit h-fit-full block no-outline"
                @click="goToRoute(link.url)"
                :class="{ dark, light: !dark }"
              >
                {{ link.label }}
              </el-button>
              <el-button
                v-else
                plain
                type="text"
                class="inline-flex no-border-radius align-items-center color-inherit h-fit-full w-fit-full no-outline"
                @click="goToRoute(link.url)"
                :class="{ dark, light: !dark }"
              >
                {{ link.label }}
              </el-button>
            </template>
          </li>

          <div
            class="flex nowrap justify-content-space-between align-items-center mt4 pr4 pl4"
          >
            <li
              class="inline-block relative"
              data-no-outline="true"
              role="listitem"
            >
              <div class="list-item" data-no-hover-bg="true">
                <a :href="sponsors[0].url" target="_blank">
                  <el-image
                    :src="sponsors[0].src"
                    lazy
                    class="w26 image-sponsor"
                    fit="cover"
                    alt="catchpoint logo"
                    referrer-policy="strict-origin-when-cross-origin"
                  />
                </a>
              </div>
            </li>

            <li
              class="inline-block relative"
              data-no-outline="true"
              role="listitem"
            >
              <div class="list-item" data-no-hover-bg="true">
                <a :href="sponsors[2].url" target="_blank">
                  <el-image
                    lazy
                    :src="sponsors[2].src"
                    fit="center"
                    class="w26 mt2 image-sponsor"
                    alt="ipv4 logo"
                    referrer-policy="strict-origin-when-cross-origin"
                  />
                </a>
              </div>
            </li>

            <li
              class="inline-block relative mt-3"
              data-no-outline="true"
              role="listitem"
            >
              <div class="list-item" data-no-hover-bg="true">
                <a :href="sponsors[1].url" target="_blank">
                  <el-image
                    lazy
                    :src="sponsors[1].src"
                    fit="center"
                    class="w26 image-sponsor ipv4"
                    alt="ipv4 logo"
                    referrer-policy="strict-origin-when-cross-origin"
                  />
                </a>
              </div>
            </li>
          </div>
        </ul>
        <i-footer class="footer relative" style="width: 90%; margin: 0;" />
      </div>
    </el-card>
  </transition>
</template>

<script>
import { CLICK_LIST_ITEM } from '../events/mobiledrawer'
import { navbarLinks } from '../config/infoMenuLinks'
import sponsors from '../config/navbarSponsors'
import IFooter from './Footer'
import IList from './List'

export default {
  components: {
    IFooter,
    IList
  },
  data: () => ({
    collapseActive: ''
  }),
  props: {
    visibility: {
      type: Boolean,
      required: true
    },
    isHomepageDrawer: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    sponsors() {
      return sponsors
    },
    links() {
      return navbarLinks
    },
    checkIfLoggedIn() {
      return this.$auth.isAuthenticated ? '/app' : '/'
    },
    imageURL() {
      return this.dark
        ? 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo.svg'
        : 'https://cdn1.infrapedia.com/assets/img/light-mode-logo.svg'
    },
    drawerClass() {
      return this.dark ? 'dark' : 'light'
    }
  },
  methods: {
    async emitSelected(selected) {
      this.$emit(CLICK_LIST_ITEM, selected)
      this.toggleVisibility()
      this.collapseActive = ''
    },
    goToRoute(link) {
      this.toggleVisibility()
      if (this.$route.path != link) this.$router.push(link)
    },
    toggleVisibility() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/components/mobile-drawer-styles.scss';
</style>
