<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title capitalize">{{ title }} Facility</h1>
    </header>
    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Name">
        <el-input
          class="w-fit-full"
          :class="{ dark }"
          v-model="form.name"
          :disabled="isViewMode"
        />
      </el-form-item>
      <el-form-item label="Address" class="mt2">
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
      <el-form-item label="Website">
        <el-input
          class="w-fit-full"
          :class="{ dark }"
          :disabled="isViewMode"
          v-model="form.website"
          @change="validateURL"
        />
        <el-alert
          v-if="isURLValid !== null && !isURLValid"
          title="This url is not valid"
          type="error"
          class="mt2 p1"
          :closable="false"
        />
      </el-form-item>
      <el-form-item label="IXPs">
        <el-select
          v-model="form.ixps"
          class="w-fit-full"
          :class="{ dark }"
          multiple
          filterable
          :disabled="isViewMode"
          placeholder
        >
          <el-option
            v-for="(opt, i) in ixpsList"
            :key="i"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Tags" class="mt2">
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
      <el-form-item label="Ready For Service (RFS)">
        <el-date-picker
          class="inline-block w-fit-full-imp"
          v-model="form.startDate"
          type="year"
          :class="{ dark }"
          :disabled="isViewMode"
          placeholder
        />
      </el-form-item>
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
      <el-form-item class="mt12" v-if="!isViewMode">
        <el-button
          type="primary"
          class="w-fit-full capitalize"
          round
          @click="sendData"
        >
          {{ title }} Facility
        </el-button>
      </el-form-item>
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

export default {
  name: 'FacsForm',
  components: {
    AutocompleteGoogle
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
    tagOnEdit: null,
    facilitiesTypes,
    facilitiesBuildingTypes,
    isURLValid: null,
    inputVisible: false,
    tagsList: [],
    addressList: [],
    ixpsList: [],
    tagRules: {
      reference: [
        {
          required: true,
          message: 'Please input a reference name',
          trigger: ['blur', 'change']
        },
        {
          min: 2,
          max: 5,
          message: 'Length should be 2 to 5',
          trigger: ['blur', 'change']
        }
      ],
      address: []
    },
    formRules: {}
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
  mounted() {
    if (this.mode === 'create') {
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      }, 50)
    }
  },
  methods: {
    sendData() {
      return this.$refs['form'].validate(isValid =>
        isValid ? this.$emit('send-data') : false
      )
    },
    async getTagsList(s) {
      const res = await getTags({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.form.tagsList = res.data
      }
    },
    handleAddressRemove(tag) {
      this.form.address.splice(this.form.websites.indexOf(tag), 1)
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
