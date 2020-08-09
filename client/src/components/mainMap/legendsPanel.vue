<template>
  <div class="legends-wrapper flex column bottom-shadow p4" :class="{ dark }">
    <header class="pt2 pb2">
      Legends.
    </header>
    <el-divider :class="{ dark }" class="mt1 mb1 w-fit-full" />
    <div
      class="box p1 inline-flex align-items-center seamless-hoverbg"
      :class="{ light: !dark, dark }"
      v-for="b in legends"
      :key="b.label"
    >
      <span
        class="color inline-block w4 h4 mr1"
        :style="`background-color:${b.color}`"
      />
      <span class="capitalize">
        {{ b.label }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LegendsPanel',
  computed: {
    legends() {
      return [
        {
          color: '#7288b0',
          label: 'active'
        },
        {
          color: '#BFADA3',
          label: 'decommissioned'
        },
        {
          color: '#FF0000',
          label: 'fault'
        },
        {
          color: '#CC591F',
          label: 'partial outage'
        },
        {
          color: '#af6ec7',
          label: 'project'
        }
      ]
    },
    dark() {
      return this.$store.state.isDark
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/components/legends-panel-styles.scss';
</style>
