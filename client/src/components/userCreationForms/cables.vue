<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8" v-if="showTitle">
      <h1 class="title capitalize">{{ title }}</h1>
    </header>
    <el-form ref="form" :model="form" :rules="formRules" id="cablesForm">
      <el-form-item label="Name" prop="name" required>
        <el-input
          :autofocus="isManualKmzUpload"
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
      <el-form-item label="Status" prop="category" required>
        <el-select
          class="w-fit-full"
          filterable
          :class="{ dark }"
          v-model="form.category"
          placeholder
        >
          <el-option
            v-for="(opt, i) in cableStates"
            :key="i"
            :label="opt"
            :value="opt"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="System length" prop="systemLength">
        <el-input-number
          :min="0"
          :class="{ dark }"
          class="w-fit-full"
          controls-position="right"
          v-model="form.systemLength"
        />
      </el-form-item>
      <el-form-item
        v-if="creationID == 'subsea'"
        label="RFS (Ready for Service)"
        prop="activationDateTime"
        required
      >
        <el-date-picker
          type="month"
          :class="{ dark }"
          class="w-fit-full-imp"
          v-model="form.activationDateTime"
        />
      </el-form-item>
      <el-form-item label="URL(s)" prop="urls">
        <div class="w-fit-full relative inline-block">
          <div class="flex row wrap">
            <el-tag
              :key="tag"
              v-for="tag in form.urls"
              closable
              style="max-width: 16rem;"
              :title="tag"
              class="mr1 mb4 p2 no-overflow-x vertical-align"
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              <span
                class="inline-block h7 p0 no-overflow-x truncate"
                style="max-width: 12rem;"
              >
                {{ tag }}
              </span>
            </el-tag>
          </div>
          <template v-if="inputVisible">
            <el-input
              :class="{ dark }"
              v-model="tag"
              ref="saveTagInput"
              size="mini"
              @input="validateURL"
              @keyup.enter.native="confirmTag"
              @blur="confirmTag"
            />
            <el-collapse-transition>
              <el-alert
                v-if="isURLValid !== null && !isURLValid"
                title="This url is not valid"
                show-icon
                type="warning"
                effect="dark"
                class="h6"
                :closable="false"
              />
            </el-collapse-transition>
            <el-collapse-transition>
              <el-alert
                v-if="warnTagDuplicate"
                title="This url is duplicated"
                show-icon
                type="info"
                effect="dark"
                class="h6"
                :closable="false"
              />
            </el-collapse-transition>
          </template>
          <el-button
            v-else
            :class="{ dark }"
            class="w42 text-center"
            size="small"
            @click="showInput"
          >
            Add url
          </el-button>
        </div>
      </el-form-item>
      <template v-if="creationID == 'subsea'">
        <el-form-item label="Design Capacity (Tbps)" prop="tbpsCapacity">
          <el-input-number
            :min="0"
            :class="{ dark }"
            class="w-fit-full"
            controls-position="right"
            v-model="form.capacityTBPS"
          />
        </el-form-item>
        <el-form-item label="Lit Capacity" prop="litCapacity">
          <el-button
            class="inline-block"
            size="small"
            :class="{ dark }"
            @click="addLitCapacityField"
          >
            Add lit capacity
          </el-button>
          <el-collapse v-model="collapseItem" class="mt1">
            <el-collapse-item :name="1">
              <div class="inline-block">
                <transition-group name="fade" mode="in-out" appear tag="div">
                  <div
                    v-for="(field, i) in form.litCapacity"
                    :key="i + 'field'"
                    class="relative mt12"
                  >
                    <div class="capacity-field p4 el-card shadow--never">
                      <el-date-picker
                        size="small"
                        class="date-picker mr1"
                        v-model="field.year"
                        type="year"
                        placeholder
                      />
                      <el-input-number
                        size="small"
                        :min="0"
                        controls-position="right"
                        v-model="field.cap"
                      />
                    </div>
                    <span
                      class="absolute z-index2 circle remove transition-all vertical-align"
                    >
                      <small
                        class="underline-hover"
                        @click="removeLitCapacityField(i)"
                      >
                        Remove
                      </small>
                    </span>
                  </div>
                </transition-group>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>
      </template>
      <template v-if="creationID == 'subsea'">
        <el-form-item label="Fiber Pairs" prop="fiberPairs">
          <el-input-number
            :min="0"
            :class="{ dark }"
            class="w-fit-full"
            controls-position="right"
            v-model="form.fiberPairs"
          />
        </el-form-item>
      </template>
      <el-form-item :label="facilitiesLabel" prop="facilities">
        <v-multi-select
          :mode="mode"
          :options="facsList"
          @input="loadFacsSearch"
          :loading="isLoadingFacs"
          @values-change="form.facilities = $event"
          :value="mode == 'create' ? [] : form.facilities"
        />
      </el-form-item>
      <!-- <template v-if="creationID == 'subsea'"> -->
      <el-form-item
        :label="CLSLabel"
        prop="cls"
        :required="creationID == 'subsea'"
      >
        <v-multi-select
          :mode="mode"
          :is-required="creationID == 'subsea'"
          :is-field-empty="isCLSSelectEmpty"
          :options="clsList"
          @input="loadCLSSearch"
          :loading="isLoadingCLS"
          @values-change="handleCLSSelectionChange"
          @remove="handleCLSSelectionChange(form.cls)"
          :value="mode == 'create' ? [] : form.cls"
        />
      </el-form-item>
      <!-- </template> -->
      <el-form-item label="Owners" prop="owners" required>
        <v-multi-select
          :mode="mode"
          :is-required="true"
          :is-field-empty="isOwnersSelectEmpty"
          :options="orgsList"
          @input="loadOrgsSearch"
          :loading="isLoadingOrgs"
          @values-change="handleOwnersSelectChange"
          :value="mode == 'create' ? [] : form.owners"
        />
      </el-form-item>
      <template v-if="creationID == 'subsea'">
        <el-form-item label="Known Users" prop="knownUsers">
          <v-multi-select
            :mode="mode"
            :options="knownUsers"
            @input="loadKnownUsersSearch"
            :loading="isLoadingKnownUsers"
            @values-change="handleKnownUsersSelectChange"
            :value="mode == 'create' ? [] : form.knownUsers"
          />
        </el-form-item>
      </template>
      <el-form-item label="Tags" class="mt2" prop="tags">
        <el-select
          v-model="form.tags"
          multiple
          class="w-fit-full"
          filterable
          placeholder
          :class="{ dark }"
          allow-create
          collapse-tags
          default-first-option
        >
          <el-option
            v-for="(item, i) in form.tagsList"
            :key="i"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <template v-if="!isManualKmzUpload">
        <el-form-item>
          <dragger
            @handle-file-converted="handleFileConverted"
            @dragger-geojson-upload-failed="handleConvertionFailed"
          />
        </el-form-item>
        <el-form-item class="mt12">
          <el-button
            type="primary"
            class="w-fit-full capitalize"
            round
            :loading="isSendingData"
            :disabled="isSendDataDisabled"
            @click="sendData"
          >
            {{ saveBtn }}
          </el-button>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import Dragger from '../../components/Dragger'
import { getTags } from '../../services/api/tags'
import cableStates from '../../config/cableStates'
import validateUrl from '../../helpers/validateUrl'
import { searchFacilities } from '../../services/api/facs'
import { searchOrganization } from '../../services/api/organizations'
import VMultiSelect from '../../components/MultiSelect'
import { clsListConnectedToCable, searchCls } from '../../services/api/cls'
import { fCollectionFormat } from '../../helpers/featureCollection'
import * as events from '../../events/mapForm'
import { getClsGeoms } from '../../services/api/cls'
import { checkCableNameExistence } from '../../services/api/check_name'
import debounce from '../../helpers/debounce'

export default {
  name: 'CableForm',
  components: {
    Dragger,
    VMultiSelect
  },
  data: () => ({
    tag: '',
    collapseItem: [],
    isOwnersSelectEmpty: false,
    isCLSSelectEmpty: false,
    currentYear: new Date(),
    cableStates,
    facsList: [],
    tagsList: [],
    orgsList: [],
    knownUsers: [],
    clsList: [],
    isURLValid: null,
    isLoadingCLS: false,
    inputVisible: false,
    isLoadingFacs: false,
    isLoadingOrgs: false,
    isLoadingKnownUsers: false,
    isNameRepeated: false,
    warnTagDuplicate: false,
    litCapacityFields: []
  }),
  props: {
    showTitle: {
      type: Boolean,
      default: () => true
    },
    isManualKmzUpload: {
      type: Boolean,
      default: () => false
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
    CLSLabel() {
      return this.creationID == 'subsea' ? 'CLS' : 'Connected CLS'
    },
    formRules() {
      const creationID = this.creationID
      return {
        activationDateTime: [],
        litCapacity: [],
        name: [
          {
            required: true,
            message: 'Please input cable name',
            trigger: 'change'
          },
          {
            type: 'string',
            trigger: ['change', 'blur'],
            message: 'Please input a valid name',
            transform: value => value.trim(),
            // eslint-disable-next-line
            pattern: /^[\A-Za-zÀ-ÖØ-öø-ÿ&.,0-9()´‘'’ /\-]+$/
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'change' }
        ],
        cc: [
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change']
          }
        ],
        urls: [],
        tags: [],
        owners: [
          {
            type: 'array',
            required: true,
            message: 'At least one owner is required',
            trigger: ['blur', 'change']
          }
        ],
        knownUsers: [],
        cls: [
          {
            type: 'array',
            required: creationID == 'subsea',
            message: 'At least one cls is required',
            trigger: ['blur', 'change']
          }
        ],
        category: [],
        fiberPairs: [],
        facilities: [],
        tbpsCapacity: [],
        systemLength: []
      }
    },
    getSelectionID() {
      return t => this.form[t].map(t => (typeof t == 'string' ? t : t._id))
    },
    creationID() {
      return this.$route.query.id
    },
    facilitiesLabel() {
      return this.creationID == 'subsea'
        ? 'Facilities (POPs)'
        : 'Facilities (On-net)'
    },
    title() {
      let t = `${
        this.creationID == 'subsea' ? 'subsea cable' : 'terrestrial network'
      }`
      return this.mode == 'create' ? `Create ${t}` : `Edit ${t}`
    },
    saveBtn() {
      let t = `${
        this.creationID == 'subsea' ? 'subsea cable' : 'terrestrial network'
      }`
      return this.mode == 'create' ? `Create ${t}` : `Save changes`
    },
    dark() {
      return this.$store.state.isDark
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

    if (this.creationID == 'subsea') {
      this.formRules.activationDateTime = [
        {
          type: 'date',
          required: true,
          message: 'Please pick a date',
          trigger: 'change'
        }
      ]
    }

    setTimeout(async () => {
      if (
        this.mode != 'create' &&
        this.creationID == 'subsea' &&
        !this.$route.query.failedToUploadKMz
      ) {
        await this.getClsListConnectedToCable()
      }
    }, 320)
  },
  watch: {
    'form.facsList'(facs) {
      this.facsList = [...facs]
      delete this.form.facsList
    },
    'form.ownersList'(owners) {
      this.orgsList = [...owners]
      delete this.form.ownersList
    },
    'form.knownUsersList'(knownUsers) {
      this.knownUsers = [...knownUsers]
      delete this.form.knownUsersList
    },
    'form.clsList'(cls) {
      this.clsList = [...cls]
      this.handleSetFeatureOntoMap({
        selections: cls.map(cls => cls._id),
        removeLoadState: true
      })
      delete this.form.clsList
    },
    'form.tags'(tag) {
      this.getTagsList(tag)
    }
  },
  methods: {
    checkName: debounce(async function(name) {
      this.isNameRepeated = false
      const {
        t,
        data: { r }
      } = (await checkCableNameExistence({
        user_id: this.$auth.getUserID(),
        name
      })) || { t: 'error', data: { r: false } }
      if (t != 'error' && r >= 1) {
        this.isNameRepeated = true
      } else {
        this.isNameRepeated = false
      }
    }, 320),
    async handleSetFeatureOntoMap({ selections, removeLoadState }) {
      const fc = await this.handleGetClsGeom(selections)

      return fc
        ? this.$emit(`${events.SET_SELECTION_ONTO_MAP}`, {
            t: 'cls',
            fc,
            removeLoadState
          })
        : this.$store.dispatch('editor/toggleMapFormLoading', false)
    },
    async handleGetClsGeom(ids) {
      const res = await getClsGeoms({
        user_id: await this.$auth.getUserID(),
        ids
      })
      return res && res.data && res.data.r ? res.data.r : fCollectionFormat()
    },
    handleConvertionFailed() {
      this.$emit('dragger-geojson-upload-failed')
    },
    removeLitCapacityField(i) {
      this.form.litCapacity.splice(i, 1)
      if (this.form.litCapacity.length <= 0) {
        this.collapseItem = []
      }
    },
    addLitCapacityField() {
      this.form.litCapacity.push({
        year: this.currentYear,
        cap: 0
      })
      this.collapseItem = [1]
    },
    handleCLSSelectionChange(data) {
      this.form.cls = data
      this.setCLSEmptyState()
      this.handleSetFeatureOntoMap({
        selections: this.getSelectionID('cls'),
        removeLoadState: true
      })
    },
    async getClsListConnectedToCable() {
      const res = await clsListConnectedToCable({
        user_id: await this.$auth.getUserID(),
        cable_id: this.$route.query.item
      })
      if (res && res.data && res.data.r) {
        this.clsSelectedList = res.data.r
      }
    },
    async getTagsList(s) {
      const res = await getTags({ user_id: await this.$auth.getUserID(), s })
      if (res && res.data) {
        this.form.tagsList = res.data
      }
    },
    handleFileConverted(fc) {
      this.$emit('handle-file-converted', fc)
    },
    handleOwnersSelectChange(data) {
      this.form.owners = data
      this.setOwnersEmptyState()
    },
    handleKnownUsersSelectChange(data) {
      this.form.knownUsers = data
    },
    setOwnersEmptyState() {
      this.isOwnersSelectEmpty = this.form.owners.length <= 0
    },
    setCLSEmptyState() {
      this.isCLSSelectEmpty = this.form.cls.length <= 0
    },
    sendData() {
      this.setOwnersEmptyState()
      this.setCLSEmptyState()
      return this.$refs['form'].validate(isValid =>
        isValid && !this.isOwnersSelectEmpty ? this.$emit('send-data') : false
      )
    },
    async loadFacsSearch(s) {
      if (s.length <= 0) return
      this.isLoadingFacs = true
      const res = await searchFacilities({
        user_id: await this.$auth.getUserID(),
        s
      })
      if (res && res.data) {
        this.facsList = res.data.reduce(
          (acc = Array.from(this.facsList), item) => {
            return acc.map(i => i._id).includes(item._id) ? acc : [...acc, item]
          },
          []
        )
      }
      this.isLoadingFacs = false
    },
    async loadKnownUsersSearch(s) {
      this.isLoadingKnownUsers = true
      this.knownUsers = (await this.loadOrgsSearch(s, true)) || []
      this.isLoadingKnownUsers = false
    },
    async loadOrgsSearch(s, returnData) {
      if (s.length <= 0) return

      if (!returnData) this.isLoadingOrgs = true
      const res = await searchOrganization({
        user_id: await this.$auth.getUserID(),
        s
      })
      if (res && res.data) {
        const result = res.data.reduce(
          (acc = Array.from(this.orgsList), item) => {
            return acc.map(i => i._id).includes(item._id) ? acc : [...acc, item]
          },
          []
        )
        if (!returnData) this.orgsList = result
        else return result
      }
      this.isLoadingOrgs = false
    },
    async loadCLSSearch(s) {
      if (s.length <= 0) return
      this.isLoadingOrgs = true
      const res = await searchCls({
        user_id: await this.$auth.getUserID(),
        s
      })
      if (res && res.data) {
        this.clsList = res.data.reduce(
          (acc = Array.from(this.clsList), item) => {
            return acc.map(i => i._id).includes(item._id) ? acc : [...acc, item]
          },
          []
        )
      }
      this.isLoadingOrgs = false
    },
    validateURL(url) {
      this.isURLValid = validateUrl(url)
      this.form.urls.includes(url)
        ? (this.warnTagDuplicate = true)
        : (this.warnTagDuplicate = false)
    },
    handleClose(tag) {
      this.form.urls.splice(this.form.urls.indexOf(tag), 1)
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
      const isTagAlreadyCreated = this.form.urls.includes(this.tag)
      if (isTagAlreadyCreated || !this.isURLValid) return

      if (this.tag) this.form.urls.push(this.tag)
      this.inputVisible = false
      this.isURLValid = null
      this.tag = ''
    }
  }
}
</script>
