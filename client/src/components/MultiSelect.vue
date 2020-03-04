<template>
  <multiselect
    v-model="selections"
    label="name"
    track-by="_id"
    placeholder
    open-direction="bottom"
    :options="options"
    :multiple="true"
    :searchable="true"
    :loading="loading"
    :internal-search="false"
    :close-on-select="false"
    :options-limit="3000"
    :max-height="600"
    class="v-multiselect el-select"
    style="top: -.2rem; height: 40px;"
    @search-change="$emit('input', $event)"
    @open="() => (isDropdownOpen = true)"
    @close="handleClose"
  >
    <template slot="tag" slot-scope="{ option, remove }">
      <span class="el-tag el-tag--info el-tag--small el-tag--light">
        <span class="el-select__tags-text">{{ option.name }}</span>
        <i class="el-tag__close el-icon-close" @click="remove(option)" />
      </span>
    </template>
    <template slot="caret" slot-scope="{ toggle }">
      <span class="el-input__suffix">
        <span class="el-input__suffix-inner" @click="toggle">
          <i
            class="el-select__caret el-input__icon el-icon-arrow-down transition-all caret"
            :class="{
              active: isDropdownOpen
            }"
          />
        </span>
      </span>
    </template>
    <p class="el-select-dropdown__empty" slot="noResult">No data</p>
    <p class="el-select-dropdown__empty" slot="noOptions">No data</p>
  </multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'

export default {
  name: 'VMultiselect',
  components: {
    Multiselect
  },
  props: {
    value: {
      type: [Array, String],
      default: () => []
    },
    options: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      default: () => 'create'
    }
  },
  data: () => ({
    isDropdownOpen: false,
    selections: []
  }),
  mounted() {
    if (this.mode !== 'create') {
      this.selections = this.value
    }
  },
  methods: {
    handleClose() {
      this.isDropdownOpen = false
      return this.$emit('values-change', this.selections)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/multiselect-styles.scss';
</style>
