<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title">
        Create facility
      </h1>
    </header>
    <el-form ref="form" :model="form">
      <el-form-item label="Name">
        <el-input class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="System length">
        <el-input-number
          :min="0"
          class="w-fit-full"
          controls-position="right"
          v-model="form.system_length"
        />
      </el-form-item>
      <el-form-item label="Point">
        <el-input class="w-fit-full" v-model="form.point" />
      </el-form-item>
      <el-form-item label="Address">
        <el-input class="w-fit-full" v-model="form.address" />
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
          @input="validateURL"
          @keyup.enter.native="confirmTag"
          @blur="confirmTag"
        />
        <el-alert
          v-if="isURLValid !== null && !isURLValid"
          title="This url is not valid"
          type="danger"
        />
        <el-button
          v-else
          class="w42 text-center"
          size="small"
          @click="showInput"
        >
          Add url
        </el-button>
      </el-form-item>
      <el-form-item>
        <dragger />
      </el-form-item>
      <el-form-item class="mt12">
        <el-button type="primary" class="w-fit-full" round @click="sendData">
          Create and start drawing
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Dragger from '../../components/Dragger'
import validateUrl from '../../helpers/validateUrl'

export default {
  name: 'FacsForm',
  components: {
    Dragger
  },
  data: () => ({
    tag: '',
    isURLValid: null,
    inputVisible: false
  }),
  props: {
    form: {
      type: Object,
      required: true
    }
  },
  methods: {
    sendData() {
      return this.$emit('send-data')
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
        console.error(err)
      }
    },
    validateURL(url) {
      this.isURLValid = validateUrl(url)
    },
    confirmTag() {
      let tag = this.tag
      const isTagAlreadyCreated = this.form.websites.includes(tag)
      if (isTagAlreadyCreated || !this.isURLValid) return

      if (tag) this.form.websites.push(tag)
      this.inputVisible = false
      this.isURLValid = null
      this.tag = ''
    }
  }
}
</script>
