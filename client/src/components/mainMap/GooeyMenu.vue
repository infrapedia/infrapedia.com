<template>
  <div
    class="gooey-wrapper z-index1 absolute regular-transition"
    @click.stop="activeGooeyMenu"
    :class="{ active: isActiveGooeyMenu }"
  >
    <ul role="group" class="relative regular-transition" id="gooeyList">
      <li
        role="listitem"
        class="mb1"
        v-for="(btn, i) in shareLinkButtons"
        :key="i"
      >
        <el-button
          circle
          class="color-inherit w11 h11"
          @click="handleShareLink(btn.func)"
          :class="{ dark }"
        >
          <fa :icon="btn.icon" class="sm-icon" />
        </el-button>
      </li>
      <li role="listitem" class="mb1">
        <el-button
          circle
          class="color-inherit w11 h11"
          @click.stop="activeGooeyMenu"
          :class="{ dark }"
        >
          <fa :icon="['fas', 'times']" class="sm-icon" />
        </el-button>
      </li>
    </ul>
  </div>
</template>

<script>
import * as share from './shareLinks'
import { shareLinkButtons } from '../../config/shareLinkButtons'

export default {
  data: () => ({
    shareLinkButtons,
    isActiveGooeyMenu: false
  }),
  computed: {
    userID() {
      return this.$auth.user.sub || ''
    },
    dark() {
      return this.$store.state.isDark
    }
  },
  methods: {
    activeGooeyMenu() {
      this.isActiveGooeyMenu = !this.isActiveGooeyMenu
      if (this.isActiveGooeyMenu) return this.$emit('active')
    },
    async handleShareLink(funcName) {
      return await share[funcName](this.userID)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/gooey-menu-styles.scss';
</style>