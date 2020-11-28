<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title capitalize">{{ title }} IXP</h1>
    </header>
    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Name" prop="name">
        <el-input
          class="w-fit-full"
          v-model="form.name"
          :class="{ dark }"
          :disabled="isViewMode"
          clearable
          @input="checkName"
        />
        <el-alert
          v-if="isNameRepeated"
          class="mt4 p2"
          :class="{ dark }"
          type="error"
          :closable="false"
          description="This name already exists in our database. Use a different name or
          consider extending your name."
        />
      </el-form-item>
      <el-form-item label="Owners" prop="owners" required>
        <v-multi-select
          :mode="mode"
          :class="{ dark }"
          :is-required="true"
          :is-field-empty="isOwnersSelectEmpty"
          :options="ownersList"
          @input="loadOwnersSearch"
          :loading="isLoadingOwners"
          :value="mode === 'create' ? [] : form.owners"
          @values-change="handleOwnersSelectChange"
          @remove="handleOwnersSelectRemoveItem"
        />
      </el-form-item>
      <el-form-item label="Long name" prop="nameLong">
        <el-input
          class="w-fit-full"
          :class="{ dark }"
          v-model="form.nameLong"
          :disabled="isViewMode"
        />
      </el-form-item>
      <el-form-item label="Locations" prop="facilities">
        <v-multi-select
          :mode="mode"
          :class="{ dark }"
          :is-required="true"
          :is-field-empty="isFacilitiesEmpty"
          :options="facilitiesList"
          @input="loadFacilitiesSearch"
          :loading="isLoadingFacilities"
          @remove="handleFacilitiesSelection(form.facilities)"
          @values-change="handleFacilitiesSelection"
          :value="mode == 'create' ? [] : form.facilities"
        />
      </el-form-item>
      <el-form-item label="PeeringDB ID" prop="peeringDBId">
        <el-input
          class="w-fit-full"
          :class="{ dark }"
          v-model="form.peeringDBId"
          :disabled="isViewMode"
        />
      </el-form-item>
      <el-form-item label="Media" prop="media">
        <el-select
          v-model="form.media"
          class="w-fit-full"
          :class="{ dark }"
          placeholder
        >
          <el-option
            v-for="(opt, i) in mediaOptions"
            :key="i"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Policy Email" prop="policyEmail">
        <el-input
          class="w-fit-full"
          :class="{ dark }"
          v-model="form.policyEmail"
          :disabled="isViewMode"
        />
      </el-form-item>
      <el-form-item label="Policy Phone" prop="policyPhone">
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.policyPhone"
          :disabled="isViewMode"
        />
      </el-form-item>
      <el-form-item label="Tech Email" prop="techEmail">
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.techEmail"
          :disabled="isViewMode"
        />
      </el-form-item>
      <el-form-item label="Tech Phone" prop="techPhone">
        <el-input
          :class="{ dark }"
          class="w-fit-full"
          v-model="form.techPhone"
          :disabled="isViewMode"
        />
      </el-form-item>
      <el-form-item label="Proto ivp6" prop="proto_ipv6">
        <el-radio-group
          :class="{ dark }"
          v-model="form.proto_ipv6"
          :disabled="isViewMode"
          class="flex row justify-content-start w-fit-full"
        >
          <el-radio-button :class="{ dark }" :label="true">Yes</el-radio-button>
          <el-radio-button :class="{ dark }" :label="false">No</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Proto multicast" prop="proto_multicast">
        <el-radio-group
          :class="{ dark }"
          v-model="form.proto_multicast"
          :disabled="isViewMode"
          class="flex row justify-content-start w-fit-full"
        >
          <el-radio-button :class="{ dark }" :label="true">Yes</el-radio-button>
          <el-radio-button :class="{ dark }" :label="false">No</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Proto unicast" prop="proto_unicast">
        <el-radio-group
          v-model="form.proto_unicast"
          :disabled="isViewMode"
          :class="{ dark }"
          class="flex row justify-content-start w-fit-full"
        >
          <el-radio-button :class="{ dark }" :label="true">Yes</el-radio-button>
          <el-radio-button :class="{ dark }" :label="false">No</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Tags" class="mt2" prop="tags">
        <el-select
          v-model="form.tags"
          :disabled="isViewMode"
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
      <el-form-item class="mt16" v-if="!isViewMode">
        <el-button
          type="primary"
          class="w-fit-full capitalize"
          round
          :disabled="isSendDataDisabled"
          :loading="isSendingData"
          @click="sendData"
        >
          {{ title }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { searchOrganization } from '../../services/api/organizations'
import VMultiSelect from '../../components/MultiSelect'
import { checkIxpsNameExistence } from '../../services/api/check_name'
import debounce from '../../helpers/debounce'
import { searchFacilities } from '../../services/api/facs'

export default {
  name: 'FacsForm',
  components: {
    VMultiSelect
  },
  data: () => ({
    tag: '',
    inputVisible: false,
    tagsList: [],
    facilitiesList: [],
    isFacilitiesEmpty: false,
    isLoadingFacilities: false,
    isNameRepeated: false,
    isOwnersSelectEmpty: false,
    isLoadingOwners: false,
    ownersList: []
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
    mediaOptions() {
      return [
        {
          label: 'Ethernet',
          value: 'ethernet'
        },
        {
          label: 'Multiple',
          value: 'multiple'
        }
      ]
    },
    title() {
      return this.mode == 'create'
        ? 'Create IXP'
        : this.mode == 'view'
        ? 'View IXP'
        : 'Save changes'
    },
    formRules() {
      return {
        name: [
          {
            required: true,
            message: 'Please input short IXP name',
            trigger: 'change'
          },
          { min: 1, message: 'Length should be at least 1', trigger: 'change' }
        ],
        facilities: [
          {
            required: true,
            message: 'At least one location is required',
            trigger: 'change'
          }
        ],
        media: [],
        nameLong: [
          {
            required: true,
            message: 'Please input long IXP name',
            trigger: 'change'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'change' }
        ],
        techEmail: [
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change']
          }
        ],
        policyEmail: [
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change']
          }
        ],
        proto_ipv6: [],
        proto_unicast: [],
        proto_multicast: [],
        techPhone: [],
        policyPhone: [],
        peeringDBId: [],
        tags: [],
        owners: [
          {
            type: 'array',
            message: 'At least one owner is required',
            trigger: ['blur', 'change']
          }
        ]
      }
    },
    isViewMode() {
      return this.mode == 'view'
    },
    dark() {
      return this.$store.state.isDark
    }
  },
  watch: {
    'form.ownersList'(owners) {
      if (!owners) return
      this.ownersList = [...owners]
      delete this.form.ownersList
    },
    'form.facilitiesList'(facs) {
      if (!facs) return
      this.facilitiesList = [...facs]
      delete this.form.facilitiesList
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
  },
  methods: {
    async loadFacilitiesSearch(s) {
      if (s.length <= 0) return

      this.isLoadingFacilities = true
      const { data: facs = [] } = (await searchFacilities({
        user_id: await this.$auth.getUserID(),
        s
      })) || { facs: [] }

      this.facilitiesList = facs
      this.isLoadingFacilities = false
    },
    async handleFacilitiesSelection(data) {
      this.form.facilities = Array.from(data)
      this.isFacilitiesEmpty = !data.length
    },
    checkName: debounce(async function(name) {
      this.isNameRepeated = false
      const {
        t,
        data: { r }
      } = (await checkIxpsNameExistence({
        user_id: this.$auth.getUserID(),
        name
      })) || { t: 'error', data: { r: false } }
      if (t != 'error' && r >= 1) {
        this.isNameRepeated = true
      } else {
        this.isNameRepeated = false
      }
    }, 320),
    async loadOwnersSearch(s) {
      if (s === '') return

      this.isLoadingOwners = true
      const { data: owners = [] } = (await searchOrganization({
        user_id: await this.$auth.getUserID(),
        s
      })) || { owners: [] }

      this.ownersList = owners
      this.isLoadingOwners = false
    },
    handleOwnersSelectRemoveItem(_id) {
      this.form.owners = this.form.owners.filter(item => item._id != _id)
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
        isValid ? this.$emit('send-data') : false
      )
    }
  }
}
</script>
