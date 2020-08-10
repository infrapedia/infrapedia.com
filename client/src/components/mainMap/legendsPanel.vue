<template>
  <div class="legends-wrapper flex column bottom-shadow" :class="{ dark }">
    <header class="pt2 pb2 pr4 pl4">
      Legend
    </header>
    <el-divider :class="{ dark }" class="mt1 mb1 w-fit-full" />
    <div
      class="box p1 mb1 inline-flex align-items-center seamless-hoverbg pr4 pl4"
      :class="{ light: !dark, dark }"
      v-for="b in legend"
      :key="b.label"
    >
      <span
        class="color inline-block w4 h4 mr1 circle"
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
    legend() {
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
