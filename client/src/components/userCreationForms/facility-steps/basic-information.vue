<template>
  <el-form :model="form" ref="form">
    <el-row :gutter="60">
      <el-col :span="8">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Name" prop="name" :rules="formRules.name">
              <el-input
                v-model="form.name"
                :class="{ dark }"
                :disabled="isViewMode"
                clearable
                class="w-fit-full"
                @input="checkName"
              />
              <el-alert
                v-if="isNameRepeated"
                class="mt4 p2"
                type="error"
                :closable="false"
                description="This name already exists in our database. Use a different name or
                    consider extending your name."
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Website">
              <el-input
                class="w-fit-full"
                :class="{ dark }"
                :disabled="isViewMode"
                v-model="form.website"
                @input="validateURL"
              />
              <el-collapse-transition>
                <el-alert
                  v-if="isURLValid !== null && !isURLValid"
                  title="This url is not valid"
                  type="error"
                  class="mt2 p1"
                  :closable="false"
                />
              </el-collapse-transition>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Type">
              <el-select
                v-model="form.t"
                :disabled="isViewMode"
                class="w-fit-full"
                :class="{ dark }"
                placeholder
              >
                <el-option
                  v-for="(opt, i) in facilitiesTypes"
                  :key="i"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="Ready For Service (RFS)"
              prop="StartDate"
              :rules="formRules.StartDate"
            >
              <el-date-picker
                class="inline-block w-fit-full-imp"
                v-model="form.StartDate"
                type="year"
                :class="{ dark }"
                :disabled="isViewMode"
                placeholder
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Type of building">
              <el-select
                v-model="form.building"
                class="w-fit-full"
                :class="{ dark }"
                :disabled="isViewMode"
                placeholder
              >
                <el-option
                  v-for="(opt, i) in facilitiesBuildingTypes"
                  :key="i"
                  :value="opt.value"
                >
                  <span class="capitalize">
                    {{ opt.label }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Tags">
              <el-select
                v-model="form.tags"
                multiple
                filterable
                :disabled="isViewMode"
                placeholder
                allow-create
                :class="{ dark }"
                class="w-fit-full"
                collapse-tags
                default-first-option
                @change="getTagsList"
              >
                <el-option
                  v-for="item in form.tagsList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <el-row>
          <el-col :span="24">
            <el-alert
              type="info"
              :class="{ dark }"
              class="mt10 h11 mb5"
              title="The following fields interact with the map"
              :closable="false"
            />
          </el-col>
          <el-col :span="24">
            <el-form-item label="Address">
              <div class="flex row wrap w-fit-full">
                <el-tag
                  :key="i"
                  v-for="(tag, i) in form.address"
                  :closable="!isViewMode"
                  :disable-transitions="false"
                  @close="handleAddressRemove(tag)"
                >
                  {{ tag.reference }}
                  <fa
                    :icon="['fas', 'pen']"
                    class="cursor-pointer w24 ml1 inline-block"
                    @click="editAddress(tag, i)"
                  />
                </el-tag>
              </div>
              <el-collapse-transition>
                <el-card
                  v-if="inputVisible"
                  class="p4 w-auto mt2"
                  shadow="never"
                >
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
                        @place-changed="handleAddressChange"
                        :value="autocompleteAddress"
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
                  :disabled="isViewMode"
                  @click="showAdressInput"
                >
                  Add
                </el-button>
              </el-collapse-transition>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="IXPs">
              <v-multi-select
                :options="ixpsList"
                :mode="multiSelectsMode"
                @input="loadIXpsSearch"
                :loading="isLoadingIXPs"
                :value="multiSelectsMode == 'create' ? [] : form.ixps"
                @values-change="handleIxpsSelectChange"
                @remove="handleIxpsSelectRemoveItem"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="Owners"
              prop="owners"
              :rules="formRules.owners"
            >
              <v-multi-select
                :mode="multiSelectsMode"
                :is-required="true"
                :is-field-empty="isOwnersSelectEmpty"
                :options="ownersList"
                @input="loadOwnersSearch"
                @blur="validateOwnerField"
                :loading="isLoadingOwners"
                :value="multiSelectsMode == 'create' ? [] : form.owners"
                @values-change="handleOwnersSelectChange"
                @remove="handleOwnersSelectRemoveItem"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8">
        <div class="editor-map-wrapper mt5">
          <editor-map
            :key="1"
            :form="form"
            type="facilities"
            id="editor-map-facilities-dashboard"
            @features-list-change="handleFeaturesListChange"
            @error-loading-draw-onto-map="handleFileConvertionFailed"
          />
          <el-alert type="info" :closable="false">
            <div>
              Points: Click once to edit the properties of the facility or
              change its position
            </div>
            <div class="mt1">
              Polygons: Click once to edit the properties of a segment
            </div>
          </el-alert>
        </div>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import validateUrl from '../../../helpers/validateUrl'
import {
  facilitiesTypes,
  facilitiesBuildingTypes
} from '../../../config/facilitiesTypes'
import { getTags } from '../../../services/api/tags'
import { getIxpsGeoms, searchIxps } from '../../../services/api/ixps'
import EditorMap from '../../../components/editor/Editor'
import VMultiSelect from '../../../components/MultiSelect'
import { searchOrganization } from '../../../services/api/organizations'
import { checkFacilityNameExistence } from '../../../services/api/check_name'
import debounce from '../../../helpers/debounce'
import { bus } from '../../../helpers/eventBus'
import {
  EDITOR_SET_FEATURES,
  EDITOR_FILE_CONVERTED,
  EDITOR_SET_FEATURES_LIST
} from '../../../events/editor'
import { fCollectionFormat } from '../../../helpers/featureCollection'
import { sceneDictionary } from '../../../components/editor'
import { STORAGE__WATCH } from '../../../lib/Dictionary'

export default {
  name: 'BasicInformation',
  components: {
    EditorMap,
    VMultiSelect,
    AutocompleteGoogle: () => import('../../../components/AutocompleteGoogle')
  },
  data: () => ({
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
    multiSelectsMode: 'create',
    isNameRepeated: false,
    isOwnersSelectEmpty: false,
    tagOnEdit: null,
    isURLValid: null,
    inputVisible: false,
    tagsList: [],
    addressList: [],
    isLoadingIXPs: false,
    isLoadingOwners: false,
    ixpsList: [],
    ownersList: []
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
    isViewMode() {
      return this.mode == 'view'
    },
    dark() {
      return this.$store.state.isDark
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
            message: 'Length should be at least 2',
            trigger: ['blur', 'change']
          }
        ],
        address: []
      }
    },
    autocompleteAddress() {
      return this.tag ? this.tag.fullAddress : ''
    },
    tagMode() {
      return this.tagOnEdit !== null && this.tag ? 'edit' : 'create'
    },
    facilitiesTypes() {
      return facilitiesTypes
    },
    facilitiesBuildingTypes() {
      return facilitiesBuildingTypes
    },
    formRules() {
      return {
        name: [
          {
            required: true,
            message: 'Please input facility name',
            trigger: 'change'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'change' }
        ],
        StartDate: [
          {
            type: 'date',
            required: true,
            trigger: ['blur', 'change'],
            message: 'Please pick a date'
          }
        ],
        owners: [
          {
            type: 'array',
            required: true,
            message: 'At least one owner is required',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created() {
    sceneDictionary.on(STORAGE__WATCH, this.handleFeaturesListChange)
  },
  async mounted() {
    if (this.mode != 'create') {
      // I know `this.mode` can be only either one of these 2: create, edit
      this.multiSelectsMode = this.mode
    }

    if (this.form.geom.length >= 1) {
      bus.$emit(`${EDITOR_SET_FEATURES_LIST}`, this.form.geom)
    }

    if (this.form.ixps.length >= 1) {
      this.multiSelectsMode = 'update'
      this.ixpsList = [...this.form.ixps]
      await this.handleIxpsSelectChange(this.form.ixps)
    }
  },
  beforeDestroy() {
    sceneDictionary.off(STORAGE__WATCH, this.handleFeaturesListChange)
  },
  watch: {
    'form.ixpsList'(ixps) {
      if (!ixps) return
      this.ixpsList = [...ixps]
      delete this.form.ixpsList
    },
    'form.ownersList'(owners) {
      if (!owners) return
      this.ownersList = [...owners]
      delete this.form.ownersList
    }
  },
  methods: {
    handleFeaturesListChange() {
      this.form.geom = sceneDictionary.getCollectionList()
    },
    validateOwnerField() {
      this.$refs.form.validateField('owners')
      this.setOwnersEmptyState()
    },
    handleFileConvertionFailed: debounce(function() {
      this.isManualUploadDialog = true
      this.$router.replace(
        `${this.$route.path}?id=${this.$route.query.id}&failedToUploadKMz=true`
      )
    }, 320),
    async handleSetSelectionOntoMap(data) {
      await bus.$emit(`${EDITOR_SET_FEATURES}`, data)
    },
    handleFileConverted(fc) {
      bus.$emit(`${EDITOR_FILE_CONVERTED}`, fc)
    },
    checkName: debounce(async function(name) {
      this.isNameRepeated = false
      const {
        t,
        data: { r }
      } = (await checkFacilityNameExistence({
        user_id: this.$auth.getUserID(),
        name
      })) || { t: 'error', data: { r: false } }

      if (t != 'error' && r >= 1) {
        this.isNameRepeated = true
      } else {
        this.isNameRepeated = false
      }
    }, 320),
    handleOwnersSelectChange(data) {
      this.form.owners = data
      this.setOwnersEmptyState()
    },
    setOwnersEmptyState() {
      if (this.form.owners.length <= 0) {
        this.isOwnersSelectEmpty = true
      } else {
        this.isOwnersSelectEmpty = false
      }
    },
    async loadIXpsSearch(s) {
      if (s == '') return

      this.isLoadingIXPs = true
      const res = await searchIxps({ user_id: await this.$auth.getUserID(), s })
      if (res && res.data) {
        this.ixpsList = res.data
      }

      this.isLoadingIXPs = false
    },
    async loadOwnersSearch(s) {
      if (s == '') return

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
    async handleIxpsSelectChange(data) {
      this.form.ixps = Array.from(data)
      const {
        data: { r: featureCollection = [] }
      } = (await getIxpsGeoms({
        ids: data.map(c => c._id),
        user_id: this.$auth.getUserID()
      })) || {
        data: { featureCollection: [] }
      }
      return this.$emit('set-selection-onto-map', {
        fc: Array.isArray(featureCollection)
          ? fCollectionFormat(featureCollection)
          : featureCollection
      })
    },
    handleIxpsSelectRemoveItem(_id) {
      this.form.ixps = this.form.ixps.filter(item => item._id != _id)
    },
    async getTagsList(s) {
      const res = await getTags({ user_id: await this.$auth.getUserID(), s })
      if (res && res.data) {
        this.form.tagsList = res.data
      }
    },
    handleAddressRemove(tag) {
      this.form.address.splice(this.form.address.indexOf(tag), 1)
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
    validateURL(url) {
      this.isURLValid = validateUrl(url)
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
    showAdressInput() {
      this.inputVisible = true
      try {
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      } catch {
        // Ignore
      }
    }
  }
}
</script>
