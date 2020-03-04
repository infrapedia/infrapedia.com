<template>
  <div class="pb6 pt6 pr8 pl8" v-loading="loading">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title">{{ title }} CLS</h1>
    </header>
    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Name of group" required prop="name">
        <el-input :class="{ dark }" class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="State" prop="state">
        <el-radio-group :class="{ dark }" v-model="form.state">
          <el-radio :label="true">
            Yes
          </el-radio>
          <el-radio :label="false">
            No
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Slug" prop="slug">
        <el-input
          class="w-fit-full"
          :class="{ dark }"
          controls-position="right"
          v-model="form.slug"
        />
      </el-form-item>
      <el-form-item label="Subsea cables" prop="cables">
        <el-select
          class="w-fit-full"
          v-model="form.cables"
          :class="{ dark }"
          multiple
          filterable
          remote
          :remote-method="loadCablesSearch"
          :loading="isLoadingCables"
          collapse-tags
          placeholder
        >
          <el-option
            v-for="(opt, i) in cablesList"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          >
            <div>
              <fa :icon="['fas', 'award']" v-if="opt.yours === 1" class="mr1" />
              {{ opt.name }}
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Tags" class="mt2">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          :class="{ dark }"
          placeholder
          class="w-fit-full"
          allow-create
          default-first-option
        >
          <el-option
            v-for="(item, i) in form.tagsList"
            :key="i"
            :label="item"
            :value="item"
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
          :loading="isSendingData"
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
import { searchCables } from '../../services/api/cables'
import { getTags } from '../../services/api/tags'

export default {
  name: 'CLSForm',
  data: () => ({
    tagsList: [],
    cablesList: [],
    loading: false,
    isLoadingCables: false,
    formRules: {
      name: [
        {
          required: true,
          message: 'Please input a name',
          trigger: 'change'
        },
        { min: 3, message: 'Length should be at least 3', trigger: 'change' }
      ],
      cables: [],
      slug: [],
      state: []
    }
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
    },
    isSendingData: {
      type: Boolean,
      default: () => false
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
  watch: {
    'form.cablesList'(cables) {
      this.cablesList = [...cables]
      delete this.form.cablesList
    },
    'form.tags'(tag) {
      this.getTagsList(tag)
    }
  },
  methods: {
    async getTagsList(s) {
      const res = await getTags({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.form.tagsList = res.data
      }
    },
    async loadCablesSearch(s) {
      if (s === '') return
      this.isLoadingCables = true
      const res = await searchCables({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.cablesList = res.data
      }
      this.isLoadingCables = false
    },
    handleFileConverted(fc) {
      return this.$emit('handle-file-converted', fc)
    },
    sendData() {
      return this.$refs['form'].validate(isValid =>
        isValid ? this.$emit('send-data') : false
      )
    }
  }
}
</script>
