<template>
  <el-container direction="vertical">
    <h-navbar />
    <div class="h-fit-content min-height60vh">
      <slot />
    </div>
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
