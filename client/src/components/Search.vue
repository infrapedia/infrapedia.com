<template>
  <el-popover placement="bottom-start" width="320" trigger="manual" v-model="isResultsVisible">
    <el-card class="p0 no-border" shadow="never">
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
      </ul>
    </el-card>
    <el-input
      class="w60"
      slot="reference"
      placeholder="Search"
      v-model="search"
      @blur="loseFocus"
      @focus="setFocus"
      @input="getQueryData"
    >
      <fa slot="prefix" :icon="['fas', 'search']" class="mt3 ml1" />
      <fa
        v-if="!isFocused"
        slot="suffix"
        :icon="['fas', 'caret-down']"
        class="xsm-icon vertical-align mt3 mr3"
      />
      <fa v-else slot="suffix" :icon="['fas', 'caret-up']" class="xsm-icon vertical-align mt3 mr3" />
      <fa
        slot="suffix"
        :icon="['fas', 'times']"
        class="xsm-icon vertical-align mt3 mr2"
        @click="clearSearch"
      />
    </el-input>
  </el-popover>
</template>

<script>
export default {
  data: () => ({
    search: '',
    isFocused: false,
    searchResults: [],
    isResultsVisible: false
  }),
  methods: {
    handleResultSelect() {
      console.warn('Not done yet')
    },
    getQueryData(querystring) {
      console.warn(querystring, 'Not done yet')
      setTimeout(() => {
        this.isResultsVisible = true
      }, 2000)
    },
    loseFocus() {
      this.isFocused = false
    },
    clearSearch() {
      this.search = ''
      this.isResultsVisible = false
    },
    setFocus() {
      this.isFocused = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/search-styles.scss';
</style>
