<template>
  <el-container direction="vertical">
    <h-navbar />
    <slot />
    <h-footer />
  </el-container>
</template>

<script>
import HFooter from '../components/homepage/Footer'
import HNavbar from '../components/homepage/Navbar'

export default {
  name: 'homepage',
  components: {
    HFooter,
    HNavbar
  }
}
</script>
