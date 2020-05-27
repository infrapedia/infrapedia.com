<template>
  <div class="pb6 pt6 pr8 pl8" v-loading="loading">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title capitalize">{{ title }} CLS</h1>
    </header>
    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Name" required prop="name">
        <el-input :class="{ dark }" class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="Country" required prop="country">
        <el-select
          placeholder="A country is required"
          class="w-fit-full"
          :class="{ dark }"
          v-model="form.country"
        >
          <el-option
            v-for="(country, i) in countries"
            :key="i"
            :label="country.name"
            :value="country.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Status" prop="state" required>
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
      <el-form-item label="Owners" prop="owners" required>
        <v-multi-select
          :mode="mode"
          :is-required="true"
          :is-field-empty="isOwnersSelectEmpty"
          :options="ownersList"
          @input="loadOwnersSearch"
          :loading="isLoadingOwners"
          :value="mode === 'create' ? [] : form.owners"
          @values-change="handleOwnersSelectChange"
          @remove="handleOwnersSelectRemoveItem"
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
import { searchOrganization } from '../../services/api/organizations'
import countriesList from '../../config/countriesList'

export default {
  name: 'CLSForm',
  data: () => ({
    tagsList: [],
    isLoadingOwners: false,
    ownersList: [],
    cablesList: [],
    loading: false,
    isLoadingCables: false,
    isOwnersSelectEmpty: false
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
    countries() {
      const countries = [...countriesList]
      function once() {
        // eslint-disable-next-line no-unused-vars
        let counter = 0
        return function addNA() {
          if (counter >= 1) return
          countries.unshift({ name: 'N.A (Not Available)', code: 'N.A' })
          counter += 1
        }
      }
      once()()
      return countries
    },
    formRules() {
      return {
        name: [
          {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: 'Please input a name'
          },
          {
            type: 'string',
            trigger: 'change',
            message: 'Please input a valid name',
            transform: value => value.trim(),
            // eslint-disable-next-line
            pattern: /^[\A-Za-zÀ-ÖØ-öø-ÿ&.´ \-]+$/
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'change' }
        ],
        country: [
          {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: 'Please select a country'
          }
          // {
          //   required: true,
          //   type: 'string',
          //   message:
          //     'Please input a valid name for the country where the cls is located',
          //   trigger: 'change',
          //   transform: value => value.trim(),
          //   // eslint-disable-next-line
          //   pattern: /^[\A-Za-zÀ-ÖØ-öø-ÿ&.´ \-]+$/
          // }
        ],
        cables: [],
        slug: [],
        state: [],
        owners: [
          {
            type: 'array',
            message: 'At least one owner is required',
            trigger: ['blur', 'change']
          }
        ]
      }
    },
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
    'form.ownersList'(owners) {
      if (!owners) return
      this.ownersList = [...owners]
      delete this.form.ownersList
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
    async loadOwnersSearch(s) {
      if (s.length <= 0) return

      this.isLoadingOwners = true
      const { data: owners = [] } = (await searchOrganization({
        user_id: await this.$auth.getUserID(),
        s
      })) || { owners: [] }

      this.ownersList = owners
      this.isLoadingOwners = false
    },
    handleOwnersSelectRemoveItem(_id) {
      this.form.owners = this.form.owners.filter(item => item._id != _id)
    },
    handleOwnersSelectChange(data) {
      this.form.owners = Array.from(data)
      this.setOwnersEmptyState()
    },
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
    setOwnersEmptyState() {
      if (this.form.owners.length <= 0) {
        this.isOwnersSelectEmpty = true
      }
    },
    sendData() {
      this.setOwnersEmptyState()
      return this.$refs['form'].validate(isValid => {
        return isValid && !this.isOwnersSelectEmpty
          ? this.$emit('send-data')
          : false
      })
    }
  }
}
</script>
