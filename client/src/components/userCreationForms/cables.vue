<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title">{{ title }} cable</h1>
    </header>
    <el-form ref="form" :model="form">
      <el-form-item label="Category">
        <el-select
          class="w-fit-full"
          filterable
          :class="{ dark }"
          v-model="form.category"
          placeholder
        >
          <el-option
            v-for="(opt, i) in cableStates"
            :key="i"
            :label="opt"
            :value="opt"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Name">
        <el-input :class="{ dark }" class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="System length">
        <el-input-number
          :min="0"
          :class="{ dark }"
          class="w-fit-full"
          controls-position="right"
          v-model="form.systemLength"
        />
      </el-form-item>
      <el-form-item label="Activation date">
        <el-date-picker
          :class="{ dark }"
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
          :class="{ dark }"
          @keyup.enter.native="confirmTag"
          @blur="confirmTag"
        />
        <el-button
          v-else
          :class="{ dark }"
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
          :class="{ dark }"
          class="w-fit-full"
          controls-position="right"
          v-model="form.capacityTBPS"
        />
      </el-form-item>
      <el-form-item label="Fiber pairs">
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.fiberPairs"
        />
      </el-form-item>
      <el-form-item label="Notes">
        <el-input
          :class="{ dark }"
          type="textarea"
          class="w-fit-full"
          v-model="form.notes"
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="Facilities">
        <el-select
          multiple
          :class="{ dark }"
          filterable
          collapse-tags
          class="w-fit-full"
          v-model="form.facilities"
          placeholder
        >
          <el-option
            v-for="(opt, i) in facsList"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="CLS">
        <el-select
          multiple
          :class="{ dark }"
          filterable
          collapse-tags
          class="w-fit-full"
          v-model="form.cls"
          placeholder
        >
          <el-option
            v-for="(opt, i) in clsList"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <dragger @handle-file-converted="handleFileConverted" />
      </el-form-item>
      <el-form-item class="mt12">
        <el-button
          type="primary"
          class="w-fit-full"
          round
          :disabled="checkGeomLength"
          @click="sendData"
        >
          {{ title }} cable
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Dragger from '../../components/Dragger'
import { getClss } from '../../services/api/cls'
import cableStates from '../../config/cableStates'

export default {
  name: 'CableForm',
  components: {
    Dragger
  },
  data: () => ({
    tag: '',
    cableStates,
    clsList: [],
    facsList: [],
    inputVisible: false
  }),
  props: {
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
    },
    dark() {
      return this.$store.state.isDark
    },
    checkGeomLength() {
      return this.$store.state.editor.scene.features.list.length ? false : true
    }
  },
  mounted() {
    this.getCLSList()
  },
  methods: {
    handleFileConverted(fc) {
      return this.$emit('handle-file-converted', fc)
    },
    async getCLSList() {
      const res = await getClss({ user_id: this.$auth.user.sub })
      if (res && res.data && res.data.r) {
        this.clsList = res.data.r
      }
    },
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
