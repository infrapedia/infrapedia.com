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
      class="drawer-wrapper"
    >
      <header
        class="h14 pr4 pl4 pb2 flex justify-content-space-between align-items-center"
        :class="{ dark, light: !dark }"
      >
        <router-link to="/">
          <el-image class="mt2 logo-img" :src="imageURL" fit="scale-down" />
        </router-link>
        <span
          class="inline-block w4 h4 icon mt2 fs-medium p2 transition-all circle vertical-align cursor-pointer"
          @click="toggleVisibility"
        >
          <fa :icon="['fas', 'times']" />
        </span>
      </header>
      <el-collapse
        accordion
        v-model="collapseActive"
        :class="{ dark, light: !dark }"
      >
        <el-collapse-item name="partners" class="pr4 pl4">
          <p slot="title">Our Partners</p>
          <i-list
            class="w-fit-full-imp overflow-y-auto no-overflow-x"
            option="partners"
            @click="emitSelected"
            :is-search-visible="false"
          />
        </el-collapse-item>
      </el-collapse>
      <ul class="links-wrapper m0 mb4 p0" :class="{ dark }">
        <li class="w-fit-full" data-no-outline="true">
          <div class="no-selectable">
            <a
              href="https://blog.infrapedia.com"
              target="_blank"
              class="no-underline inherit color-inherit p4 mr4 inline-block"
            >
              Blog
            </a>
          </div>
        </li>
        <li class="w-fit-full" data-no-outline="true">
          <div class="no-selectable">
            <router-link
              to="/contact"
              class="no-underline inherit color-inherit p4 mr4 inline-block"
            >
              Contact us
            </router-link>
          </div>
        </li>
      </ul>
      <div class="text-center">
        <h2 class="mb10 mt6">
          Sponsors
        </h2>
        <ul class="flex column wrap">
          <li
            class="inline-block relative"
            data-no-outline="true"
            role="listitem"
          >
            <div class="list-item" data-no-hover-bg="true">
              <a :href="sponsors[0].url" target="_blank">
                <el-image
                  :src="sponsors[0].src"
                  class="w46 h14"
                  fit="cover"
                  alt="catchpoint logo"
                  referrer-policy="strict-origin-when-cross-origin"
                />
              </a>
            </div>
          </li>

          <li
            class="inline-block relative mt8"
            data-no-outline="true"
            role="listitem"
          >
            <div class="list-item" data-no-hover-bg="true">
              <a :href="sponsors[1].url" target="_blank">
                <el-image
                  :src="sponsors[1].src"
                  fit="cover"
                  class="w46 h6"
                  alt="ipv4 logo"
                  referrer-policy="strict-origin-when-cross-origin"
                />
              </a>
            </div>
          </li>
          <!-- <li
              class="inline-block relative mt8"
              data-no-outline="true"
              role="listitem"
            >
              <div class="list-item" data-no-hover-bg="true">
                <a href="https://aptelecom.com/" target="_blank">
                  <el-image
                    src="https://cdn.infrapedia.com/sponsors/aptelecom_logo.png"
                    fit="center"
                    class="w46 h18 image-sponsor"
                    alt="aptelecom logo"
                    referrer-policy="strict-origin-when-cross-origin"
                  />
                </a>
              </div>
            </li> -->
        </ul>
      </div>
      <i-footer class="footer relative m0-imp p0-imp" />
    </el-card>
  </transition>
</template>

<script>
import sponsors from '../config/navbarSponsors'
import { CLICK_LIST_ITEM } from '../events/mobiledrawer'
import IFooter from './Footer'
import IList from './List'

export default {
  components: {
    IFooter,
    IList
  },
  data: () => ({
    collapseActive: '',
    sponsors
  }),
  props: {
    visibility: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
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
    toggleVisibility() {
      return this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/scss/components/mobile-drawer-styles.scss';
</style>
