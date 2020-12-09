<template>
  <div>
    <div class="pb6 pt6 pr8 pl8">
      <header slot="header" class="w-fit-full mb8">
        <h1 class="title capitalize">{{ title }}</h1>
      </header>
      <el-form ref="form" :model="form" :rules="formRules" id="cloudForm">
        <el-row :gutter="10">
          <el-col :span="21">
            <el-form-item label="Name" prop="name">
              <el-input
                v-model="form.name"
                class="w-fit-full"
                :class="{ dark }"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="Color" prop="color">
              <br />
              <div class="flex align-items-start">
                <el-color-picker
                  :class="{ dark }"
                  v-model="form.color"
                  :predefine="predefinedColors"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Established in (year)" prop="establishmentYear">
          <el-date-picker
            type="month"
            :class="{ dark }"
            class="w-fit-full-imp"
            v-model="form.establishmentYear"
          />
        </el-form-item>

        <el-form-item label="URL (company or cloud services page)" prop="url">
          <el-input
            v-model="form.url"
            class="w-fit-full"
            :class="{ dark }"
            clearable
          />
        </el-form-item>

        <el-form-item label="Status Page (URL)" prop="statusUrl">
          <el-input
            v-model="form.statusUrl"
            class="w-fit-full"
            :class="{ dark }"
            clearable
          />
        </el-form-item>

        <el-form-item label="Known Users" prop="knownUsers">
          <v-multi-select
            ref="knownUsersField"
            :mode="mode"
            :options="knownUsers"
            @input="loadKnownUsersSearch"
            :loading="isLoadingKnownUsers"
            @values-change="handleKnownUsersSelectChange"
            :value="mode == 'create' ? [] : form.knownUsers"
          />
        </el-form-item>

        <el-form-item label="Cloud Region(s)" prop="regions" class="mt2">
          <br />
          <div class="flex align-items-start">
            <el-button size="small" round @click="handleAddRegion">
              Add
            </el-button>
          </div>
        </el-form-item>

        <el-form-item label="On-Ramp(s)" prop="ramps" class="mb2">
          <br />
          <div class="flex align-items-start">
            <el-button size="small" round @click="handleAddRamp">
              Add
            </el-button>
          </div>
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
      </el-form>
    </div>
    <regions-dialog
      :mode="regionsDialog.mode"
      :value="regionsDialog.selected"
      :is-visible="regionsDialog.visible"
      @close="handleRegionsDialogClose"
    />
    <ramps-dialog
      :mode="rampsDialog.mode"
      :value="rampsDialog.selected"
      :is-visible="rampsDialog.visible"
      @close="handleRampsDialogClose"
    />
  </div>
</template>

<script>
import VMultiSelect from '../../components/MultiSelect'
import RampsDialog from '../../components/dialogs/RampsDialog'
import RegionsDialog from '../../components/dialogs/RegionsDialog'
import { searchOrganization } from '../../services/api/organizations'

export default {
  components: {
    RampsDialog,
    VMultiSelect,
    RegionsDialog
  },
  data: () => ({
    regionsDialog: {
      mode: 'create',
      selected: null,
      visible: false
    },
    rampsDialog: {
      mode: 'create',
      selected: null,
      visible: false
    },
    knownUsers: [],
    isLoadingKnownUsers: false
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
    },
    isSendDataDisabled: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    title() {
      const t = 'CSP'
      return this.mode == 'create' ? `Create ${t}` : `Edit ${t}`
    },
    saveBtn() {
      return this.mode == 'create' ? 'Add CSP' : 'Save changes'
    },
    formRules() {
      return {
        name: [
          {
            required: true,
            trigger: ['change', 'blur'],
            message: 'Please input CSP name'
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
        url: [
          {
            required: true,
            trigger: ['change', 'blur'],
            message: 'This URL is required'
          }
        ],
        statusUrl: [
          {
            required: true,
            trigger: ['change', 'blur'],
            message: 'This URL is required'
          }
        ],
        knownUsers: [],
        regions: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: 'At least one cloud region is required'
          }
        ],
        ramps: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: 'At least one on-ramp is required'
          }
        ]
      }
    },
    predefinedColors() {
      return [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ]
    }
  },
  watch: {
    'form.knownUsersList'(knownUsers) {
      this.knownUsers = [...knownUsers]
      delete this.form.knownUsersList
    }
  },
  methods: {
    handleRegionsDialogClose(data) {
      this.regionsDialog.visible = false
      if (data) {
        // console.log(data)
        // this.form.regions.push(data)
      }
    },
    handleAddRegion() {
      this.regionsDialog.visible = true
    },
    handleRampsDialogClose(data) {
      this.rampsDialog.visible = false
      if (data) {
        // console.log(data)
        // this.form.regions.push(data)
      }
    },
    handleAddRamp() {
      this.rampsDialog.visible = true
    },
    handleKnownUsersSelectChange(data) {
      this.form.knownUsers = data
    },
    async loadKnownUsersSearch(s) {
      this.isLoadingKnownUsers = true
      const res = await searchOrganization({
        user_id: await this.$auth.getUserID(),
        s
      })
      if (res && res.data) {
        this.knownUsers = res.data.reduce(
          (acc = Array.from(this.orgsList), item) => {
            return acc.map(i => i._id).includes(item._id) ? acc : [...acc, item]
          },
          []
        )
      }
      this.isLoadingKnownUsers = false
    },
    sendData() {
      return this.$refs.form.validate(isValid =>
        isValid ? this.$emit('send-data') : false
      )
    }
  }
}
</script>
