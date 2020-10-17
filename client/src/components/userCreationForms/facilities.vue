<template>
  <el-form ref="form" :model="form" :rules="formRules" style="flex-basis: 100%">
    <transition name="fade" mode="out-in">
      <component :is="currentView" :mode="mode" :form="form" />
    </transition>
  </el-form>
</template>

<script>
export default {
  name: 'FacsForm',
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
    currentView() {
      let view

      if (this.step == 1) {
        view = () => import('./facility-steps/basic-information.vue')
      } else if (this.step == 2) {
        view = () => import('./facility-steps/building-details.vue')
      } else if (this.step == 3) {
        view = () => import('./facility-steps/power-details.vue')
      } else if (this.step == 4) {
        view = () => import('./facility-steps/security-details.vue')
      } else if (this.step == 5) {
        view = () => import('./facility-steps/onsite-services.vue')
      }
      return view
    },
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
