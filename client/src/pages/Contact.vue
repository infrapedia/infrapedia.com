<template>
  <div class="main-wrapper mb20">
    <el-divider class="m0 mb20" />
    <div class="inner-wrapper">
      <header class="description_title">
        <h1 class="title">
          Contact us
        </h1>
        <p class="text">
          Submit your queries here and we will get back to you as soon as
          possible.
        </p>
      </header>
      <el-card class="form-wrapper p8 round">
        <header class="mb4">
          <h2 class="title sm">
            Send us a Message
          </h2>
        </header>
        <el-form :rules="formRules" :model="form" class="transparent">
          <el-row :gutter="20">
            <el-col :sm="24" :lg="12">
              <el-form-item label="Name" prop="name" required>
                <el-input v-model="form.name" />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :lg="12">
              <el-form-item label="Last name" prop="name" required>
                <el-input v-model="form.lastname" />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :lg="12">
              <el-form-item label="Company" prop="company" required>
                <el-input v-model="form.company" />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :lg="12">
              <el-form-item label="Email" prop="email" required>
                <el-input v-model="form.email" />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :lg="24">
              <el-form-item label="Message" prop="message">
                <el-input type="textarea" :rows="4" v-model="form.message" />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :lg="24">
              <el-form-item>
                <div class="flex mt4 row justify-content-end">
                  <el-button round class="w-fit-full" type="primary">
                    Send
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <footer>
          <el-divider></el-divider>
          <p class="text sm">
            If you’re enjoying our blog,
            <el-button
              type="text"
              @click="showPopup"
              class="cursor-pointer underline-hover"
              >subscribe</el-button
            >
            to our Newsletter and never miss a thing.
          </p>
        </footer>
      </el-card>
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
  head: {
    title: 'Infrapedia | Contact Us | Global Internet Infrastructure Map'
  },
  beforeCreate() {
    this.$emit('layout', 'landing-layout')
  },
  methods: {
    showPopup() {
      return console.warn('not done yet')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/pages/contact-styles.scss';
</style>
