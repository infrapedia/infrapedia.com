<template>
  <div class="certificate-icon">
    <span>
      <fa :icon="['fas', 'certificate']" />
    </span>
    <span class="check">
      <fa :icon="['fas', 'check']" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'CertificatedIcon'
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/components/certificated-icon-styles.scss';
</style>
