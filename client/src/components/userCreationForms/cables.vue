<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title">{{ title }}</h1>
    </header>
    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Category" prop="category">
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
      <el-form-item label="Name" prop="name" required>
        <el-input :class="{ dark }" class="w-fit-full" v-model="form.name" />
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
        v-if="creationID === 'subsea'"
        label="RFS (Ready for Service)"
        prop="activationDateTime"
        required
      >
        <el-date-picker
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
      <el-form-item
        label="Capacity (Tbps)"
        prop="tbpsCapacity"
        v-if="creationID === 'subsea'"
      >
        <el-input-number
          :min="0"
          :class="{ dark }"
          class="w-fit-full"
          controls-position="right"
          v-model="form.capacityTBPS"
        />
      </el-form-item>
      <el-form-item label="Fiber Pairs" prop="fiberPairs">
        <el-input-number
          :min="0"
          :class="{ dark }"
          class="w-fit-full"
          controls-position="right"
          v-model="form.fiberPairs"
        />
      </el-form-item>
      <el-form-item label="Facilities" prop="facilities">
        <el-select
          multiple
          :class="{ dark }"
          filterable
          collapse-tags
          remote
          :remote-method="loadFacsSearch"
          :loading="isLoadingFacs"
          class="w-fit-full"
          v-model="form.facilities"
          placeholder
        >
          <el-option
            v-for="(opt, i) in facsList"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Groups" prop="owners">
        <v-multi-select
          :mode="mode"
          :options="orgsList"
          @input="loadOrgsSearch"
          :loading="isLoadingOrgs"
          @values-change="form.owners = $event"
          :value="mode === 'create' ? [] : form.owners"
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
      <el-form-item>
        <dragger @handle-file-converted="handleFileConverted" />
      </el-form-item>
      <el-form-item class="mt12">
        <el-button
          type="primary"
          class="w-fit-full"
          round
          :loading="isSendingData"
          :disabled="checkGeomLength"
          @click="sendData"
        >
          {{ title }} cable
        </el-button>
      </el-form-item>
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

export default {
  name: 'CableForm',
  components: {
    Dragger,
    VMultiSelect
  },
  data: () => ({
    tag: '',
    cableStates,
    facsList: [],
    tagsList: [],
    orgsList: [],
    isURLValid: null,
    inputVisible: false,
    isLoadingFacs: false,
    isLoadingOrgs: false,
    warnTagDuplicate: false,
    formRules: {
      activationDateTime: [],
      name: [
        {
          required: true,
          message: 'Please input cable name',
          trigger: 'change'
        },
        { min: 3, message: 'Length should be at least 3', trigger: 'change' }
      ],
      urls: [],
      tags: [],
      owners: [],
      category: [],
      fiberPairs: [],
      facilities: [],
      tbpsCapacity: [],
      systemLength: []
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
    creationID() {
      return this.$route.query.id
    },
    isCableTypeTerrestrial() {
      return this.creationID === 'subsea'
    },
    title() {
      let t = `${
        this.creationID === 'subsea' ? 'subsea cable' : 'terrestrial network'
      }`
      return this.mode === 'create' ? `Create ${t}` : `Edit ${t}`
    },
    dark() {
      return this.$store.state.isDark
    },
    checkGeomLength() {
      return this.$store.state.editor.scene.features.list.length ? false : true
    }
  },
  mounted() {
    if (this.mode === 'create') {
      setTimeout(() => this.$refs.form.clearValidate(), 50)
    }

    if (this.creationID === 'subsea') {
      this.formRules.activationDateTime = [
        {
          type: 'date',
          required: true,
          message: 'Please pick a date',
          trigger: 'change'
        }
      ]
    }
  },
  watch: {
    'form.facsList'(facs) {
      this.facsList = [...facs]
      delete this.form.facsList
    },
    'form.tags'(tag) {
      this.getTagsList(tag)
    }
  },
  methods: {
    async getTagsList(s) {
      const res = await getTags({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.form.tagsList = res.data
      }
    },
    handleFileConverted(fc) {
      return this.$emit('handle-file-converted', fc)
    },
    sendData() {
      return this.$refs['form'].validate(isValid =>
        isValid ? this.$emit('send-data') : false
      )
    },
    async loadFacsSearch(s) {
      if (s === '') return
      this.isLoadingFacs = true
      const res = await searchFacilities({ user_id: this.$auth.user.sub, s })
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
      const res = await searchOrganization({ user_id: this.$auth.user.sub, s })
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
      let tag = this.tag
      if (tag && !this.warnTagDuplicate && this.isURLValid) {
        this.form.urls.push(tag)
      }
      this.inputVisible = false
      this.tag = ''
    }
  }
}
</script>
