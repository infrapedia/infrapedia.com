<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title capitalize">{{ title }} map</h1>
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
      <el-form-item label="Address" class="mt2">
        <el-tag
          :key="i"
          v-for="(tag, i) in form.address"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag.reference }}
          <fa
            :icon="['fas', 'pen']"
            class="cursor-pointer w24 ml1 inline-block"
            @click="editAddress(tag, i)"
          />
        </el-tag>
        <br />
        <el-collapse-transition>
          <el-card v-if="inputVisible" class="p4 w-auto mt4" shadow="never">
            <el-form ref="tagForm" :model="tag" :rules="tagRules">
              <el-form-item label="Reference" prop="reference" required>
                <el-input
                  name="street"
                  :class="{ dark }"
                  v-model="tag.reference"
                  ref="saveTagInput"
                  size="mini"
                />
              </el-form-item>
              <el-form-item prop="address" label="Address">
                <autocomplete-google
                  :mode="tagMode"
                  :value="autocompleteAddress"
                  @place-changed="handleAddressChange"
                />
              </el-form-item>
            </el-form>
            <el-form-item>
              <div
                class="flex row wrap justify-content-end justify-center-sm pt3"
              >
                <el-button
                  plain
                  :class="{ dark }"
                  type="success"
                  size="mini"
                  class="w25 h8 mb4 mr2"
                  @click="handleSaveAddress"
                >
                  Save address
                </el-button>
                <el-button
                  class="w25 h8"
                  :class="{ dark }"
                  size="mini"
                  @click="clearAddress"
                >
                  Cancel
                </el-button>
              </div>
            </el-form-item>
          </el-card>
          <el-button
            v-else
            :class="{ dark }"
            class="w42 text-center"
            size="small"
            @click="showInput"
          >
            Add
          </el-button>
        </el-collapse-transition>
      </el-form-item>
      <el-form-item label="Technical Email Contact">
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.techEmail"
        />
      </el-form-item>
      <el-form-item label="Technical Phone Contact">
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.techPhone"
        />
      </el-form-item>
      <el-form-item label="Sale Email Contact">
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.saleEmail"
        />
      </el-form-item>
      <el-form-item label="Sale Phone Contact">
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.salePhone"
        />
      </el-form-item>
      <el-divider :class="{ dark }" />
      <el-form-item label="Owners">
        <v-multi-select
          :mode="mode"
          :options="owners"
          :get-selected-id="true"
          @input="loadOwnersSearch"
          :loading="isLoadingOwners"
          @values-change="handleSelectionChange('owners', $event)"
          :value="mode == 'create' ? [] : [...form.owners]"
          @remove="handleRemoveItemFromMultiSelect('owners', $event)"
        />
      </el-form-item>
      <el-form-item label="Facilities">
        <v-multi-select
          :mode="mode"
          :options="facilities"
          @input="loadFacSearch"
          :get-selected-id="true"
          :loading="isLoadingFacs"
          @values-change="handleSelectionChange('facilities', $event)"
          :value="mode == 'create' ? [] : [...form.facilities]"
          @remove="handleRemoveItemFromMultiSelect('facilities', $event)"
        />
      </el-form-item>
      <el-form-item label="Cables">
        <v-multi-select
          :mode="mode"
          :options="cables"
          :get-selected-id="true"
          @input="loadCablesSearch"
          :loading="isLoadingCables"
          @values-change="handleSelectionChange('cables', $event)"
          :value="mode == 'create' ? [] : [...form.cables]"
          @remove="handleRemoveItemFromMultiSelect('cables', $event)"
        />
      </el-form-item>
      <el-form-item label="CLS">
        <v-multi-select
          :mode="mode"
          :options="cls"
          @input="loadClsSearch"
          :loading="isLoadingCls"
          :get-selected-id="true"
          @values-change="handleSelectionChange('cls', $event)"
          :value="mode == 'create' ? [] : [...form.cls]"
          @remove="handleRemoveItemFromMultiSelect('cls', $event)"
        />
      </el-form-item>
      <el-form-item label="Ixps">
        <v-multi-select
          :mode="mode"
          :options="ixps"
          :get-selected-id="true"
          @input="loadIxpsSearch"
          :loading="isLoadingIxps"
          @values-change="handleSelectionChange('ixps', $event)"
          :value="mode == 'create' ? [] : [...form.ixps]"
          @remove="handleRemoveItemFromMultiSelect('ixps', $event)"
        />
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
import { searchFacilities, getFacilitiesGeom } from '../../services/api/facs'
import { searchCables, getCablesGeom } from '../../services/api/cables'
import { searchIxps, getIxpsGeoms } from '../../services/api/ixps'
import { searchCls, getClsGeoms } from '../../services/api/cls'
import apiConfig from '../../config/apiConfig'
import * as events from '../../events/mapForm'
import { fCollectionFormat } from '../../helpers/featureCollection'
import AutocompleteGoogle from '../../components/AutocompleteGoogle'
import { searchOrganization } from '../../services/api/organizations'
import VMultiSelect from '../../components/MultiSelect'

export default {
  name: 'MapForm',
  components: {
    VMultiSelect,
    AutocompleteGoogle,
    IMapPropertiesDialog: () => import('../dialogs/MapPropertiesDialog')
  },
  data: () => ({
    facilities: [],
    cables: [],
    cls: [],
    ixps: [],
    owners: [],
    feature: {},
    featureType: '',
    tag: {
      fullAddress: '',
      reference: '',
      country: '',
      street: '',
      apt: '',
      city: '',
      state: '',
      zipcode: ''
    },
    tagMode: 'create',
    tagOnEdit: null,
    inputVisible: false,
    isLoadingCls: false,
    dialogMode: 'create',
    isLoadingFacs: false,
    isLoadingIxps: false,
    isLoadingCables: false,
    isLoadingOwners: false,
    isPropertiesDialog: false,
    isUploadingImage: false,
    currentSelectionID: null,
    mapCreationData: {
      cls: [],
      ixps: [],
      cables: [],
      owners: [],
      facilities: []
    },
    tagRules: {
      reference: [
        {
          required: true,
          message: 'Please input a reference name',
          trigger: ['blur', 'change']
        },
        {
          min: 2,
          message: 'Minimum length should be 2',
          trigger: ['blur', 'change']
        }
      ],
      address: []
    }
  }),
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
    saveBtn() {
      return this.mode === 'create' ? 'Create map' : 'Save changes'
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
    autocompleteAddress() {
      return this.tag && this.tag.fullAddress ? this.tag.fullAddress : ''
    },
    checkGeomLength() {
      let disabled

      if (this.$route.query.id !== 'map') {
        disabled = this.$store.state.editor.scene.features.list.length
          ? false
          : true
      } else {
        disabled = this.form.subdomain ? false : true
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
    handleRemoveItemFromMultiSelect(t, _id) {
      this.form[t] = this.form[t].filter(id => id !== _id)
      this.handleSelectionChange(t, _id)
    },
    handleUploadProgress() {
      this.isUploadingImage = true
    },
    handleLogoUpload(res) {
      if (!res.data && res.data.r.length) return
      this.form.logos.push(res.data.r[0])
      this.isUploadingImage = false
    },
    async handleEditModeScenario() {
      const { cables, cls, facilities, ixps, owners } = this.form

      this.facilities = facilities.map(f => ({ name: f.label, _id: f._id }))
      this.cables = cables.map(c => ({ name: c.label, _id: c._id }))
      this.cls = cls.map(c => ({ name: c.label, _id: c._id }))
      this.ixps = ixps.map(c => ({ name: c.label, _id: c._id }))
      this.owners = owners.map(c => ({ name: c.label, _id: c._id }))

      this.form.facilities = facilities.map(f => f._id)
      this.form.owners = owners.map(f => f._id)
      this.form.cables = await cables.map(c => c._id)
      this.form.cls = cls.map(c => c._id)
      this.form.ixps = ixps.map(c => c._id)

      for (let t of ['facilities', 'cables', 'cls', 'ixps', 'owners']) {
        await this.handleSetFeatureOntoMap({ t })
      }

      await this.$store.dispatch('editor/toggleMapFormLoading', false)
      this.mapCreationData = { ...this.form.config }
      delete this.form.config
    },
    /**
     * @param t { String } - selection type { can be: facilities, cables, cls, ixps }
     * @param _id { String } - selection id
     */
    async handleSetFeatureOntoMap({ t, removeLoadState }) {
      if (t != 'owners') {
        this.$store.dispatch('editor/toggleMapFormLoading', true)
      }

      let fc = {}
      switch (t) {
        case 'cables':
          fc = await this.handleGetCablesGeom(this.form[t])
          break
        case 'facilities':
          fc = await this.handleGetFacsGeom(this.form[t])
          break
        case 'cls':
          fc = await this.handleGetClsGeom(this.form[t])
          break
        case 'ixps':
          fc = await this.handleGetIxpsGeom(this.form[t])
          break
        case 'owners':
          fc = fCollectionFormat()
          break
      }

      return fc
        ? this.$emit(`${events.SET_SELECTION_ONTO_MAP}`, {
            t,
            fc,
            removeLoadState
          })
        : this.$store.dispatch('editor/toggleMapFormLoading', false)
    },
    async handleGetCablesGeom(ids) {
      const res = await getCablesGeom({ user_id: this.$auth.user.sub, ids })
      return res && res.data && res.data.r ? res.data.r : fCollectionFormat()
    },
    async handleGetFacsGeom(ids) {
      const res = await getFacilitiesGeom({ user_id: this.$auth.user.sub, ids })
      return res && res.data && res.data.r ? res.data.r : fCollectionFormat()
    },
    async handleGetClsGeom(ids) {
      const res = await getClsGeoms({ user_id: this.$auth.user.sub, ids })
      return res && res.data && res.data.r ? res.data.r : fCollectionFormat()
    },
    async handleGetIxpsGeom(ids) {
      const res = await getIxpsGeoms({ user_id: this.$auth.user.sub, ids })
      return res && res.data && res.data.r ? res.data.r : fCollectionFormat()
    },
    handleGetOwnersGeom(ids) {
      return console.warn('not done yet', ids)
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
    async loadOwnersSearch(s) {
      if (s === '') return
      this.isLoadingOwners = true
      const res = await searchOrganization({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.owners = res.data
      }
      this.isLoadingOwners = false
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
      return this.$emit(`${events.SEND_DATA}`, {
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
        // Loading again the featureCollections
        setTimeout(async () => {
          await this.handleSetFeatureOntoMap({
            removeLoadState: true,
            t: t
          })
        }, 320)

        // Removing from mapCreationData[type] the one just removed from this.form[t]
        if (this.form[t].length) {
          return (this.mapCreationData[t] = this.mapCreationData[t].filter(d =>
            this.form[t].includes(d._id)
          ))
        } else return (this.mapCreationData[t] = [])
      }

      this.form[t].push(_id)
      this.featureType = t
      this.currentSelectionID = _id
      if (t != 'owners') {
        setTimeout(() => (this.isPropertiesDialog = true), 320)
      } else this.setMapConfig()
    },
    setMapConfig(data) {
      const ids = this.mapCreationData[this.featureType].map(d => d.id)
      if (!ids.includes(this.currentSelectionID)) {
        let obj = {
          _id: this.currentSelectionID
        }
        data ? (obj = { ...obj, ...data }) : null
        this.mapCreationData[this.featureType].push(obj)
      }
    },
    /**
     * @param data { Object } - Data collected from propertiesDialog form
     */
    handleDialogClose(data) {
      this.setMapConfig(data)
      setTimeout(async () => {
        await this.handleSetFeatureOntoMap({
          t: this.featureType,
          removeLoadState: true
        })

        this.currentSelectionID = null
        this.featureType = ''
      }, 320)

      this.isPropertiesDialog = false
    },
    handleClose(tag) {
      return this.form.address.splice(this.form.address.indexOf(tag), 1)
    },
    clearAddress() {
      this.isTagReferenceMissing = false
      this.inputVisible = false
      this.tagOnEdit = null
      this.tag = {
        fullAddress: '',
        reference: '',
        country: '',
        street: '',
        apt: '',
        city: '',
        state: '',
        zipcode: ''
      }
    },
    editAddress(tag, i) {
      this.tag = { ...tag }
      this.tagOnEdit = i
      this.tagMode = 'edit'
      this.inputVisible = true
    },
    handleAddressChange(data) {
      const tagData = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        country: 'long_name',
        postal_code: 'short_name'
      }

      let addressType
      this.tag.fullAddress = data.fullAddress

      for (let i = 0; i < data.address_components.length; i++) {
        addressType = data.address_components[i].types[0]
        if (tagData[addressType]) {
          const val = data.address_components[i][tagData[addressType]]
          switch (addressType) {
            case 'country':
              this.tag.country = val
              break
            case 'postal_code':
              this.tag.zipcode = val
              break
            case 'locality':
              this.tag.city = val
              break
            case 'route':
              this.tag.street = val
              break
            case 'administrative_area_level_1':
              this.tag.state = val
              break
          }
        }
      }
    },
    handleSaveAddress() {
      return this.$refs['tagForm'].validate(isValid => {
        if (isValid) {
          if (this.tagOnEdit === null) this.form.address.push({ ...this.tag })
          else this.form.address[this.tagOnEdit] = { ...this.tag }
          this.clearAddress()
        } else false
      })
    },
    showInput() {
      this.inputVisible = true
      try {
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      } catch {
        // Ignore
      }
    },
    confirmTag() {
      let tag = this.tag
      const isTagAlreadyCreated = this.form.address.includes(tag)
      if (isTagAlreadyCreated) return

      if (tag) this.form.address.push(tag)
      this.inputVisible = false
      this.tag = {
        fullAddress: '',
        reference: '',
        country: '',
        street: '',
        apt: '',
        city: '',
        state: '',
        zipcode: ''
      }
    }
  }
}
</script>
1
