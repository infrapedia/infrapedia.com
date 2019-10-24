<template>
  <div
    class="main-wrapper w-fit-full vph-full pt20 pb24 pr7 pl7"
    :class="{ dark, light: !dark }"
  >
    <header class="mb8">
      <h1 class="title-user">
        Profile
      </h1>
    </header>
    <el-card shadow="never" class="pt2 pr5 pl5 pb4 mt8">
      <el-form>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="First name">
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Last name">
              <el-input v-model="form.user_metadata.lastname" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Email address">
              <el-input v-model="form.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Phone number">
              <el-input v-model="form.user_metadata.phonenumber" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Company name">
              <el-input v-model="form.user_metadata.companyname" />
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
      <router-link to="/change-password" exact class="underline fs-regular">
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
        phonenumber: '',
        companyname: ''
      }
    }
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/pages/profile-styles.scss';
</style>
