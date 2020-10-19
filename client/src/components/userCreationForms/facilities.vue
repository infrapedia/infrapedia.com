<template>
  <div style="flex-basis: 100%">
    <transition name="fade" mode="out-in">
      <component
        :is="currentView"
        :form="form"
        :mode="mode"
        @set-selection-onto-map="$emit('set-selection-onto-map', $event)"
      />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'FacsForm',
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
    dark() {
      return this.$store.state.isDark
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
      this.$emit('send-data')
    }
  }
}
</script>
