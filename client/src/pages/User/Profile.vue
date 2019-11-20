<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <header class="mb8">
      <h1 class="title-user color-inherit">
        Profile
      </h1>
    </header>
    <el-card shadow="never" class="pt2 pr5 pl5 pb4 mt8">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="First name">
              <el-input v-model="form.name" :class="{ dark }" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Last name">
              <el-input
                v-model="form.user_metadata.lastname"
                :class="{ dark }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Email address">
              <el-input v-model="form.email" :class="{ dark }" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Phone number">
              <div class="el-input">
                <i-phone-input
                  inputClasses="el-input__inner"
                  v-model="form.user_metadata.phonenumber.num"
                  @onInput="validatePhoneNumber"
                  class="m0 p0 el-input__inner"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Company name">
              <el-input
                v-model="form.user_metadata.companyname"
                :class="{ dark }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <footer class="flex justify-content-end">
          <el-form-item class="m0 p0">
            <el-button round type="warning" class="w22" size="medium">
              Save
            </el-button>
          </el-form-item>
        </footer>
      </el-form>
    </el-card>
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
export default {
  name: 'profile',
  data: () => ({
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
    }
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  mounted() {
    if (Object.keys(this.$route.query).length)
      this.$router.replace('/user/profile')
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (Object.keys(vm.$route.query).length)
        vm.$router.replace('/user/profile')
    })
  },
  methods: {
    validatePhoneNumber({ number, isValid }) {
      const { phonenumber } = this.form.user_metadata

      phonenumber.num = number
      phonenumber.valid = isValid
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/pages/profile-styles.scss';
</style>
