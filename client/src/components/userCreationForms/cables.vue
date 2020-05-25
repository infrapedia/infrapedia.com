<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title capitalize">{{ title }}</h1>
    </header>
    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Name" prop="name" required>
        <el-input :class="{ dark }" class="w-fit-full" v-model="form.name" />
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
          type="year"
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
              :disable-transitions="false"
              @close="handleClose(tag)"
            >
              {{ tag }}
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
          <div class="inline-block">
            <div
              v-for="(field, i) in form.litCapacity"
              :key="i"
              class="relative mt4"
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
            <el-button
              class="inline-block"
              size="small"
              @click="addLitCapacityField"
            >
              Add lit capacity
            </el-button>
          </div>
        </el-form-item>
      </template>
      <el-form-item label="Fiber Pairs" prop="fiberPairs">
        <el-input-number
          :min="0"
          :class="{ dark }"
          class="w-fit-full"
          controls-position="right"
          v-model="form.fiberPairs"
        />
      </el-form-item>
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
      <el-form-item label="Owners" prop="owners" required>
        <v-multi-select
          :mode="mode"
          :is-required="true"
          :is-field-empty="isOwnersSelectEmpty"
          :options="orgsList"
          @input="loadOrgsSearch"
          :loading="isLoadingOrgs"
          :is-multiple="isCableTypeTerrestrial"
          @values-change="handleOwnersSelectChange"
          :value="mode == 'create' ? [] : form.owners"
        />
      </el-form-item>
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
      <el-form-item label="CLS" prop="cls" v-if="mode !== 'create'">
        <el-button
          class="inline-block w-fit-full"
          type="info"
          :plain="clsSelectedList.length ? false : true"
          @click="() => (isClsSelectionDialogVisible = true)"
        >
          {{ clsSelectedList.length ? 'Edit selected' : 'Select' }} CLS
        </el-button>
      </el-form-item>
      <el-form-item>
        <dragger @handle-file-converted="handleFileConverted" />
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

    <select-cls-dialog
      :is-visible="isClsSelectionDialogVisible"
      :selected-data="clsSelectedList"
      @close="() => (isClsSelectionDialogVisible = false)"
      @selection-change="handleCLSSelectionChange"
    />
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
import SelectClsDialog from '../../components/dialogs/SelectCls'
import { clsListConnectedToCable } from '../../services/api/cls'

export default {
  name: 'CableForm',
  components: {
    Dragger,
    VMultiSelect,
    SelectClsDialog
  },
  data: () => ({
    clsSelectedList: [],
    tag: '',
    isOwnersSelectEmpty: false,
    currentYear: new Date(),
    cableStates,
    facsList: [],
    tagsList: [],
    orgsList: [],
    isURLValid: null,
    inputVisible: false,
    isLoadingFacs: false,
    isLoadingOrgs: false,
    warnTagDuplicate: false,
    isClsSelectionDialogVisible: false,
    litCapacityFields: []
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
    formRules() {
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
            trigger: 'change',
            message: 'Please input a valid name',
            transform: value => value.trim(),
            // eslint-disable-next-line
            pattern: /^[\A-Za-zÀ-ÖØ-öø-ÿ&.´ \-]+$/
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
        cls: [],
        owners: [
          {
            message: 'At least one owner is required'
          }
        ],
        category: [],
        fiberPairs: [],
        facilities: [],
        tbpsCapacity: [],
        systemLength: []
      }
    },
    creationID() {
      return this.$route.query.id
    },
    facilitiesLabel() {
      return this.creationID === 'subsea'
        ? 'Facilities (POPs)'
        : 'Facilities (On-net & Off-Net)'
    },
    isCableTypeTerrestrial() {
      return this.creationID == 'subsea'
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
    },
    checkGeomLength() {
      return this.$store.state.editor.scene.features.list.length ? false : true
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
      if (this.mode != 'create' && this.creationID == 'subsea') {
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
    'form.tags'(tag) {
      this.getTagsList(tag)
    }
  },
  methods: {
    removeLitCapacityField(i) {
      return this.form.litCapacity.splice(i, 1)
    },
    addLitCapacityField() {
      return this.form.litCapacity.push({
        year: this.currentYear,
        cap: 0
      })
    },
    handleCLSSelectionChange(data) {
      this.clsSelectedList = data
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
      return this.$emit('handle-file-converted', fc)
    },
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
        isValid && !this.isOwnersSelectEmpty ? this.$emit('send-data') : false
      )
    },
    async loadFacsSearch(s) {
      if (s === '') return
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
    async loadOrgsSearch(s) {
      if (s === '') return
      this.isLoadingOrgs = true
      const res = await searchOrganization({
        user_id: await this.$auth.getUserID(),
        s
      })
      if (res && res.data) {
        this.orgsList = res.data.reduce(
          (acc = Array.from(this.orgsList), item) => {
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
<style lang="scss" scoped>
@import '../../assets/scss/components/cables-form-styles.scss';
</style>
