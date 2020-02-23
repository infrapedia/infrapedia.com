<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title">{{ title }} map</h1>
    </header>
    <el-form ref="form" :model="form">
      <el-form-item label="Subdomain">
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.subdomain"
          placeholder="subdomain name"
          @input="handleRestrictedNames"
        >
          <template slot="append">
            .infrapedia.com
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="Google Analytics ID">
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.googleID"
        />
      </el-form-item>
      <el-divider :class="{ dark }" />
      <el-form-item label="Facilities">
        <el-select
          multiple
          clearable
          :class="{ dark }"
          collapse-tags
          filterable
          remote
          :remote-method="loadFacSearch"
          :loading="isLoadingFacs"
          class="w-fit-full"
          v-model="form.facilities"
          ref="facilitiesSelect"
          @change="handleSelectionChange('facilities', $event)"
          placeholder
        >
          <el-option
            v-for="(opt, i) in facilities"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          >
            <div class="truncate" :title="opt.name">
              <fa :icon="['fas', 'award']" v-if="opt.yours === 1" class="mr1" />
              {{ opt.name }}
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Cables">
        <el-select
          multiple
          clearable
          collapse-tags
          :class="{ dark }"
          filterable
          remote
          :remote-method="loadCablesSearch"
          :loading="isLoadingCables"
          class="w-fit-full"
          v-model="form.cables"
          placeholder
          ref="cablesSelect"
          @change="handleSelectionChange('cables', $event)"
        >
          <el-option
            v-for="(opt, i) in cables"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          >
            <div class="truncate" :title="opt.name">
              <fa :icon="['fas', 'award']" v-if="opt.yours === 1" class="mr1" />
              {{ opt.name }}
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="CLS">
        <el-select
          multiple
          clearable
          :class="{ dark }"
          collapse-tags
          remote
          :remote-method="loadClsSearch"
          :loading="isLoadingCls"
          filterable
          class="w-fit-full"
          v-model="form.cls"
          placeholder
          ref="clsSelect"
          @change="handleSelectionChange('cls', $event)"
        >
          <el-option
            v-for="(opt, i) in cls"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          >
            <div class="truncate" :title="opt.name">
              <fa :icon="['fas', 'award']" v-if="opt.yours === 1" class="mr1" />
              {{ opt.name }}
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Ixps">
        <el-select
          multiple
          clearable
          :class="{ dark }"
          collapse-tags
          remote
          :remote-method="loadIxpsSearch"
          :loading="isLoadingIxps"
          filterable
          class="w-fit-full"
          v-model="form.ixps"
          placeholder
          ref="ixpsSelect"
          @change="handleSelectionChange('ixps', $event)"
        >
          <el-option
            v-for="(opt, i) in ixps"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          >
            <div class="truncate" :title="opt.name">
              <fa :icon="['fas', 'award']" v-if="opt.yours === 1" class="mr1" />
              {{ opt.name }}
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Logo(s)">
        <br />
        <div class="block w-fit-full">
          <el-upload
            list-type="picture-card"
            accept="image/*.jpg"
            :action="uploadURL"
            :file-list.sync="form.logos"
            :headers="uploadLogoHeaders"
            :on-success="handleLogoUpload"
            :before-upload="handleUploadProgress"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item class="mt12">
        <el-button
          type="primary"
          class="w-fit-full"
          round
          :loading="isSendingData"
          :disabled="checkGeomLength"
          @click="sendData"
        >
          {{ title }} map
        </el-button>
      </el-form-item>
    </el-form>
    <!------------------------->
    <i-map-properties-dialog
      :mode="dialogMode"
      :feature="feature"
      :feature-type="featureType"
      :is-visible="isPropertiesDialog"
      @close="handleDialogClose"
    />
  </div>
</template>

<script>
import { searchFacilities, getFacilityGeom } from '../../services/api/facs'
import { searchCables, getCableGeom } from '../../services/api/cables'
import { searchIxps, getIxpsGeom } from '../../services/api/ixps'
import { searchCls, getClsGeom } from '../../services/api/cls'
import apiConfig from '../../config/apiConfig'

export default {
  name: 'MapForm',
  data: () => ({
    facilities: [],
    cables: [],
    cls: [],
    ixps: [],
    feature: {},
    featureType: '',
    isLoadingCls: false,
    dialogMode: 'create',
    isLoadingFacs: false,
    isLoadingIxps: false,
    isLoadingCables: false,
    isPropertiesDialog: false,
    isUploadingImage: false,
    currentSelection: null,
    mapCreationData: {
      cls: [],
      ixps: [],
      cables: [],
      facilities: []
    }
  }),
  components: {
    IMapPropertiesDialog: () => import('../dialogs/MapPropertiesDialog')
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
    title() {
      return this.mode === 'create' ? 'Create' : 'Edit'
    },
    uploadLogoHeaders() {
      return { user_id: this.$auth.user.sub }
    },
    uploadURL() {
      return `${apiConfig.url}/auth/upload/logo`
    },
    dark() {
      return this.$store.state.isDark
    },
    checkGeomLength() {
      let disabled

      if (this.$route.query.id !== 'map') {
        disabled = this.$store.state.editor.scene.features.list.length
          ? false
          : true
      } else {
        disabled = this.form.subdomain && this.form.googleID ? false : true
      }
      return disabled
    }
  },
  watch: {
    async mode(m) {
      if (m === 'create') return
      await this.handleEditModeScenario()
    }
  },
  methods: {
    handleUploadProgress() {
      this.isUploadingImage = true
    },
    handleLogoUpload(res) {
      if (!res.data && res.data.r.length) return
      this.form.logos.push(res.data.r[0])
      this.isUploadingImage = false
    },
    async handleEditModeScenario() {
      const { cables, cls, facilities, ixps } = this.form

      this.facilities = facilities.map(f => ({ name: f.label, _id: f._id }))
      this.cables = cables.map(c => ({ name: c.label, _id: c._id }))
      this.cls = cls.map(c => ({ name: c.label, _id: c._id }))
      this.ixps = ixps.map(c => ({ name: c.label, _id: c._id }))

      this.form.facilities = facilities.map(f => f._id)
      this.form.cables = await cables.map(c => c._id)
      this.form.cls = cls.map(c => c._id)
      this.form.ixps = ixps.map(c => c._id)

      for (let type of ['facilities', 'cables', 'cls', 'ixps']) {
        for (let id of this.form[type]) {
          await this.handleSetFeatureOntoMap(type, id)
        }
      }

      this.mapCreationData = { ...this.form.config }
      delete this.form.config
    },
    /**
     * @param t { String } - selection type { can be: facilities, cables, cls, ixps }
     * @param _id { String } - selection id
     */
    async handleSetFeatureOntoMap(t, _id) {
      this.$emit('loading-selection-geom')

      let fc = {}
      switch (t) {
        case 'cables':
          fc = await this.handleGetCableGeom(_id)
          break
        case 'facilities':
          fc = await this.handleGetFacsGeom(_id)
          break
        case 'cls':
          fc = await this.handleGetClsGeom(_id)
          break
        case 'ixps':
          fc = await this.handleGetIxpsGeom(_id)
          break
      }

      return fc
        ? this.$emit('set-selection-onto-map', { t, fc })
        : this.$emit('cancel-geom-loading')
    },
    async handleGetCableGeom(_id) {
      const res = await getCableGeom({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async handleGetFacsGeom(_id) {
      const res = await getFacilityGeom({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async handleGetClsGeom(_id) {
      const res = await getClsGeom({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    async handleGetIxpsGeom(_id) {
      const res = await getIxpsGeom({ user_id: this.$auth.user.sub, _id })
      return res && res.data && res.data.r ? res.data.r : {}
    },
    /**
     * @param name { String } - subdomain name
     */
    async handleRestrictedNames(name) {
      if (!name) return
      this.form.subdomain = name
        .replace(/[^a-zñ\d\s]+/gi, '')
        .trim()
        .toLowerCase()
    },
    /**
     * @param s { String } - search queried from cables select input
     */
    async loadCablesSearch(s) {
      if (s === '') return
      this.isLoadingCables = true
      const res = await searchCables({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        const indexList = this.cables
          .map((id, i) => [id, i])
          .filter(item => {
            for (let id of this.form.cables) {
              if (id === item[0]._id) return item
            }
          })
        for (let index of indexList) {
          res.data.splice(index[1], 0, index[0])
        }
        this.cables = res.data
      }
      this.isLoadingCables = false
    },
    /**
     * @param s { String } - search queried from cls select input
     */
    async loadClsSearch(s) {
      if (s === '') return
      this.isLoadingCls = true
      const res = await searchCls({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.cls = res.data
      }
      this.isLoadingCls = false
    },
    async loadIxpsSearch(s) {
      if (s === '') return
      this.isLoadingIxps = true
      const res = await searchIxps({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.ixps = res.data
      }
      this.isLoadingIxps = false
    },
    /**
     * @param s { String } - search queried from facilities select input
     */
    async loadFacSearch(s) {
      if (s === '') return
      this.isLoadingCls = true
      const res = await searchFacilities({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.facilities = res.data
      }
      this.isLoadingCls = false
    },
    sendData() {
      return this.$emit('send-data', {
        ...this.form,
        config: this.mapCreationData,
        draw: Array.from(
          this.$store.state.editor.scene.features.list,
          item => ({ ...item })
        )
      })
    },
    /**
     * @param t { String } - selection type { can be: facilities, cables, cls, ixps }
     * @param _id { String } - selection id
     */
    async handleSelectionChange(t, _id) {
      if (this.form[t].length < this.mapCreationData[t].length) {
        // Removing from mapCreationData[type] the one just removed from this.form[t]
        if (this.form[t].length) {
          return (this.mapCreationData[t] = this.mapCreationData[t].filter(d =>
            this.form[t].includes(d._id)
          ))
        } else return (this.mapCreationData[t] = [])
      }

      this.featureType = t
      this.currentSelection = _id[this.form[t].length - 1]
      this.$refs[`${t}Select`].blur()
      setTimeout(async () => {
        this.isPropertiesDialog = true
        await this.handleSetFeatureOntoMap(t, this.currentSelection)
      }, 320)
    },
    /**
     * @param data { Object } - Data collected from propertiesDialog form
     */
    handleDialogClose(data) {
      const ids = this.mapCreationData[this.featureType].map(d => d.id)
      if (!ids.includes(this.currentSelection)) {
        this.mapCreationData[this.featureType].push({
          ...data,
          _id: this.currentSelection
        })
      }
      this.isPropertiesDialog = false
      this.currentSelection = null
      this.featureType = ''
    }
  }
}
</script>
1
