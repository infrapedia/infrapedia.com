<template>
  <div class="pb6 pt6 pr8 pl8" v-loading="loading">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title capitalize">{{ title }} CLS</h1>
    </header>
    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Name" required prop="name">
        <el-input :class="{ dark }" class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="Status" prop="state">
        <el-radio-group :class="{ dark }" v-model="form.state">
          <el-radio label="operational">
            Operational
          </el-radio>
          <el-radio label="unknown">
            Unknown
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="Slug" prop="slug">
        <el-input
          class="w-fit-full"
          :class="{ dark }"
          controls-position="right"
          v-model="form.slug"
        />
      </el-form-item> -->
      <el-form-item label="Subsea cables" prop="cables">
        <v-multi-select
          :mode="mode"
          :options="cablesList"
          @input="loadCablesSearch"
          :loading="isLoadingCables"
          @remove="handleSubseaCablesSelection(form.cables)"
          @values-change="handleSubseaCablesSelection"
          :value="mode == 'create' ? [] : form.cables"
        />
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
          class="w-fit-full capitalize"
          round
          :loading="isSendingData"
          :disabled="checkGeomLength"
          @click="sendData"
        >
          {{ saveBtn }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Dragger from '../../components/Dragger'
import { searchCables, getCablesGeom } from '../../services/api/cables'
import { getTags } from '../../services/api/tags'
import VMultiSelect from '../../components/MultiSelect'
import { fCollectionFormat } from '../../helpers/featureCollection'

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
    Dragger,
    VMultiSelect
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
      return this.mode == 'create' ? 'Create' : 'Edit'
    },
    saveBtn() {
      return this.mode == 'create' ? 'Create CLS' : 'Save changes'
    },
    checkGeomLength() {
      return this.$store.state.editor.scene.features.list.length > 0
        ? false
        : true
    }
  },
  watch: {
    'form.cablesList'(cables) {
      this.cablesList = [...cables]
      this.handleSubseaCablesSelection(cables)
      delete this.form.cablesList
    },
    'form.tags'(tag) {
      this.getTagsList(tag)
    }
  },
  mounted() {
    if (this.mode == 'create') {
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      }, 50)
    }
  },
  methods: {
    async handleSubseaCablesSelection(cablesSelected) {
      this.form.cables = cablesSelected
      const {
        data: { r: featureCollection = [] }
      } = (await getCablesGeom({
        ids: cablesSelected.map(c => c._id),
        user_id: this.$auth.getUserID()
      })) || {
        data: { featureCollection: [] }
      }
      return this.$emit('set-selection-onto-map', {
        fc: Array.isArray(featureCollection)
          ? fCollectionFormat(featureCollection)
          : featureCollection,
        t: 'cables'
      })
    },
    async getTagsList(s) {
      const { data } = (await getTags({
        user_id: await this.$auth.getUserID(),
        s
      })) || { data: [] }
      this.form.tagsList = data
    },
    async loadCablesSearch(s) {
      if (s === '') return
      this.isLoadingCables = true
      const { data = [] } = (await searchCables({
        user_id: await this.$auth.getUserID(),
        s
      })) || { data: [] }
      this.cablesList = data
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
