<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title capitalize">{{ title }} Facility</h1>
    </header>
    <el-form ref="form" :model="form">
      <el-form-item label="Name">
        <el-input class="w-fit-full" :class="{ dark }" v-model="form.name" />
      </el-form-item>
      <el-form-item label="Point">
        <el-input class="w-fit-full" :class="{ dark }" v-model="form.point" />
      </el-form-item>
      <el-form-item label="Address" class="mt2">
        <el-select
          v-model="form.address"
          multiple
          filterable
          placeholder
          allow-create
          :class="{ dark }"
          class="w-fit-full"
          default-first-option
        >
          <el-option
            v-for="item in form.addressList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Website">
        <el-input
          class="w-fit-full"
          :class="{ dark }"
          v-model="form.website"
          @change="validateURL"
        />
        <el-alert
          v-if="isURLValid !== null && !isURLValid"
          title="This url is not valid"
          type="danger"
        />
      </el-form-item>
      <el-form-item label="Geometry">
        <el-input
          class="w-fit-full"
          :class="{ dark }"
          v-model="form.geomtery"
        />
      </el-form-item>
      <el-form-item label="IXPs">
        <el-select
          v-model="form.ixps"
          class="w-fit-full"
          :class="{ dark }"
          multiple
          filterable
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
          placeholder
          allow-create
          :class="{ dark }"
          class="w-fit-full"
          default-first-option
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
          class="inline-block w-fit-ful"
          v-model="form.startDate"
          type="year"
          :class="{ dark }"
          placeholder
        />
      </el-form-item>
      <el-form-item label="Type of building">
        <el-select
          v-model="form.building"
          class="w-fit-full"
          :class="{ dark }"
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
      <el-form-item class="mt12">
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

export default {
  name: 'FacsForm',
  data: () => ({
    tag: '',
    facilitiesTypes,
    facilitiesBuildingTypes,
    isURLValid: null,
    inputAdressVisible: false,
    inputTagsVisible: false,
    tagsList: [],
    addressList: [],
    ixpsList: []
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
      return this.mode === 'create' ? 'Create' : 'Edit'
    },
    dark() {
      return this.$store.state.isDark
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
    handleClose(tag) {
      this.form.websites.splice(this.form.websites.indexOf(tag), 1)
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
