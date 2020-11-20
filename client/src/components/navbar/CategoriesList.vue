<template>
  <div class="main-wrapper">
    <header class="flex row justify-content-space-between pt1 pb1 pr4 pl4 mb2">
      <el-image :src="imageURL" class="w30 mt1" fit="scale-down" lazy />
      <el-button
        size="mini"
        :class="{ dark }"
        class="underline"
        @click.stop="close"
      >
        cancel
      </el-button>
    </header>
    <ul tabindex="-1" role="group" class="mt2 pb2">
      <li
        v-for="item in categoriesList"
        :key="item"
        class="h20 p2 pl4 pr4 flex align-items-center"
        @click.stop="emitSelection(item)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import searchCategories from '../../config/searchCategories'

export default {
  name: 'CategoriesList',
  data: () => ({
    isOpen: false,
    categoriesList: searchCategories
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    imageURL() {
      return this.dark
        ? 'https://cdn1.infrapedia.com/assets/img/dark-mode-logo.svg'
        : 'https://cdn1.infrapedia.com/assets/img/light-mode-logo.svg'
    }
  },
  methods: {
    emitSelection(selection) {
      console.log(selection)
      this.$emit('change', selection)
      this.close()
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/navbar-categories-list-styles.scss';
</style>
