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
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.name"
          clearable
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
      <el-form-item label="Logo">
        <el-upload
          class="w-fit-full inline-block"
          ref="upload"
          accept="image/*.jpg"
          list-type="picture"
          :multiple="false"
          :auto-upload="false"
          :action="uploadURL"
          :http-request="handleUserLogoUpload"
          :file-list="fileList"
          :on-remove="handleFileListRemove"
          :on-change="handleFileListChange"
        >
          <el-button size="small" type="primary">Click to upload</el-button>
          <div slot="tip" class="el-upload__tip ml1" :class="{ dark }">
            - jpg files only
          </div>
        </el-upload>
      </el-form-item>
      <el-collapse-transition>
        <el-alert
          v-show="uploadLogo.show"
          :closable="false"
          :type="uploadLogo.type"
          :title="uploadLogo.text"
        />
      </el-collapse-transition>
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
              <el-form-item
                label="Reference (e.g: 'HQ', 'Amsterdam Office', 'Sales Department')"
                prop="reference"
                required
              >
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
      <el-form-item class="mt12" label="Associations" v-if="linkedElements">
        <div class="block w-fit-full">
          <template v-for="(label, i) of Object.keys(linkedElements)">
            <div
              v-if="linkedElements[label].length"
              :key="i"
              class="ml2 inline-block"
            >
              <span
                class="el-form-item__label inline-block text-left w-fit-full mt2 capitalize"
              >
                {{ label }}
              </span>
              <el-tag
                v-for="tag in linkedElements[label]"
                :show-close="false"
                :key="tag._id"
              >
                {{ tag.label }}
              </el-tag>
            </div>
          </template>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer-mobile">
      <el-button
        class="h10 capitalize"
        :class="{ dark }"
        type="primary"
        plain
        :disabled="uploadLogo.loading"
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
import { uploadOrgLogo } from '../../services/api/uploads'
import AutocompleteGoogle from '../../components/AutocompleteGoogle'
import { checkOrganizationNameExistence } from '../../services/api/check_name'
import debounce from '../../helpers/debounce'
import { getOrgLinkedElements } from '../../services/api/organizations'

export default {
  name: 'OrgForm',
  components: {
    AutocompleteGoogle
  },
  data: () => ({
    fileList: [],
    countriesList,
    linkedElements: null,
    isNameRepeated: false,
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
          type: 'string',
          trigger: 'change',
          message: 'Please input a valid name',
          transform: value => value.trim(),
          // eslint-disable-next-line
          pattern: /^[\A-Za-zÀ-ÖØ-öø-ÿ&.,0-9()´‘'’ /\-]+$/
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
        }
      ],
      address: []
    },
    uploadLogo: {
      text: '',
      type: '',
      show: false,
      loading: false
    },
    tagOnEdit: null,
    inputVisible: false,
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
    title() {
      return this.mode == 'create' ? 'Create' : 'Edit'
    },
    saveBtn() {
      return this.mode == 'create' ? 'Create organization' : 'Save changes'
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
      return this.tagOnEdit != null && this.tag ? 'edit' : 'create'
    }
  },
  watch: {
    async mode(str) {
      if (str == 'edit') {
        this.setLogoUrl()
        await this.getOrgLinkedElements(this.form._id)
      }
    },
    visible(bool) {
      if (bool) {
        setTimeout(() => {
          if (this.$refs.orgForm) {
            this.$refs.orgForm.clearValidate()
          }
        }, 50)
      } else {
        this.fileList = []
        this.linkedElements = null
      }
    }
  },
  methods: {
    async getOrgLinkedElements(id) {
      const [
        cls,
        subsea,
        terrestrial,
        facilities,
        knownUsers
      ] = await getOrgLinkedElements({
        user_id: this.$auth.getUserID(),
        id
      })

      this.linkedElements = {
        cls: cls.r ? cls.r : cls,
        subsea: subsea.r ? subsea.r : subsea,
        knownUsers: knownUsers.r ? knownUsers.r : knownUsers,
        facilities: facilities.r ? facilities.r : facilities,
        terrestrial: terrestrial.r ? terrestrial.r : terrestrial
      }
    },
    checkName: debounce(async function(name) {
      this.isNameRepeated = false
      const {
        t,
        data: { r }
      } = (await checkOrganizationNameExistence({
        user_id: this.$auth.getUserID(),
        name
      })) || { t: 'error', data: { r: false } }
      if (t != 'error' && r >= 1) {
        this.isNameRepeated = true
      } else {
        this.isNameRepeated = false
      }
    }, 320),
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
    sendData() {
      return this.$refs['orgForm'].validate(isValid =>
        isValid ? this.$emit('send-data') : false
      )
    },
    handleBeforeClose() {
      this.fileList = []
      this.clearAddress()
      this.uploadLogo = {
        text: '',
        type: '',
        show: false,
        loading: false
      }
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
    editAddress({ ...tag }, i) {
      if (!tag.fullAddress) {
        tag.fullAddress = `${tag.city ? tag.city : ''}${
          tag.state ? ` (${tag.state}), ` : ''
        }${tag.country ? tag.country : ''}`
      }
      this.tag = tag
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
