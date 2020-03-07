<template>
  <div class="inline-block w-fit-full multi-select">
    <div class="flex row wrap">
      <el-tag
        v-for="(tag, i) in selections"
        :key="i"
        closable
        class="mr1 mb4"
        :title="tag.name"
        :disable-transitions="true"
        @close="handleRemovedItem(tag)"
      >
        {{ tag.name }}
      </el-tag>
      <el-select
        v-if="isInputVisible"
        v-model="selected"
        ref="tagInput"
        filterable
        size="medium"
        :class="{ dark }"
        remote
        :remote-method="handleInputChange"
        placeholder
        :loading="loading"
        @focus="() => (isTagRepeated = false)"
        @change="handleInputConfirm"
        @visible-change="handleInputVisibility"
      >
        <el-option
          v-for="(opt, i) in options"
          :key="i"
          :value="opt"
          :label="opt.name"
        >
          <div>
            <fa :icon="['fas', 'award']" v-if="opt.yours === 1" class="mr1" />
            {{ opt.name }}
          </div>
        </el-option>
      </el-select>
      <el-button
        v-else
        round
        plain
        class="h8"
        size="small"
        @click.stop="toggleInput(true)"
      >
        Add
      </el-button>
    </div>
    <el-alert
      v-if="isTagRepeated"
      title="This selection is already included on the list"
      class="h12 pr2 pl2 pt2 pb2 mb4"
      :closable="false"
    />
  </div>
</template>

<script>
export default {
  name: 'VMultiselect',
  props: {
    value: {
      type: Array,
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
    isMultiple: {
      type: Boolean,
      default: () => true
    },
    mode: {
      type: String,
      default: () => 'create'
    }
  },
  data: () => ({
    selected: null,
    selections: [],
    isTagRepeated: false,
    isInputVisible: false
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  mounted() {
    if (this.mode !== 'create') {
      this.selections = this.value
    }
  },
  methods: {
    handleInputChange(s) {
      return this.$emit('input', s)
    },
    handleRemovedItem(tag) {
      this.selections.splice(
        this.selections.map(opt => opt._id).indexOf(tag._id),
        1
      )
      return this.$emit('remove', tag._id)
    },
    toggleInput(bool) {
      this.isInputVisible = bool
      if (bool) {
        this.$nextTick(() => {
          this.$refs.tagInput.$refs.reference.$refs.input.focus()
        })
      }
    },
    handleInputVisibility(visible) {
      if (!visible) {
        this.toggleInput(false)
        this.selected = null
      }
    },
    handleInputConfirm() {
      const inputValue = this.selected
      const selectedIDs = this.selections.map(opt => opt._id)

      if (inputValue) {
        const isTagRepeated = selectedIDs.includes(inputValue._id)
        if (!isTagRepeated) {
          this.isTagRepeated = false
          this.selections.push(inputValue)
        } else {
          this.isTagRepeated = true
        }
      }
      return this.$emit('values-change', this.selections)
    }
  }
}
</script>
