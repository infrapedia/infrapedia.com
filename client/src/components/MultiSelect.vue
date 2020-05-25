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
            <fa :icon="['fas', 'award']" v-if="opt.yours == 1" class="mr1" />
            {{ opt.name }}
          </div>
        </el-option>
      </el-select>
      <el-button
        v-else
        round
        plain
        class="h8"
        :class="{ 'border-red-imp': isRequired && isFieldEmpty }"
        size="small"
        @click.stop="toggleInput(true)"
      >
        Add
      </el-button>
      <!-- <div v-if="isRequired && isFieldEmpty" class="el-form-item__error">
        This field is required
      </div> -->
    </div>
    <el-alert
      v-if="isTagRepeated"
      center
      title="This selection is already included on the list"
      class="h20 text-center w-fit-full pr2 pl2 pt2 pb2 mb4"
      :closable="false"
    />
  </div>
</template>

<script>
import debounce from '../helpers/debounce'

export default {
  name: 'VMultiselect',
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
    isMultiple: {
      type: Boolean,
      default: () => true
    },
    getSelectedId: {
      type: Boolean,
      default: () => false
    },
    isRequired: {
      type: Boolean,
      default: () => false
    },
    isFieldEmpty: {
      type: Boolean,
      default: () => false
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
  watch: {
    mode(mode) {
      if (mode != 'create' && this.value.length > 0) {
        this.selections = this.value
      }
    },
    value(arr) {
      if (this.mode != 'create' && arr.length > 0) {
        this.selections = arr
      }
    }
  },
  mounted() {
    if (this.mode != 'create') {
      this.selections = this.value
    }
  },
  methods: {
    handleInputChange: debounce(function(s) {
      if (s.length <= 3) return
      else return this.$emit('input', s)
    }, 320),
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
    emitInputValue(multiple) {
      let value = null
      {
        if (multiple || !this.getSelectedId) value = this.selections
        else if (this.getSelectedId) value = this.selected._id
      }

      if (multiple) return value
      else return this.$emit('values-change', value)
    },
    handleInputConfirm() {
      const inputValue = this.selected
      const selectedIDs = this.selections.map(opt => opt._id)

      if (inputValue) {
        const isTagRepeated = selectedIDs.includes(inputValue._id)
        if (isTagRepeated) {
          this.isTagRepeated = true
          return
        }
        this.isTagRepeated = false

        if (!this.isMultiple) {
          if (this.selections.length > 0) {
            this.selections = []
          }
          this.selections.push(inputValue)
          return this.emitInputValue()
        }
        this.selections.push(inputValue)
      }

      return this.emitInputValue()
    }
  }
}
</script>
