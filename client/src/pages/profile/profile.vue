<template>
  <div
    class="main-wrapper w-fit-full mt12 pt8 vph-full pl4 pr4 flex column wrap align-items-start"
    :class="{ dark, light: !dark }"
  >
    <header
      class="mb8 flex row nowrap w-fit-full justify-content-space-between"
    >
      <h1 class="title-user color-inherit">
        Profile
      </h1>
      <el-button round @click="goToRoute" type="warning">
        Email providers
      </el-button>
    </header>
    <div class="flex w-fit-full row">
      <el-card shadow="never" class="p5 w-fit-full" v-loading="loading">
        <el-form :model="form" :rules="rules" ref="form">
          <el-row :gutter="20">
            <el-col :sm="24" :md="24" :lg="12">
              <el-form-item prop="name" label="First name">
                <el-input v-model="form.name" :class="{ dark }" />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="24" :lg="12">
              <el-form-item prop="user_metadata.lastname" label="Last name">
                <el-input
                  v-model="form.user_metadata.lastname"
                  :class="{ dark }"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :sm="24" :md="24" :lg="12">
              <el-form-item prop="email" label="Email address">
                <el-input v-model="form.email" :class="{ dark }" />
              </el-form-item>
            </el-col>
            <el-col :sm="24" :md="24" :lg="12">
              <el-form-item label="Phone number">
                <div class="el-input">
                  <i-phone-input
                    inputClasses="el-input__inner"
                    v-model="form.user_metadata.phonenumber.num"
                    @onInput="validatePhoneNumber"
                    class="m0 p0 el-input__inner"
                  />
                </div>
                <el-collapse-transition>
                  <el-alert
                    type="error"
                    class="mt2 h8"
                    show-icon
                    title="This phone number is not valid"
                    :closable="false"
                    v-if="
                      form.user_metadata.phonenumber.num &&
                        !form.user_metadata.phonenumber.valid
                    "
                  />
                </el-collapse-transition>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :sm="24" :md="24" :lg="12">
              <el-form-item
                prop="user_metadata.companyname"
                label="Company name"
              >
                <el-input
                  v-model="form.user_metadata.companyname"
                  :class="{ dark }"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <footer class="flex justify-content-end">
            <el-form-item class="m0 p0">
              <el-button
                round
                type="warning"
                class="w22"
                size="medium"
                @click="validateForm"
              >
                Save
              </el-button>
            </el-form-item>
          </footer>
        </el-form>
      </el-card>
    </div>
    <footer class="mt10 p0">
      <router-link
        exact
        id="changePass"
        to="/change-password"
        class="underline fs-regular"
      >
        Change my password »
      </router-link>
    </footer>
  </div>
</template>

<script>
import { getUserData, updateUserData } from '../../services/api/auth'

export default {
  name: 'profile',
  data: () => ({
    loading: false,
    form: {
      name: '',
      email: '',
      user_metadata: {
        lastname: '',
        phonenumber: {
          num: '',
          valid: null
        },
        companyname: ''
      }
    },
    rules: {
      name: [
        {
          required: true,
          message: 'Please input your first name',
          trigger: 'blur'
        }
      ],
      'user_metadata.companyname': [
        {
          required: true,
          message: 'Please input your company name',
          trigger: 'blur'
        }
      ],
      'user_metadata.lastname': [
        {
          required: true,
          message: 'Please input your last name',
          trigger: 'blur'
        }
      ],
      email: [
        {
          required: true,
          message: 'Please input your email',
          trigger: 'blur',
          type: 'email'
        }
      ]
    }
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  beforeCreate() {
    this.$emit('layout', 'profile-layout')
  },
  async created() {
    if (Object.keys(this.$route.query).length) {
      await this.$router.replace('/user/profile')
    }
    await this.setUserData()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (Object.keys(vm.$route.query).length)
        vm.$router.replace('/user/profile')
    })
  },
  methods: {
    goToRoute() {
      return this.$router.push('/user/profile/email-providers')
    },
    async setUserData() {
      if (!this.$auth || !this.$auth.user) return
      this.loading = true
      setTimeout(async () => {
        const userData = await getUserData(this.$auth.user.sub)
        if (userData) {
          const { user_metadata } = userData
          this.form = {
            name:
              user_metadata && user_metadata.name
                ? user_metadata.name
                : userData.name,
            email:
              user_metadata && user_metadata.email
                ? user_metadata.email
                : userData.email,
            user_metadata: {
              lastname:
                user_metadata && user_metadata.lastname
                  ? user_metadata.lastname
                  : name.split(' ')[1]
                  ? name.split(' ')[1]
                  : '',
              phonenumber:
                user_metadata && user_metadata.phonenumber
                  ? user_metadata.phonenumber
                  : { num: '', valid: null },
              companyname:
                user_metadata && user_metadata.companyname
                  ? user_metadata.companyname
                  : ''
            }
          }
        }
        this.loading = false
      }, 100)
    },
    validatePhoneNumber({ number, isValid }) {
      try {
        this.form.user_metadata.phonenumber = {
          num: number,
          valid: isValid
        }
      } catch {
        // Ignore
      }
    },
    validateForm() {
      this.$refs.form.validate(valid => (valid ? this.updateUser() : false))
    },
    async updateUser() {
      const { form, $auth } = this
      const res = updateUserData(
        { ...form },
        { _id: $auth.user.sub, connection: $auth.user.sub.split('|')[0] },
        false
      )
      if (res) {
        this.$notify({
          title: 'Success!',
          message: 'The changes has been saved successfully',
          type: 'success'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/pages/user/profile-styles.scss';
</style>
