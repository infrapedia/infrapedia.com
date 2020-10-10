<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules">
      <el-row :gutter="60" v-if="step == 1">
        <el-col :span="12">
          <el-row>
            <el-col span="24">
              <el-form-item label="Name" prop="name">
                <el-input
                  class="w-fit-full"
                  :class="{ dark }"
                  v-model="form.name"
                  clearable
                  @input="checkName"
                  :disabled="isViewMode"
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
            <el-col span="24">
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
            <el-col span="24">
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
            <el-col span="24">
              <el-form-item
                label="Ready For Service (RFS)"
                prop="StartDate"
                required
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
            <el-col span="24">
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
            <el-col span="24">
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
        <el-col :span="12">
          <el-row>
            <el-col span="24">
              <el-alert
                type="info"
                class="mt10 h11 mb5"
                title="The following fields interact with the map"
                :closable="false"
              />
            </el-col>
            <el-col span="24">
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
            <el-col span="24">
              <el-form-item label="IXPs">
                <v-multi-select
                  :mode="mode"
                  :options="ixpsList"
                  @input="loadIXpsSearch"
                  :loading="isLoadingIXPs"
                  :value="mode == 'create' ? [] : form.ixps"
                  @values-change="handleIxpsSelectChange"
                  @remove="handleIxpsSelectRemoveItem"
                />
              </el-form-item>
            </el-col>
            <el-col span="24">
              <el-form-item label="Owners" prop="owners" required>
                <v-multi-select
                  :mode="mode"
                  :is-required="true"
                  :is-field-empty="isOwnersSelectEmpty"
                  :options="ownersList"
                  @input="loadOwnersSearch"
                  :loading="isLoadingOwners"
                  :value="mode == 'create' ? [] : form.owners"
                  @values-change="handleOwnersSelectChange"
                  @remove="handleOwnersSelectRemoveItem"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- <el-form-item class="mt12" v-if="!isViewMode">
        <el-button
          type="primary"
          class="w-fit-full capitalize"
          round
          :disabled="isSendDataDisabled"
          :loading="isSendingData"
          @click="sendData"
        >
          {{ title }} Facility
        </el-button> -->
      <!-- </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import validateUrl from '../../helpers/validateUrl'
import {
  facilitiesTypes,
  facilitiesBuildingTypes
} from '../../config/facilitiesTypes'
import { getTags } from '../../services/api/tags'
import AutocompleteGoogle from '../../components/AutocompleteGoogle'
import { searchIxps } from '../../services/api/ixps'
import VMultiSelect from '../../components/MultiSelect'
import { searchOrganization } from '../../services/api/organizations'
import { checkFacilityNameExistence } from '../../services/api/check_name'
import debounce from '../../helpers/debounce'

export default {
  name: 'FacsForm',
  components: {
    AutocompleteGoogle,
    VMultiSelect
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
    isNameRepeated: false,
    isOwnersSelectEmpty: false,
    tagOnEdit: null,
    facilitiesTypes,
    facilitiesBuildingTypes,
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
    step: {
      type: Number,
      required: true
    },
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
            message: 'At least one owner is required',
            trigger: ['blur', 'change']
          }
        ]
      }
    },
    title() {
      return this.mode == 'create'
        ? 'Create'
        : this.mode == 'view'
        ? 'View'
        : 'Edit'
    },
    isViewMode() {
      return this.mode == 'view'
    },
    dark() {
      return this.$store.state.isDark
    },
    autocompleteAddress() {
      return this.tag ? this.tag.fullAddress : ''
    },
    tagMode() {
      return this.tagOnEdit !== null && this.tag ? 'edit' : 'create'
    }
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
      }
    },
    sendData() {
      this.setOwnersEmptyState()
      return this.$refs['form'].validate(isValid =>
        isValid ? this.$emit('send-data') : false
      )
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
    handleIxpsSelectChange(data) {
      this.form.ixps = Array.from(data)
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
