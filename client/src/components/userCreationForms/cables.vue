<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title">
        Create cable
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
      <el-form-item label="Activation date">
        <el-date-picker
          class="w-fit-full-imp"
          v-model="form.activationDateTime"
        />
      </el-form-item>
      <el-form-item label="URL(s)">
        <el-tag
          :key="tag"
          v-for="tag in form.urls"
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
          Add url
        </el-button>
      </el-form-item>
      <el-form-item label="Terrestrial">
        <el-radio-group v-model="form.terrestrial">
          <el-radio :label="true">
            Yes
          </el-radio>
          <el-radio :label="false">
            No
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Tbps capacity">
        <el-input-number
          :min="0"
          class="w-fit-full"
          controls-position="right"
          v-model="form.capacity_tbps"
        />
      </el-form-item>
      <el-form-item label="Fiber pairs">
        <el-input class="w-fit-full" v-model="form.fiberPairs" />
      </el-form-item>
      <el-form-item label="Notes">
        <el-input
          type="textarea"
          class="w-fit-full"
          v-model="form.fiberPairs"
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="Facilities">
        <el-select class="w-fit-full" v-model="form.facilities" placeholder>
          <el-option
            v-for="(opt, i) in []"
            :key="i"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="CLS">
        <el-select class="w-fit-full" v-model="form.cls" placeholder>
          <el-option
            v-for="(opt, i) in []"
            :key="i"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
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

export default {
  name: 'CableForm',
  components: {
    Dragger
  },
  data: () => ({
    tag: '',
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
      this.form.urls.splice(this.form.urls.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      try {
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      } catch (err) {
        console.log(this.$refs)
        console.error(err)
      }
    },
    confirmTag() {
      let tag = this.tag
      const isTagAlreadyCreated = this.form.urls.includes(tag)
      if (isTagAlreadyCreated) return

      if (tag) this.form.urls.push(tag)
      this.inputVisible = false
      this.tag = ''
    }
  }
}
</script>
