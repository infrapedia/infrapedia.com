<template>
  <el-dialog
    :visible.sync="isVisible"
    width="80%"
    top="28vh"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
    :show-close="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">
        Buy Now! - <span class="capitalize">{{ dialogTitle }}</span>
      </h1>
    </header>
    <el-form class="pr6 pl6">
      <el-row :gutter="15">
        <el-col :span="8">
          <el-form-item label="Company name*">
            <el-input v-model="form.company" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="First Name*">
            <el-input v-model="form.name" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Last Name*">
            <el-input v-model="form.lastname" :class="{ dark }" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="Email*">
            <el-input type="email" v-model="form.email" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <template v-if="dialogTitle !== 'Other'">
          <el-col :span="12" v-if="dialogTitle !== 'Datacenter'">
            <el-form-item label="Capacity*">
              <el-select
                class="w-fit-full"
                :class="{ dark }"
                v-model="form.capacity"
                placeholder="Select an option"
              >
                <el-option
                  v-for="option in capacities"
                  :key="option"
                  filterable
                  :label="option"
                  :value="option" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <div class="mt6">
              <span> Rack total* </span>
              <el-slider
                id="rack-slider"
                v-model="form.totalRack"
                show-input
                input-size="small"
              />
            </div>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <footer class="footer flex justify-content-space-between pr0 pl6">
      <small>* indicates required field</small>
      <div>
        <el-button
          plain
          type="info"
          class="mr2"
          @click="closeDialog"
        >
          Cancel
        </el-button>
        <el-button
          :disabled="isFormUncomplete"
          type="primary"
          class="w24"
          plain
        >
          Buy
        </el-button>
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { TOGGLE_BUY_DIALOG, BUY_TYPE } from '@/store/actionTypes'

export default {
  data: () => ({
    form: {
      company: '',
      email: '',
      name: '',
      lastname: '',
      capacity: '',
      totalRack: 0,
      issue: ''
    },
    capacities: ['1GB', '10GB', '100GB', 'Others']
  }),
  computed: {
    ...mapState({
      buyType: state => state.buyType,
      dark: state => state.isDark
    }),
    isVisible: {
      get() {
        return this.$store.state.isBuyDialog
      },
      set() {
        return this.closeDialog()
      }
    },
    dialogTitle() {
      return this.buyType && this.buyType.title || ''
    },
    isFormUncomplete() {
      const { name, lastname, capacity, email, company } = this.form
      let isDisabled = true
      if (
        name !== '' &&
        lastname !== '' &&
        capacity !== '' &&
        email !== '' &&
        company!== ''
      ) {
        isDisabled = false
      }
      return isDisabled
    },
    customDialogClass() {
      return this.dark ? 'custom-dialog dark' : 'custom-dialog light'
    }
  },
  methods: {
    closeDialog() {
      this.$store.commit(`${TOGGLE_BUY_DIALOG}`, false)
      this.form = {
        company: '',
        email: '',
        name: '',
        lastname: '',
        capacity: '',
        totalRack: 0,
        issue: ''
      }
      this.$store.commit(`${BUY_TYPE}`, null)
    }
  }
}
</script>
