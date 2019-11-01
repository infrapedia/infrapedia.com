<template>
  <el-popover trigger="click">
    <div class="w120 no-border no-outline">
      <div class="w-fit-full p4">
        <el-input
          class="w110"
          placeholder="Search"
          :class="{ dark }"
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
          <fa
            v-else
            slot="suffix"
            :icon="['fas', 'caret-up']"
            class="xsm-icon vertical-align mt3 mr3"
          />
          <fa
            slot="suffix"
            :icon="['fas', 'times']"
            class="xsm-icon vertical-align mt3 mr2"
            @click="clearSearch"
          />
        </el-input>
      </div>

      <ul role="list" tabindex="1" class="no-outline">
        <template v-for="(option, i) in optionsGiver">
          <li
            :key="i"
            role="listitem"
            class="pt7 pb7 pr5 pl5 cursor-pointer seamless-hoverbg"
            :class="{ dark, light: !dark }"
          >
            {{ option.name || 'Placeholder' }}
          </li>
          <el-divider :key="i + ' ' + option.name" class="m0" />
          <el-button
            v-if="isFinal(i)"
            :loading="isLoading"
            :key="option.name + ' ' + i"
            class="w-fit-full p4 h20 no-border seamless-hoverbg"
            @click="$emit('load-more-items', option)"
          >
            Load more
          </el-button>
        </template>
      </ul>
    </div>
    <div slot="reference" class="w-fit-full h-fit-full no-outline no-selectable">
      <slot name="reference" />
    </div>
  </el-popover>
</template>

<script>
export default {
  name: 'IListView',
  props: {
    option: {
      type: String,
      required: true
    }
  },
  data: () => ({
    search: '',
    isFocused: false,
    isResultsVisible: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    isLoading() {
      return this.$store.state.isLoading
    },
    optionsGiver() {
      return 20
    }
  },
  methods: {
    isFinal(num) {
      return num + 1 === this.optionsGiver
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
@import '../assets/scss/components/list-view-styles.scss';
</style>
