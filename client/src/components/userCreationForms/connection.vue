<template>
  <el-dialog
    :visible="visible"
    :custom-class="dark ? 'custom-dialog dark' : 'custom-dialog'"
    :before-close="handleBeforeClose"
    :close-on-click-modal="false"
  >
    <header slot="title" class="w-fit-full">
      <h1
        class="title-user-variant w-fit-full fs-xlarge text-center"
        :class="{ dark }"
      >
        {{ title }} group
      </h1>
    </header>
    <el-form
      ref="form"
      :model="form"
      class="p2"
      v-loading="loading"
      :class="{ dark }"
    >
      <el-form-item label="Name">
        <el-input :class="{ dark }" class="w-fit-full" v-model="form.name" />
      </el-form-item>
      <el-form-item label="Websites">
        <el-tag
          :key="tag"
          v-for="tag in form.websites"
          closable
          :class="{ dark }"
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
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
        </template>
        <el-button
          v-else
          :class="{ dark }"
          class="w42 text-center"
          size="small"
          @click="showInput"
        >
          Add
        </el-button>
      </el-form-item>
      <el-form-item label="Organizations">
        <el-select
          multiple
          clearable
          remote
          :remote-method="loadOrgSearch"
          :loading="isLoadingOrg"
          :class="{ dark }"
          collapse-tags
          filterable
          class="w-fit-full"
          v-model="form.organizations"
          placeholder
          @change="createTableFromSelection($event, 'orgs')"
        >
          <el-option
            v-for="(opt, i) in selectsData.orgs"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          >
            <div class="truncate" :title="opt.name">
              <fa :icon="['fas', 'award']" v-if="opt.yours === 1" class="mr1" />
              {{ opt.name }}
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Facilities">
        <el-select
          multiple
          clearable
          :class="{ dark }"
          collapse-tags
          filterable
          remote
          :remote-method="loadFacSearch"
          :loading="isLoadingFacs"
          class="w-fit-full"
          v-model="form.facilities"
          placeholder
          @change="createTableFromSelection($event, 'facs')"
        >
          <el-option
            v-for="(opt, i) in selectsData.facs"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          >
            <div class="truncate" :title="opt.name">
              <fa :icon="['fas', 'award']" v-if="opt.yours === 1" class="mr1" />
              {{ opt.name }}
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Cables">
        <el-select
          multiple
          clearable
          collapse-tags
          :class="{ dark }"
          filterable
          remote
          :remote-method="loadCablesSearch"
          :loading="isLoadingCables"
          class="w-fit-full"
          v-model="form.cables"
          placeholder
          @change="createTableFromSelection($event, 'cables')"
        >
          <el-option
            v-for="(opt, i) in selectsData.cables"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          >
            <div class="truncate" :title="opt.name">
              <fa :icon="['fas', 'award']" v-if="opt.yours === 1" class="mr1" />
              {{ opt.name }}
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="CLS">
        <el-select
          multiple
          clearable
          :class="{ dark }"
          collapse-tags
          remote
          :remote-method="loadClsSearch"
          :loading="isLoadingCls"
          filterable
          class="w-fit-full"
          v-model="form.cls"
          placeholder
          @change="createTableFromSelection($event, 'cls')"
        >
          <el-option
            v-for="(opt, i) in selectsData.cls"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          >
            <div class="truncate" :title="opt.name">
              <fa :icon="['fas', 'award']" v-if="opt.yours === 1" class="mr1" />
              {{ opt.name }}
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Tags" class="mt2">
        <el-select
          v-model="form.tags"
          multiple
          filterable
          placeholder
          allow-create
          :class="{ dark }"
          class="w-fit-full"
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
      <el-table :data="form.references" v-if="form.references.length">
        <el-table-column slot-scope="scope">
          {{ scope.row }}
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer-mobile">
      <el-button
        class="h10"
        :class="{ dark }"
        type="primary"
        round
        plain
        @click="sendData"
      >
        {{ title }} group
      </el-button>
      <el-button class="h10" :class="{ dark }" round @click="handleBeforeClose">
        Cancel
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { searchOrganization } from '../../services/api/organizations'
import { searchFacilities } from '../../services/api/facs'
import { searchCables } from '../../services/api/cables'
import validateUrl from '../../helpers/validateUrl'
import { searchCls } from '../../services/api/cls'
import { getTags } from '../../services/api/tags'

export default {
  name: 'ConnectionForm',
  data: () => ({
    tag: '',
    selectsData: {
      cls: [],
      orgs: [],
      facs: [],
      cables: []
    },
    tableData: [],
    loading: false,
    isURLValid: null,
    inputVisible: false,
    isLoadingOrg: false,
    isLoadingCls: false,
    isLoadingFacs: false,
    isLoadingCables: false
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
      return this.mode === 'create' ? 'Create' : 'Edit'
    },
    dark() {
      return this.$store.state.isDark
    }
  },
  watch: {
    visible(bool) {
      return bool ? null : this.clearAll()
    },
    async 'form.tags'(tag) {
      if (!this.visible) return
      await this.getTagsList(tag)
    },
    'form.facilitiesList'(facs) {
      if (!facs) return
      this.facs = [...facs]
      delete this.form.facilitiesList
    },
    'form.organizationsList'(orgs) {
      if (!orgs) return
      this.orgs = [...orgs]
      delete this.form.organizationsList
    },
    'form.cablesList'(cables) {
      if (!cables) return
      this.cables = [...cables]
      delete this.form.cablesList
    },
    'form.clsList'(cls) {
      if (!cls) return
      this.cls = [...cls]
      delete this.form.clsList
    }
  },
  methods: {
    createTableFromSelection(ids, type) {
      return console.log(ids, type)
    },
    clearAll() {
      this.selectsData = {
        cls: [],
        orgs: [],
        facs: [],
        cables: []
      }
    },
    sendData() {
      return this.$emit('send-data')
    },
    async loadOrgSearch(s) {
      if (s === '') return
      this.isLoadingOrg = true
      const res = await searchOrganization({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.selectsData.orgs = this.selectsData.orgs.concat(res.data)
      }
      this.isLoadingOrg = false
    },
    async loadCablesSearch(s) {
      if (s === '') return
      this.isLoadingCables = true
      const res = await searchCables({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.selectsData.cables = this.selectsData.cables.concat(res.data)
      }
      this.isLoadingCables = false
    },
    async loadClsSearch(s) {
      if (s === '') return
      this.isLoadingCls = true
      const res = await searchCls({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.selectsData.cls = this.selectsData.cls.concat(res.data)
      }
      this.isLoadingCls = false
    },
    async loadFacSearch(s) {
      if (s === '') return
      this.isLoadingCls = true
      const res = await searchFacilities({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.selectsData.facs = this.selectsData.facs.concat(res.data)
      }
      this.isLoadingCls = false
    },
    async getTagsList(s) {
      const res = await getTags({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.form.tagsList = res.data
      }
    },
    handleBeforeClose() {
      return this.$emit('close')
    },
    validateURL(url) {
      this.isURLValid = validateUrl(url)
    },
    handleClose(tag) {
      return this.form.websites.splice(this.form.websites.indexOf(tag), 1)
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
      const isTagAlreadyCreated = this.form.websites.includes(this.tag)
      if (isTagAlreadyCreated || !this.isURLValid) return

      if (this.tag) this.form.websites.push(this.tag)
      this.inputVisible = false
      this.isURLValid = null
      this.tag = ''
    }
  }
}
</script>
