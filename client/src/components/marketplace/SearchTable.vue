<template>
  <div class="main-wrapper m0">
    <el-input
      v-model="search"
      placeholder="Search marketplace listings"
      class="mb4 w116 search"
    >
      <fa slot="prefix" :icon="['fas', 'search']" class="mt3 ml1" />
    </el-input>
    <div class="mt6" v-for="(listitem, i) in listItems" :key="i">
      <strong>
        <p class="blue m0 mb1">
          {{ listitem.name }}
        </p>
      </strong>
      <el-divider class="m0" />
      <p
        class="m0 mt2 mk-text cursor-pointer"
        v-for="(item, index) in listitem.items"
        :key="index"
        @click="setFilter(item.name)"
      >
        {{ item.name }} ({{ item.quantity }})
      </p>
    </div>
  </div>
</template>

<script>
import { searchTableItems } from '../../mokedData/searchTableItems.js'

export default {
  data: () => ({
    search: '',
    listItems: searchTableItems
  }),
  methods: {
    setFilter(selection) {
      return console.warn('Not done yet', selection)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/marketplace/search-table-styles.scss';
</style>
