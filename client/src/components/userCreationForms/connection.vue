<template>
  <el-dialog
    :visible="visible"
    width="80%"
    :custom-class="dark ? 'dark' : ''"
    :before-close="handleBeforeClose"
    :close-on-click-modal="false"
  >
    <header slot="title" class="w-fit-full">
      <h1
        class="title-user-variant w-fit-full fs-xlarge text-center capitalize"
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
        <div class="w-fit-full relative inline-block">
          <div class="flex row wrap">
            <el-tag
              :key="tag"
              v-for="tag in form.websites"
              closable
              :class="{ dark }"
              class="mr1 mb4"
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
              class="w42 h8 text-center"
              size="small"
              @click="showInput"
            >
              Add
            </el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="Organizations">
        <v-multi-select
          v-if="visible"
          :mode="mode"
          :options="selectsData.organizations"
          @input="loadOrgSearch"
          :loading="isLoadingOrg"
          @values-change="createTableFromSelection($event, 'organizations')"
          :value="mode === 'create' ? [] : [...form.organizations]"
          @remove="handleRemoveTableDataItem($event, 'organizations')"
        />
      </el-form-item>
      <el-form-item label="Facilities">
        <v-multi-select
          v-if="visible"
          :mode="mode"
          :options="selectsData.facilities"
          @input="loadFacSearch"
          :loading="isLoadingFacs"
          @values-change="createTableFromSelection($event, 'facilities')"
          :value="mode === 'create' ? [] : [...form.facilities]"
          @remove="handleRemoveTableDataItem"
        />
      </el-form-item>
      <el-form-item label="Cables">
        <v-multi-select
          v-if="visible"
          :mode="mode"
          :options="selectsData.cables"
          @input="loadCablesSearch"
          :loading="isLoadingCables"
          @values-change="createTableFromSelection($event, 'cables')"
          :value="mode === 'create' ? [] : [...form.cables]"
          @remove="handleRemoveTableDataItem"
        />
      </el-form-item>
      <el-form-item label="CLS">
        <v-multi-select
          v-if="visible"
          :mode="mode"
          :options="selectsData.cls"
          @input="loadClsSearch"
          :loading="isLoadingCls"
          @values-change="createTableFromSelection($event, 'cls')"
          :value="mode === 'create' ? [] : [...form.cls]"
          @remove="handleRemoveTableDataItem"
        />
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
      <el-table :data="tableData" v-if="tableDataHasLength">
        <el-table-column prop="name" label="Name" width="200" />
        <el-table-column
          label="Reference"
          v-if="form.references.length"
          width="800"
        >
          <template slot-scope="scope">
            <div class="flex row nowrap w-fit-full">
              <div
                v-for="(item, i) in form.references[0].orgs"
                :key="i"
                class="ml2"
              >
                <el-form-item :label="item.name">
                  <el-select
                    v-model="scope.row.reference[i]"
                    class="w-fit-full"
                    placeholder
                    :class="{ dark }"
                    :id="scope.row._id + '-' + item._id"
                    @change="
                      handleReferenceSelectionChange($event, scope.row, item)
                    "
                  >
                    <el-option
                      v-for="(type, i) in referencesTypes"
                      :key="i"
                      :value="type"
                      :label="type"
                    />
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div slot="footer" class="dialog-footer-mobile">
      <el-button
        class="h10 capitalize"
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
import VMultiSelect from '../../components/MultiSelect'

export default {
  name: 'ConnectionForm',
  data: () => ({
    tag: '',
    selectsData: {
      cls: [],
      organizations: [],
      facilities: [],
      cables: []
    },
    referencesTypes: ['Owner', 'Partner', 'User', 'None'],
    loading: false,
    isURLValid: null,
    inputVisible: false,
    isLoadingOrg: false,
    isLoadingCls: false,
    isLoadingFacs: false,
    isLoadingCables: false,
    warnTagDuplicate: false
  }),
  components: {
    VMultiSelect
  },
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
    },
    tableData() {
      return this.form.references && this.form.references.length
        ? this.form.references[0].options
        : []
    },
    tableDataHasLength() {
      return (
        this.tableData.length &&
        this.form.references.length &&
        this.form.references[0].orgs.length
      )
    }
  },
  watch: {
    visible(bool) {
      if (!bool) return this.clearAll()
      else if (this.mode !== 'create') {
        this.handleEditModeScenario()
      }
    },
    async 'form.tags'(tag) {
      if (!this.visible) return
      await this.getTagsList(tag)
    },
    'form.facilitiesList'(facs) {
      if (!facs) return
      this.selectsData.facilities = [...facs]
      delete this.form.facilitiesList
    },
    'form.organizationsList'(orgs) {
      if (!orgs) return
      this.selectsData.organizations = [...orgs]
      delete this.form.organizationsList
    },
    'form.cablesList'(cables) {
      if (!cables) return
      this.selectsData.cables = [...cables]
      delete this.form.cablesList
    },
    'form.clsList'(cls) {
      if (!cls) return
      this.selectsData.cls = [...cls]
      delete this.form.clsList
    }
  },
  methods: {
    handleEditModeScenario() {
      const references = JSON.parse(JSON.stringify(this.form.references))
      const keys = Object.keys(references)
      let facID = null
      const props = ['cables', 'facilities', 'cls', 'organizations']
      for (let prop of props) {
        this.createTableFromSelection(Array.from(this.form[prop]), prop)
      }

      for (let orgID of keys) {
        for (let opt of this.form.references[0].options) {
          facID = Object.keys(references[orgID])
          if (facID[0] === opt._id) {
            opt.reference.push(references[orgID][facID[0]])
            this.handleReferenceSelectionChange(
              references[orgID][facID[0]],
              opt,
              { _id: orgID }
            )
          }
        }
      }
    },
    handleReferenceSelectionChange(selection, row, org) {
      let obj = {}

      if (row.relation !== null) {
        obj = { ...row.relation }
      }
      obj[org._id] = {}
      obj[org._id][row._id] = selection
      row.relation = obj
    },
    createTableFromSelection(ids, type) {
      if (!ids.length) return

      const data = {
        orgs: this.form.references.length ? this.form.references[0].orgs : [],
        options: this.form.references.length
          ? this.form.references[0].options
          : []
      }
      const orgsID = data.orgs.map(o => o._id)
      const optionsID = data.options.map(o => o._id)
      this.form[type] = ids

      for (let selection of ids) {
        if (this.selectsData[type].length) {
          for (let item of this.selectsData[type]) {
            if (item._id === selection._id) {
              if (type === 'organizations') {
                if (data.orgs.length) {
                  if (!orgsID.includes(item._id)) {
                    data.orgs.push({
                      type,
                      ...item
                    })
                  }
                } else {
                  data.orgs.push({
                    type,
                    ...item
                  })
                }
              } else {
                if (data.options.length) {
                  if (!optionsID.includes(item._id)) {
                    console.log(item, 'here 1.1.0')
                    data.options.push({
                      type,
                      ...item,
                      reference: [],
                      relation: null
                    })
                  }
                } else {
                  console.log(item, 'here 1.2')
                  data.options.push({
                    ...item,
                    type,
                    reference: [],
                    relation: null
                  })
                }
              }
            }
          }
        } else {
          // console.log('here 1.3')
          type === 'organizations'
            ? data.orgs.push(selection)
            : data.options.push({ ...selection, reference: [], relation: null })
        }
      }

      this.form.references = [data]
    },
    handleRemoveTableDataItem(id, type) {
      if (type && type === 'organizations') {
        this.form.references[0].orgs = this.form.references[0].orgs.filter(
          item => item._id !== id
        )
      } else {
        this.form.references[0].options = this.form.references[0].options.filter(
          item => item._id !== id
        )
      }
    },
    clearAll() {
      this.selectsData = {
        cls: [],
        organizations: [],
        facilities: [],
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
        this.selectsData.organizations = res.data
      }
      this.isLoadingOrg = false
    },
    async loadCablesSearch(s) {
      if (s === '') return
      this.isLoadingCables = true
      const res = await searchCables({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.selectsData.cables = res.data
      }
      this.isLoadingCables = false
    },
    async loadClsSearch(s) {
      if (s === '') return
      this.isLoadingCls = true
      const res = await searchCls({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.selectsData.cls = res.data
      }
      this.isLoadingCls = false
    },
    async loadFacSearch(s) {
      if (s === '') return
      this.isLoadingFacs = true
      const res = await searchFacilities({ user_id: this.$auth.user.sub, s })
      if (res && res.data) {
        this.selectsData.facilities = res.data
      }
      this.isLoadingFacs = false
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
      this.form.websites.includes(url)
        ? (this.warnTagDuplicate = true)
        : (this.warnTagDuplicate = false)
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
      if (isTagAlreadyCreated || !this.isURLValid) {
        if (this.tag === '') this.inputVisible = false
        return
      }

      if (this.tag) this.form.websites.push(this.tag)
      this.inputVisible = false
      this.isURLValid = null
      this.tag = ''
    }
  }
}
</script>
