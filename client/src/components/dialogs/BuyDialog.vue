<template>
  <el-dialog
    :visible.sync="isVisible"
    width="80%"
    top="12vh"
    :custom-class="customDialogClass"
    :close-on-click-modal="false"
  >
    <header slot="title" class="header p0 no-selectable">
      <h1 class="inline-block font-semibold fs-xlarge">
        Buy Now! -
        <span class="capitalize">{{ dialogTitle }}</span>
      </h1>
    </header>
    <el-form :model="form" :rules="formRules" class="pr2 pl2" ref="form">
      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <el-form-item label="Company name" prop="company">
            <el-input v-model="form.company" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="First Name" prop="name">
            <el-input v-model="form.name" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
          <el-form-item label="Last Name" prop="lastname">
            <el-input v-model="form.lastname" :class="{ dark }" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="Email" prop="email">
            <el-input type="email" v-model="form.email" :class="{ dark }" />
          </el-form-item>
        </el-col>
        <template v-if="dialogTitle !== 'Other'">
          <el-col
            v-if="dialogTitle !== 'Datacenter'"
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item label="Capacity" prop="capacity">
              <el-select
                class="w-fit-full"
                :class="{ dark }"
                filterable
                v-model="form.capacity"
                placeholder="Select an option"
              >
                <el-option
                  v-for="option in capacities"
                  :key="option"
                  :label="option"
                  :value="option"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-else>
            <div class="block">
              <el-form-item prop="rack">
                <span slot="label">
                  <span class="text-red">*</span> Rack total
                </span>
                <br />
                <div class="block">
                  <el-slider
                    class="relative"
                    id="rack-slider"
                    v-model="form.totalRack"
                    show-input
                    input-size="small"
                  />
                </div>
              </el-form-item>
            </div>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <footer class="footer flex wrap justify-content-space-between pr0 pl6">
      <small class="inline-block mt2 mb4">
        <span class="text-red">*</span> indicates required field
      </small>
      <div>
        <el-button plain type="info" class="mr2" @click="closeDialog"
          >Cancel</el-button
        >
        <el-button
          :disabled="isFormUncomplete"
          type="primary"
          class="w24"
          plain
          @click="submitForm('form')"
          @keyup.enter.space="submitForm('form')"
          >Buy</el-button
        >
      </div>
    </footer>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { buyRequest } from '@/services/api'
import { TOGGLE_BUY_DIALOG, BUY_TYPE } from '@/store/actionTypes'

export default {
  data: () => ({
    capacities: ['1GB', '10GB', '100GB', 'Others'],
    form: {
      company: '',
      email: '',
      name: '',
      lastname: '',
      capacity: '',
      totalRack: 0,
      issue: ''
    },
    formRules: {
      name: [
        {
          required: true,
          message: 'Please input your first name',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: 'Length should be 3 to 10',
          trigger: 'blur'
        }
      ],
      lastname: [
        {
          required: true,
          message: 'Please input your last name name',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: 'Length should be 3 to 10',
          trigger: 'blur'
        }
      ],
      company: [
        { required: true, message: 'Company name is required', trigger: 'blur' }
      ],
      email: [
        { required: true, message: 'Please input your email', trigger: 'blur' },
        {
          type: 'email',
          required: true,
          message: 'Please input a valid email',
          trigger: 'change'
        }
      ],
      capacity: [
        {
          required: true,
          message: 'Please select the desired capacity',
          trigger: 'change'
        }
      ]
    }
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
      return (this.buyType && this.buyType.title) || ''
    },
    isFormUncomplete() {
      const { name, lastname, capacity, email, company } = this.form
      let title = this.dialogTitle.toLowerCase()
      let isDisabled = true

      if (
        title !== 'datacenter' &&
        name !== '' &&
        lastname !== '' &&
        capacity !== '' &&
        email !== '' &&
        company !== ''
      ) {
        isDisabled = false
      } else if (
        (title === 'datacenter' || title === 'other') &&
        company !== '' &&
        name !== '' &&
        lastname !== '' &&
        email !== ''
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
    async sendBuyRequest() {
      const res = await buyRequest({
        ...this.form,
        type: this.dialogTitle,
        cable: this.$store.state.map.currentSelection.name
      })

      if (res && res.status !== 'error') {
        this.$notify({
          type: 'success',
          title: 'Email sent!',
          message: 'You will hear from us in the next few days'
        })
        this.closeDialog()
      }
    },
    submitForm(formRef) {
      this.$refs[formRef].validate(valid => {
        if (valid) this.sendBuyRequest()
        else return false
      })
    },
    closeDialog() {
      this.$store.commit(`${TOGGLE_BUY_DIALOG}`, false)
      this.$refs.form.resetFields()
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
