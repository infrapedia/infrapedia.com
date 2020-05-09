<template>
  <el-dialog
    :visible="visible"
    :custom-class="dark ? 'custom-dialog dark' : 'custom-dialog'"
    :before-close="handleBeforeClose"
    :close-on-click-modal="false"
  >
    <header slot="title" class="w-fit-full">
      <h1
        class="title-user-variant w-fit-full fs-xlarge text-center capitalize"
        :class="{ dark }"
      >
        {{ title }} organization
      </h1>
    </header>
    <el-form ref="orgForm" :model="form" :rules="formRules" class="p2">
      <el-form-item label="Name" prop="name" required>
        <el-input :class="{ dark }" class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="URL" prop="link">
        <el-input :class="{ dark }" class="w-fit-full" v-model="form.link" />
      </el-form-item>
      <el-form-item label="Information" prop="inf">
        <el-input
          :class="{ dark }"
          type="textarea"
          class="w-fit-full"
          v-model="form.information"
          :rows="4"
        />
      </el-form-item>
      <el-upload
        accept="image/*.jpg"
        :action="uploadURL"
        :file-list="fileList"
        :headers="uploadLogoHeaders"
        :on-success="handleLogoUpload"
        :before-upload="handleUploadProgress"
      >
        <el-button size="small" type="primary">Click to upload</el-button>
        <div slot="tip" class="el-upload__tip mt2 ml1" :class="{ dark }">
          - jpg files only
        </div>
      </el-upload>
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
            @click="showInput"
          >
            Add
          </el-button>
        </el-collapse-transition>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer-mobile">
      <el-button
        class="h10 capitalize"
        :class="{ dark }"
        type="primary"
        plain
        :disabled="isUploadingImage"
        round
        @click="sendData"
      >
        {{ saveBtn }}
      </el-button>
      <el-button class="h10" :class="{ dark }" round @click="handleBeforeClose">
        Cancel
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import apiConfig from '../../config/apiConfig'
import countriesList from '../../config/countriesList'
import AutocompleteGoogle from '../../components/AutocompleteGoogle'

export default {
  name: 'OrgForm',
  components: {
    AutocompleteGoogle
  },
  data: () => ({
    fileList: [],
    countriesList,
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
    formRules: {
      name: [
        {
          required: true,
          message: 'Please input a name for this organization',
          trigger: ['blur', 'change']
        },
        {
          min: 2,
          message: 'Length should be at least 2',
          trigger: ['blur', 'change']
        }
      ],
      link: [],
      inf: []
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
          max: 5,
          message: 'Length should be 2 to 5',
          trigger: ['blur', 'change']
        }
      ],
      address: []
    },
    tagOnEdit: null,
    inputVisible: false,
    isUploadingImage: false,
    isTagReferenceMissing: false
  }),
  props: {
    visible: {
      type: Boolean,
      required: true
    },
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
    uploadLogoHeaders() {
      return { user_id: this.$auth.user.sub }
    },
    title() {
      return this.mode === 'create' ? 'Create' : 'Edit'
    },
    saveBtn() {
      return this.mode === 'create' ? 'Create organization' : 'Save changes'
    },
    dark() {
      return this.$store.state.isDark
    },
    uploadURL() {
      return `${apiConfig.url}/auth/upload/logo`
    },
    autocompleteAddress() {
      return this.tag ? this.tag.fullAddress : ''
    },
    tagMode() {
      return this.tagOnEdit !== null && this.tag ? 'edit' : 'create'
    }
  },
  methods: {
    handleUploadProgress() {
      this.isUploadingImage = true
    },
    handleLogoUpload(res) {
      if (!res.data && res.data.r.length) return
      this.form.logo = res.data.r[0]
      this.isUploadingImage = false
    },
    sendData() {
      return this.$refs['orgForm'].validate(isValid =>
        isValid ? this.$emit('send-data') : false
      )
    },
    handleBeforeClose() {
      this.fileList = []
      this.tagOnEdit = null
      this.inputVisible = false
      this.isTagReferenceMissing = false
      this.$refs['orgForm'].clearValidate()
      return this.$emit('close')
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
