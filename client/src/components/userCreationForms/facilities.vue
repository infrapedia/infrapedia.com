<template>
  <div>
    <el-form ref="form" :model="form" :rules="formRules">
      <basic-information :mode="mode" :form="form" v-if="step == 1" />
      <building-details :mode="mode" :form="form" v-if="step == 2" />
      <power-details :mode="mode" :form="form" v-if="step == 3" />
      <security-details :mode="mode" :form="form" v-if="step == 4" />
      <onsite-services-details :mode="mode" :form="form" v-if="step == 5" />
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FacsForm',
  components: {
    'basic-information': () => import('./facility-steps/basic-information.vue'),
    'building-details': () => import('./facility-steps/building-details.vue'),
    'power-details': () => import('./facility-steps/power-details.vue'),
    'security-details': () => import('./facility-steps/security-details.vue'),
    'onsite-services-details': () =>
      import('./facility-steps/onsite-services.vue')
  },
  data: () => ({}),
  props: {
    step: {
      type: Number,
      required: true
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
    formRules() {
      return {
        name: [
          {
            required: true,
            message: 'Please input facility name',
            trigger: 'change'
          },
          { min: 3, message: 'Length should be at least 3', trigger: 'change' }
        ],
        StartDate: [
          {
            type: 'date',
            required: true,
            trigger: ['blur', 'change'],
            message: 'Please pick a date'
          }
        ],
        owners: [
          {
            type: 'array',
            message: 'At least one owner is required',
            trigger: ['blur', 'change']
          }
        ]
      }
    },
    dark() {
      return this.$store.state.isDark
    }
  },
  watch: {
    'form.ixpsList'(ixps) {
      if (!ixps) return
      this.ixpsList = [...ixps]
      delete this.form.ixpsList
    },
    'form.ownersList'(owners) {
      if (!owners) return
      this.ownersList = [...owners]
      delete this.form.ownersList
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
    sendData() {
      this.setOwnersEmptyState()
      return this.$refs['form'].validate(isValid =>
        isValid ? this.$emit('send-data') : false
      )
    }
  }
}
</script>
