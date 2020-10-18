<template>
  <el-dialog
    :visible.sync="isVisible"
    width="32%"
    top="12vh"
    append-to-body
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <h2 class="title-user-variant" slot="title">
      {{ title }}
    </h2>
    <el-row :gutter="20">
      <el-form :model="form" :rules="formRules">
        <el-col :span="24">
          <el-form-item label="Name" prop="name">
            <el-input v-model="form.name" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Status" prop="status">
            <el-select
              v-model="form.status"
              class="w-fit-full"
              :class="{ dark }"
              placeholder
            >
              <el-option
                v-for="(item, i) in statusList"
                :key="i"
                :value="item"
                :label="item"
                class="capitalize"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="City/State/Region" prop="region">
            <el-input v-model="form.region" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Facility (POP)" prop="facility">
            <v-multi-select
              :mode="mode"
              :options="facsList"
              @input="loadFacsSearch"
              :loading="isLoadingFacs"
              @values-change="form.facility = $event"
              :value="mode == 'create' ? [] : form.facility"
            />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">
        Save
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import MultiSelect from '../MultiSelect'
import { searchFacilities } from '../../services/api/facs'

export default {
  name: 'RegionsDialog',
  components: {
    VMultiSelect: MultiSelect
  },
  data: () => ({
    form: {
      name: '',
      status: '',
      facility: {}
    },
    facsList: [],
    isLoadingFacs: false
  }),
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    value: {
      type: Object,
      default: () => {}
    },
    mode: {
      type: String,
      required: true
    }
  },
  // watch: {
  //   isVisible(bool) {
  //     if (!bool) return
  //   }
  // },
  computed: {
    title() {
      return this.mode == 'create' ? 'Add On-Ramp' : 'Edit On-Ramp'
    },
    statusList() {
      return ['active', 'disabled', 'unkown']
    },
    dark() {
      return this.$store.state.isDark
    },
    formRules() {
      return {
        name: [
          {
            required: true,
            trigger: ['change', 'blur'],
            message: 'Please input this on-ramp name'
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
        status: [],
        facility: []
      }
    }
  },
  methods: {
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
    handleClose() {
      return this.$emit('close', this.form)
    }
  }
}
</script>
