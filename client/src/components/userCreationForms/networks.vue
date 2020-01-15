<template>
  <el-dialog
    :visible="visible"
    width="80%"
    :custom-class="dark ? dark : ''"
    :before-close="handleBeforeClose"
    :close-on-click-modal="false"
  >
    <header slot="title" class="w-fit-full">
      <h1
        class="title-user-variant w-fit-full fs-xlarge text-center"
        :class="{ dark }"
      >
        {{ title }} network
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
          :class="{ dark }"
          collapse-tags
          filterable
          class="w-fit-full"
          v-model="form.organizations"
          placeholder
        >
          <el-option
            v-for="(opt, i) in orgs"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Facilities">
        <el-select
          multiple
          clearable
          :class="{ dark }"
          collapse-tags
          filterable
          class="w-fit-full"
          v-model="form.facilities"
          placeholder
        >
          <el-option
            v-for="(opt, i) in facs"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Cables">
        <el-select
          multiple
          clearable
          collapse-tags
          :class="{ dark }"
          filterable
          class="w-fit-full"
          v-model="form.cables"
          placeholder
        >
          <el-option
            v-for="(opt, i) in cables"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Ixps">
        <el-select
          multiple
          clearable
          :class="{ dark }"
          collapse-tags
          filterable
          class="w-fit-full"
          v-model="form.ixps"
          placeholder
        >
          <el-option
            v-for="(opt, i) in ixps"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="CLS">
        <el-select
          multiple
          clearable
          :class="{ dark }"
          collapse-tags
          filterable
          class="w-fit-full"
          v-model="form.cls"
          placeholder
        >
          <el-option
            v-for="(opt, i) in cls"
            :key="i"
            :label="opt.name"
            :value="opt._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="mt12">
        <el-button
          :class="{ dark }"
          type="primary"
          class="mr8 mb2"
          round
          plain
          @click="sendData"
        >
          {{ title }} network
        </el-button>
        <el-button
          class="w36"
          :class="{ dark }"
          round
          @click="handleBeforeClose"
        >
          Cancel
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { getOrganizations } from '../../services/api/organizations'
import { getCables } from '../../services/api/cables'
import validateUrl from '../../helpers/validateUrl'
import { getClss } from '../../services/api/cls'

export default {
  name: 'NetworkForm',
  data: () => ({
    tag: '',
    cls: [],
    orgs: [],
    ixps: [],
    facs: [],
    cables: [],
    loading: false,
    isURLValid: null,
    inputVisible: false
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
      return bool ? this.loadAll() : this.clearAll()
    }
  },
  methods: {
    clearAll() {
      this.cls = []
      this.orgs = []
      this.ixps = []
      this.facs = []
      this.cables = []
    },
    async loadAll() {
      this.loading = true
      await Promise.all([this.loadOrgs(), this.loadCables(), this.loadCls()])
      this.loading = false
    },
    sendData() {
      return this.$emit('send-data')
    },
    async loadOrgs() {
      const res = await getOrganizations({ user_id: this.$auth.user.sub })
      if (res && res.data && res.data.r) {
        this.orgs = res.data.r
      }
    },
    async loadCls() {
      const res = await getClss({ user_id: this.$auth.user.sub })
      if (res && res.data && res.data.r) {
        this.cls = res.data.r
      }
    },
    async loadCables() {
      const res = await getCables({ user_id: this.$auth.user.sub })
      if (res && res.data && res.data.r) {
        this.cables = res.data.r
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
      let tag = this.tag
      const isTagAlreadyCreated = this.form.websites.includes(tag)
      if (isTagAlreadyCreated || !this.isURLValid) return

      if (tag) this.form.websites.push(tag)
      this.inputVisible = false
      this.isURLValid = null
      this.tag = ''
    }
  }
}
</script>
