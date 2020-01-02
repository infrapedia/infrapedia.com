<template>
  <el-dialog
    :visible="visible"
    width="30%"
    :before-close="handleBeforeClose"
    :close-on-click-modal="false"
  >
    <header slot="title" class="w-fit-full">
      <h1 class="title-user-variant w-fit-full fs-xlarge text-center">
        {{ title }} network
      </h1>
    </header>
    <el-form ref="form" :model="form" class="p2">
      <el-form-item label="Name">
        <el-input class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="Websites">
        <el-tag
          :key="tag"
          v-for="tag in form.websites"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          type="url"
          v-if="inputVisible"
          v-model="tag"
          ref="saveTagInput"
          size="mini"
          @keyup.enter.native="confirmTag"
          @blur="confirmTag"
        />
        <el-button
          v-else
          class="w42 text-center"
          size="small"
          @click="showInput"
        >
          Add
        </el-button>
      </el-form-item>
      <el-form-item label="Organizations">
        <el-select
          multiple
          clearable
          collapse-tags
          filterable
          class="w-fit-full"
          v-model="form.organizations"
          placeholder
        >
          <el-option
            v-for="(opt, i) in []"
            :key="i"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Facilities">
        <el-select
          multiple
          clearable
          collapse-tags
          filterable
          class="w-fit-full"
          v-model="form.facilities"
          placeholder
        >
          <el-option
            v-for="(opt, i) in []"
            :key="i"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Cables">
        <el-select
          multiple
          clearable
          collapse-tags
          filterable
          class="w-fit-full"
          v-model="form.cables"
          placeholder
        >
          <el-option
            v-for="(opt, i) in []"
            :key="i"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Ixps">
        <el-select
          multiple
          clearable
          collapse-tags
          filterable
          class="w-fit-full"
          v-model="form.ixps"
          placeholder
        >
          <el-option
            v-for="(opt, i) in []"
            :key="i"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="CLS">
        <el-select
          multiple
          clearable
          collapse-tags
          filterable
          class="w-fit-full"
          v-model="form.cls"
          placeholder
        >
          <el-option
            v-for="(opt, i) in []"
            :key="i"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="mt12">
        <el-button type="primary" class="mr8" round @click="sendData">
          {{ title }} network
        </el-button>
        <el-button round @click="handleBeforeClose">
          Cancel
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'NetworkForm',
  data: () => ({
    tag: '',
    inputVisible: false
  }),
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: true
    }
  },
  computed: {
    title() {
      return this.mode === 'create' ? 'Create' : 'Edit'
    }
  },
  methods: {
    sendData() {
      this.$emit('send-data')
    },
    handleBeforeClose() {
      this.$emit('close')
    },
    handleClose(tag) {
      this.form.websites.splice(this.form.websites.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      try {
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      } catch (err) {
        console.warn(this.$refs)
        console.error(err)
      }
    },
    confirmTag() {
      let tag = this.tag
      const isTagAlreadyCreated = this.form.websites.includes(tag)
      if (isTagAlreadyCreated) return

      if (tag) this.form.websites.push(tag)
      this.inputVisible = false
      this.tag = ''
    }
  }
}
</script>
