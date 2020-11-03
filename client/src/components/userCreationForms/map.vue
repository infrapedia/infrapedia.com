<template>
  <div class="pb6 pt6 pr8 pl8" id="mapFormWrapper">
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
      <template name="Logo">
        <el-form-item label="Logo(s)">
          <br />
          <div class="block flex flex-start">
            <el-upload
              ref="upload"
              :multiple="false"
              accept="image/*.jpg"
              :action="uploadURL"
              :auto-upload="false"
              :file-list="fileList"
              list-type="picture-card"
              :on-remove="handleFileListRemove"
              :on-change="handleFileListChange"
              :http-request="handleUserLogoUpload"
            >
              <i class="el-icon-plus" />
            </el-upload>
          </div>
        </el-form-item>
        <el-collapse-transition>
          <el-alert
            v-show="uploadLogo.show"
            :closable="false"
            :type="uploadLogo.type"
            :title="uploadLogo.text"
          />
        </el-collapse-transition>
      </template>
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
                  :width="312.73"
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
      <!-- CATEGORIES FIELD START -->
      <categories-field class="mb24" />
      <!-- CATEGORIES FIELD END -->
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
  </div>
</template>

<script>
import apiConfig from '../../config/apiConfig'
import * as events from '../../events/mapForm'
import { uploadOrgLogo } from '../../services/api/uploads'
import CategoriesField from './fields/categories.vue'
import { getGeometries } from '../../services/api'
import { categoriesDictionary } from './fields/dictionary'
import { sceneDictionary } from '../editor'

export default {
  name: 'MapForm',
  components: {
    CategoriesField,
    AutocompleteGoogle: () => import('../../components/AutocompleteGoogle')
  },
  data: () => ({
    feature: {},
    fileList: [],
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
    isLoadingFacs: false,
    isLoadingIxps: false,
    isLoadingCables: false,
    isLoadingOwners: false,
    currentSelectionID: null,
    uploadLogo: {
      text: '',
      type: '',
      show: false,
      loading: false
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
    },
    isSendDataDisabled: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    title() {
      return this.mode == 'create' ? 'Create' : 'Edit'
    },
    saveBtn() {
      return this.mode == 'create' ? 'Create map' : 'Save changes'
    },
    tagRules() {
      return {
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
    },
    uploadURL() {
      return `${apiConfig.url}/auth/upload/logo`
    },
    dark() {
      return this.$store.state.isDark
    },
    autocompleteAddress() {
      return this.tag.fullAddress
    },
    getSelectionID() {
      return t => this.form[t].map(t => (typeof t == 'string' ? t : t._id))
    },
    checkGeomLength() {
      let disabled

      if (this.$route.query.id != 'map') {
        disabled = this.isSendDataDisabled
      } else {
        disabled = this.form.subdomain ? false : true
      }
      return disabled
    }
  },
  watch: {
    mode(m) {
      if (m == 'create') return
      this.loadMapConfig()
      this.setLogoUrl()
    }
  },
  mounted() {
    if (this.mode == 'edit') {
      this.loadMapConfig()
      this.setLogoUrl()
    }
  },
  methods: {
    handleFileListRemove() {
      this.form.logo = ''
      this.fileList = []
    },
    handleFileListChange(file, fileList) {
      if (file && fileList.length > 0 && !this.form.logo) {
        this.fileList = [file.raw]
        this.$refs.upload.submit()
      }
    },
    async handleUserLogoUpload() {
      this.uploadLogo.show = false
      this.uploadLogo.loading = true

      const {
        data: { r: logo = [] }
      } = (await uploadOrgLogo({
        user_id: await this.$auth.getUserID(),
        logo: this.fileList[0]
      })) || {
        data: { logo: [] }
      }

      if (!logo.length) {
        this.fileList = logo
        this.uploadLogo = {
          type: 'info',
          text:
            'There has been an error trying to upload your logo. Please, try again.',
          show: true,
          loading: false
        }
        setTimeout(() => (this.uploadLogo.show = false), 5200)
        return
      }

      this.form.logo = logo[0]
      this.uploadLogo = {
        type: 'success',
        text: 'Success! Your logo has been uploaded.',
        show: true,
        loading: false
      }
    },
    setLogoUrl() {
      if (this.form.logo !== '' && this.form.logo != undefined) {
        this.fileList = [{ url: this.form.logo }]
      }
    },
    loadMapConfig() {
      if (this.form.config) {
        const { categories } =
          typeof this.form.config == 'string'
            ? JSON.parse(this.form.config)
            : this.form.config
        if (
          categories &&
          typeof categories != 'string' &&
          !Array.isArray(categories)
        ) {
          categoriesDictionary.set(categories)
        }
        delete this.form.config
      }
    },
    /**
     * @param t { String } - selection type { can be: facilities, cables, cls, ixps }
     * @param _id { String } - selection id
     */
    async handleSetFeatureOntoMap({ t, data, color }) {
      this.$store.dispatch('editor/toggleMapFormLoading', true)
      const fc = await getGeometries(
        t,
        data.map(item => item._id),
        await this.$auth.getUserID()
      )

      return fc
        ? this.$emit(`${events.SET_SELECTION_ONTO_MAP}`, {
            t,
            fc,
            categoryColor: color,
            removeLoadState: true
          })
        : this.$store.dispatch('editor/toggleMapFormLoading', false)
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
    sendData() {
      const format = {
        cls: [],
        draw: {},
        ixps: [],
        facilities: [],
        subsea: [],
        terrestrials: []
      }
      const t = categoriesDictionary.getRaw()
      for (let categoryId in t) {
        for (let key in t[categoryId].data) {
          if (!key.includes('custom')) {
            if (key == 'subsea cables') {
              format.subsea = [
                ...format.subsea,
                ...Object.keys(t[categoryId].data[key])
              ]
            } else if (key == 'terrestrial networks') {
              format.terrestrials = [
                ...format.terrestrials,
                ...Object.keys(t[categoryId].data[key])
              ]
            } else {
              format[key] = [
                ...format[key],
                ...Object.keys(t[categoryId].data[key])
              ]
            }
          }
        }
      }
      format.draw = sceneDictionary.getCollectionList()
      const data = {
        ...this.form,
        ...format,
        config: {
          categories: t
        }
      }

      return this.$emit(`${events.SEND_DATA}`, data)
    },
    handleClose(tag) {
      this.form.address.splice(this.form.address.indexOf(tag), 1)
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
