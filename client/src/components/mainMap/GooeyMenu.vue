<template>
  <div class="absolute z-index1" id="menuOpener" v-click-outside="closeBoth">
    <el-button
      circle
      class="w11 h11"
      title="Share menu, print map"
      @click="toggleMenu"
    >
      <fa
        :icon="['far', 'hand-point-up']"
        class="icon fs-medium"
        v-if="!isMenuOpen"
      />
      <fa :icon="['fas', 'times']" class="icon fs-medium" v-else />
    </el-button>

    <transition
      name="animated faster3x"
      mode="out-in"
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
    >
      <ul
        v-if="isMenuOpen"
        role="group"
        class="absolute flex justify-content-space-around align-items-center"
      >
        <print-button
          :map="map"
          class="mr2"
          @print-dialog="bool => (isPrintDialog = bool)"
        />
        <li role="listitem">
          <el-button
            title="Share menu"
            type="primary"
            class="w11 h11"
            circle
            @click.stop="toggleGooey"
          >
            <fa :icon="['fas', 'share-alt']" />
          </el-button>
        </li>
      </ul>
    </transition>

    <div
      class="gooey-wrapper z-index1 absolute regular-transition"
      @click.stop="closeGooey"
    >
      <transition
        name="animated faster3x"
        mode="out-in"
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
      >
        <ul
          v-if="isGooeyMenu"
          role="group"
          class="relative regular-transition"
          id="gooeyList"
        >
          <li
            role="listitem"
            class="mb1"
            v-for="(btn, i) in shareLinkButtons"
            :key="i"
          >
            <el-button
              circle
              class="color-inherit w11 h11"
              :class="{ dark }"
              :title="btn.title"
              @click="handleShareLink(btn.func)"
            >
              <fa :icon="btn.icon" class="sm-icon" />
            </el-button>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import * as share from './shareLinks'
import PrintButton from './PrintButton'
import ClickOutside from 'vue-click-outside'
import { shareLinkButtons } from '../../config/shareLinkButtons'

export default {
  components: {
    PrintButton
  },
  data: () => ({
    isMenuOpen: false,
    isGooeyMenu: false,
    isPrintDialog: false
  }),
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  computed: {
    shareLinkButtons() {
      return shareLinkButtons
    },
    dark() {
      return this.$store.state.isDark
    },
    focus() {
      return this.$store.state.map.focus
    }
  },
  methods: {
    async handleShareLink(funcName) {
      const url = await share[funcName](
        await this.$auth.getUserID(),
        window.origin + this.$route.path,
        this.focus && this.focus.name
          ? this.focus.name
          : 'Share view | Infrapedia'
      )
      if (funcName != 'shareViewLink') {
        window.open(url, '_blank')
      }
    },
    closeBoth() {
      if (!this.isPrintDialog) {
        this.isGooeyMenu = false
        this.isMenuOpen = false
      }
    },
    closeGooey() {
      this.isGooeyMenu = false
    },
    toggleGooey() {
      this.isGooeyMenu = !this.isGooeyMenu
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    }
  },
  directives: {
    ClickOutside
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/gooey-menu-styles.scss';
</style>
