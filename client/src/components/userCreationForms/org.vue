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
      <el-form-item label="PeeringDB ID" prop="peerindDBId" v-if="isAdmin">
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.ooid"
          @input="checkPeeringDbId"
        />
        <el-alert
          v-if="isPeeringDbIdRepeated"
          class="mt4 p2"
          type="error"
          :closable="false"
          description="This ID already exits in our database. Consider checking the value you entered."
        />
      </el-form-item>
      <el-form-item label="ASN">
        <el-select
          v-model="form.asn"
          class="w-fit-full"
          multiple
          filterable
          placeholder
          allow-create
        >
          <el-option
            v-for="item in asnOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
                  :width="520"
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
    </el-form>
    <div class="dialog-footer-mobile mt4">
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
    <el-form slot="footer" v-if="mode !== 'create'" v-loading="!linkedElements">
      <el-divider />
      <el-form-item label="Associations" v-if="linkedElements">
        <div class="flex column w-fit-full">
          <template v-for="(label, i) of linkedElements.labels">
            <el-form-item :label="label" :key="i" class="ml2 mt2">
              <v-multi-select
                mode="edit"
                get-selected-id
                :loading="linkedElements.loading"
                :value="mode == 'create' ? [] : linkedElements.values[i]"
                :options="linkedElements.options[label.toLowerCase()]"
                @remove="
                  handleLinkedElementsRemove({
                    type: label,
                    selection: $event
                  })
                "
                @input="handleSearchLinkedElements(label, $event)"
                @values-change="
                  handleLinkedElementsChange({
                    type: label,
                    selection: $event
                  })
                "
              />
            </el-form-item>
          </template>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import apiConfig from '../../config/apiConfig'
import countriesList from '../../config/countriesList'
import { uploadOrgLogo } from '../../services/api/uploads'
import { checkOrganizationNameExistence } from '../../services/api/check_name'
import debounce from '../../helpers/debounce'
import {
  getOrgLinkedElements,
  setOrgSubseaAssociations,
  removeOrgSubseaAssociations,
  removeOrgTerrestrialsAssociations,
  setOrgTerrestrialsAssociations,
  setOrgClsAssociations,
  setOrgIxpsAssociations,
  removeOrgClsAssociations,
  removeOrgKnownUsersAssociations,
  removeOrgFacilitiesAssociations,
  setOrgKnownUsersAssociations,
  setOrgFacilitiesAssociations,
  removeOrgIxpsAssociations,
  checkOrganizationPeeringDBId,
  setOrgFacilityTenantsAssociations,
  removeOrgFacilityTenantsAssociations
} from '../../services/api/organizations'
import {
  getSearchByCablesS,
  getSearchByCablesT
} from '../../services/api/cables'
import { searchIxps } from '../../services/api/ixps'
import { searchCls } from '../../services/api/cls'
import { searchFacilities } from '../../services/api/facs'

export default {
  name: 'OrgForm',
  components: {
    VMultiSelect: () => import('../../components/MultiSelect'),
    AutocompleteGoogle: () => import('../../components/AutocompleteGoogle')
  },
  data: () => ({
    fileList: [],
    asnOptions: [],
    countriesList,
    linkedElements: null,
    isNameRepeated: false,
    isPeeringDbIdRepeated: false,
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
      return this.tag.fullAddress
    },
    tagMode() {
      return this.tagOnEdit != null && this.tag ? 'edit' : 'create'
    },
    isAdmin() {
      return this.$auth.isUserAnAdmin
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
    checkPeeringDbId: debounce(async function checkPDBId(_id) {
      if (this.mode == 'create') {
        const {
          t,
          data: { r }
        } = (await checkOrganizationPeeringDBId({
          user_id: this.$auth.getUserID(),
          _id
        })) || { t: 'error', data: { r: false } }

        if (t != 'error' && r >= 1) {
          this.isPeeringDbIdRepeated = true
        } else {
          this.isPeeringDbIdRepeated = false
        }
      }
    }, 320),
    /**
     * @param t { string } - The type of the elemnt: subsea cable, terretrial networks, cls, known users, etc...
     * @param search { string } - Query search
     */
    async handleSearchLinkedElements(t, search) {
      this.linkedElements.loading = true

      let results = []
      let method = null
      const args = {
        user_id: await this.$auth.getUserID(),
        s: search
      }
      t = t.toLowerCase()

      switch (t) {
        case 'terrestrial networks (ownership)':
          method = getSearchByCablesT
          break
        case 'cls (ownership)':
          method = searchCls
          break
        case 'ixps (ownership)':
          method = searchIxps
          break
        case 'subsea cables (user)':
          method = getSearchByCablesS
          break
        case 'facilities (ownership)':
          method = searchFacilities
          break
        case 'facilities (tenant)':
          method = searchFacilities
          break
        default:
          method = getSearchByCablesS
          break
      }

      if (method) {
        const { data } = (await method(args)) || { data: [] }
        results = data ? data : []
      }

      this.linkedElements.loading = false
      this.linkedElements.options[t] = results
    },
    /**
     * @param type { String } - The type of the elemnt: subsea cable, terretrial networks, cls, known users, etc...
     * @param valuePosition { Number } - Index, position of the value elemnt
     * @param selection { String } - Selection => _id: [ObjectID]
     */
    async handleLinkedElementsChange({ type, selection }) {
      const args = {
        _id: selection,
        org_id: this.form._id,
        user_id: await this.$auth.getUserID()
      }

      try {
        switch (type.toLowerCase()) {
          case 'terrestrial networks (ownership)':
            await setOrgTerrestrialsAssociations(args)
            break
          case 'cls (ownership)':
            await setOrgClsAssociations(args)
            break
          case 'ixps (ownership)':
            await setOrgIxpsAssociations(args)
            break
          case 'facilities (ownership)':
            await setOrgFacilitiesAssociations(args)
            break
          case 'subsea cables (user)':
            await setOrgKnownUsersAssociations(args)
            break
          case 'facilities (tenant)':
            await setOrgFacilityTenantsAssociations(args)
            break
          default:
            await setOrgSubseaAssociations(args)
            break
        }
      } catch (err) {
        console.error(err)
      }
    },
    async handleLinkedElementsRemove({ type, selection }) {
      const args = {
        _id: selection,
        org_id: this.form._id,
        user_id: await this.$auth.getUserID()
      }

      switch (type.toLowerCase()) {
        case 'terrestrial networks (ownership)':
          await removeOrgTerrestrialsAssociations(args)
          break
        case 'ixps (ownership)':
          await removeOrgIxpsAssociations(args)
          break
        case 'facilities (ownership)':
          await removeOrgFacilitiesAssociations(args)
          break
        case 'subsea cables (user)':
          await removeOrgKnownUsersAssociations(args)
          break
        case 'cls (ownership)':
          await removeOrgClsAssociations(args)
          break
        case 'facilities (tenant)':
          await removeOrgFacilityTenantsAssociations(args)
          break
        default:
          await removeOrgSubseaAssociations(args)
          break
      }
    },
    async getOrgLinkedElements(id) {
      const [
        facilities,
        knownUsersFacilities,
        subsea,
        knownUsers,
        cls,
        ixps,
        terrestrial
      ] = await getOrgLinkedElements({
        user_id: this.$auth.getUserID(),
        id
      })

      this.linkedElements = {
        loading: false,
        labels: [
          'Facilities (Ownership)',
          'Facilities (Tenant)',
          'Subsea Cables (Ownership)',
          'Subsea Cables (User)',
          'CLS (Ownership)',
          'IXPS (Ownership)',
          'Terrestrial Networks (Ownership)'
        ],
        options: {
          'facilities (ownership)': [],
          'facilities (tenant)': [],
          'subsea cables (ownership)': [],
          'subsea cables (user)': [],
          'cls (ownership)': [],
          'ixps (ownership)': [],
          'terrestrial networks (ownership)': []
        },
        values: [
          facilities.r ? facilities.r : facilities,
          knownUsersFacilities.r
            ? knownUsersFacilities.r
            : knownUsersFacilities,
          subsea.r ? subsea.r : subsea,
          knownUsers.r ? knownUsers.r : knownUsers,
          cls.r ? cls.r : cls,
          ixps.r ? ixps.r : ixps,
          terrestrial.r ? terrestrial.r : terrestrial
        ]
      }
    },
    checkName: debounce(async function(name) {
      if (this.mode == 'create') {
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
