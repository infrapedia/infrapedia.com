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
      <el-form-item label="Logo(s)">
        <br />
        <div class="block w-fit-full">
          <el-upload
            v-model="form.logos"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
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
import { searchFacilities } from '../../services/api/facs'
import { searchCables } from '../../services/api/cables'
import { searchCls } from '../../services/api/cls'

export default {
  name: 'MapForm',
  data: () => ({
    facilities: [],
    cables: [],
    cls: [],
    feature: {},
    featureType: '',
    isLoadingCls: false,
    dialogMode: 'create',
    isLoadingFacs: false,
    isLoadingCables: false,
    isPropertiesDialog: false,
    currentSelection: null,
    mapCreationData: {
      cls: [],
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
    mode(m) {
      if (m === 'create') return
      this.handleEditModeScenario()
    }
  },
  methods: {
    handleEditModeScenario() {
      const { cables, cls, facilities } = this.form

      this.cables = cables.map(c => ({
        yours: c.yours,
        name: c.name,
        _id: c._id
      }))

      this.cls = cls.map(c => ({
        yours: c.yours,
        name: c.name,
        _id: c._id
      }))

      this.facilities = facilities.map(c => ({
        name: c.name,
        _id: c._id
      }))

      // This is being made because the select(s) value are ._id,
      // not the entire data being passed when setting the edit mode
      this.form.facilities = facilities.map(f => f._id)
      this.form.cables = cables.map(c => c._id)
      this.form.cls = cls.map(c => c._id)

      this.mapCreationData = {
        cls,
        cables,
        facilities
      }
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
      const data = { ...this.form }
      data.cls = this.mapCreationData.cls
      data.cables = this.mapCreationData.cables
      data.facilities = this.mapCreationData.facilities

      return this.$emit('send-data', {
        ...data,
        draw: Array.from(
          this.$store.state.editor.scene.features.list,
          item => ({ ...item })
        )
      })
    },
    /**
     * @param t { String } - selection type { can be: facilities, cables, cls }
     * @param id { String } - selection _id
     */
    handleSelectionChange(t, id) {
      if (this.form[t].length < this.mapCreationData[t].length) {
        // Removing from mapCreationData[type] from my selections
        return this.form[t].forEach(id => {
          let index = 0
          for (let data of Array.from(this.mapCreationData, item => ({
            ...item
          }))) {
            if (id === data.id) continue
            else this.mapCreationData.splice(index, 1)
            index += 1
          }
        })
      }

      this.featureType = t
      this.currentSelection = this[t].filter(
        item => item._id === id[this.form[t].length - 1]
      )[0]
      this.$refs[`${t}Select`].blur()
      setTimeout(() => {
        this.isPropertiesDialog = true
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
          ...this.currentSelection
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
