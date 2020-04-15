<template>
  <div class="pb6 pt6 pr8 pl8">
    <header slot="header" class="w-fit-full mb8">
      <h1 class="title capitalize">{{ title }} IXP</h1>
    </header>
    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Name">
        <el-input
          class="w-fit-full"
          v-model="form.name"
          :disabled="isViewMode"
        />
      </el-form-item>
      <el-form-item label="Long name">
        <el-input
          class="w-fit-full"
          v-model="form.nameLong"
          :disabled="isViewMode"
        />
      </el-form-item>
      <el-form-item label="Policy Email">
        <el-input
          class="w-fit-full"
          v-model="form.policyEmail"
          :disabled="isViewMode"
        />
      </el-form-item>
      <el-form-item label="Policy Phone">
        <el-input
          class="w-fit-full"
          v-model="form.policyPhone"
          :disabled="isViewMode"
        />
      </el-form-item>
      <el-form-item label="Proto ivp6">
        <el-radio-group
          v-model="form.proto_ivp6"
          :disabled="isViewMode"
          class="flex row justify-content-start w-fit-full"
        >
          <el-radio-button :label="true">Yes</el-radio-button>
          <el-radio-button :label="false">No</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Proto multicast">
        <el-radio-group
          v-model="form.proto_multicast"
          :disabled="isViewMode"
          class="flex row justify-content-start w-fit-full"
        >
          <el-radio-button :label="true">Yes</el-radio-button>
          <el-radio-button :label="false">No</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Proto unicast">
        <el-radio-group
          v-model="form.proto_unicast"
          :disabled="isViewMode"
          class="flex row justify-content-start w-fit-full"
        >
          <el-radio-button :label="true">Yes</el-radio-button>
          <el-radio-button :label="false">No</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Tags" class="mt2">
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
          @click="sendData"
        >
          {{ title }} IXP
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'FacsForm',
  data: () => ({
    tag: '',
    inputVisible: false,
    tagsList: [],
    formRules: {}
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
      return this.mode == 'create'
        ? 'Create'
        : this.mode == 'view'
        ? 'View'
        : 'Edit'
    },
    isViewMode() {
      return this.mode == 'view'
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
    }
  }
}
</script>
