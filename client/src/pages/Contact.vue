<template>
  <div class="main-wrapper">
    <div class="form-wrapper">
      <div class="inner-wrapper pt16 pb20 mt16">
        <h1 class="title inline-block">
          Contact us
        </h1>
        <el-form :rules="formRules" :model="form" class="p8 form">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Name" prop="name" required>
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Last name" prop="name" required>
                <el-input v-model="form.lastname" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Company" prop="company" required>
                <el-input v-model="form.company" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Email" prop="email" required>
                <el-input v-model="form.email" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Message" prop="message">
                <el-input type="textarea" :rows="4" v-model="form.message" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <div class="flex mt4 row justify-content-end">
                  <el-button type="primary">
                    Send
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    form: {
      message: '',
      name: '',
      email: ''
    },
    formRules: {
      name: [
        {
          required: true,
          message: 'Please input your full name',
          trigger: 'change'
        }
      ],
      lastname: [
        {
          required: true,
          message: 'Please input your last name',
          trigger: 'change'
        }
      ],
      email: [
        {
          type: 'email',
          message: 'Please input a valid email address',
          trigger: ['blur', 'change']
        }
      ],
      message: [],
      company: []
    }
  }),
  beforeCreate() {
    this.$emit('layout', 'landing-layout')
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/contact-styles.scss';
</style>
