<template>
  <div class="vph-half text-center">
    <el-divider class="m0"></el-divider>
    <div class="mt50">
      <h2>
        404 NOT FOUND
      </h2>
      <p>
        The page you’re looking for was not found... but you can find every
        single subsea and terrestrial cable in our map, click
        <router-link :to="checkIfLoggedIn" class="underline-hover">
          here
        </router-link>
        to head over there now.
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
