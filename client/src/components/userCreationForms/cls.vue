<template>
  <div class="pb6 pt6 pr8 pl8" v-loading="loading">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title">{{ title }} CLS</h1>
    </header>
    <el-form ref="form" :model="form">
      <el-form-item label="Name of group">
        <el-input :class="{ dark }" class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="State">
        <el-radio-group :class="{ dark }" v-model="form.state">
          <el-radio :label="true">
            Yes
          </el-radio>
          <el-radio :label="false">
            No
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Slug">
        <el-input
          class="w-fit-full"
          :class="{ dark }"
          controls-position="right"
          v-model="form.slug"
        />
      </el-form-item>
      <el-form-item label="Cables">
        <el-select
          class="w-fit-full"
          v-model="form.cables"
          :class="{ dark }"
          multiple
          filterable
          collapse-tags
          placeholder
        >
          <el-option
            v-for="(opt, i) in cablesList"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <dragger
          creation-type="cls"
          @handle-file-converted="handleFileConverted"
        />
      </el-form-item>
      <el-form-item class="mt24">
        <el-button
          type="primary"
          class="w-fit-full"
          round
          :disabled="checkGeomLength"
          @click="sendData"
        >
          {{ this.title }} CLS
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Dragger from '../../components/Dragger'
import { getCables } from '../../services/api/cables'

export default {
  name: 'CLSForm',
  data: () => ({
    cablesList: [],
    loading: false
  }),
  components: {
    Dragger
  },
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
    dark() {
      return this.$store.state.isDark
    },
    title() {
      return this.mode === 'create' ? 'Create' : 'Edit'
    },
    checkGeomLength() {
      return this.$store.state.editor.scene.features.list.length ? false : true
    }
  },
  async mounted() {
    await this.getCablesList()
  },
  methods: {
    async getCablesList() {
      this.loading = true
      const res = await getCables({ user_id: this.$auth.user.sub })
      if (res.t !== 'error' && res.data) {
        this.cablesList = res.data.r
      }
      this.loading = false
    },
    handleFileConverted(fc) {
      return this.$emit('handle-file-converted', fc)
    },
    sendData() {
      return this.$emit('send-data')
    }
  }
}
</script>
