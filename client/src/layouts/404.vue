<template>
  <div class="vph-half text-center">
    <el-divider class="m0"></el-divider>
    <div class="mt50">
      <h2>
        404 NOT FOUND
      </h2>
      <p>
        The page you’re looking for was not found...
        <router-link :to="checkIfLoggedIn" class="underline-hover">
          Home
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    checkIfLoggedIn() {
      return this.$auth.isAuthenticated ? '/app' : '/'
    }
  }
}
</script>

<style></style>
