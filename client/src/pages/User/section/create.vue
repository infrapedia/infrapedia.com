<template>
  <div
    class="main-wrapper flex row nowrap w-fit-full vph-full pt12 text-center"
    :class="{ dark, light: !dark }"
  >
    <div class="left el-card p6">
      <header class="w-fit-full text-left mb8">
        <router-link :to="routeGiver">
          <fa :icon="['fas', 'arrow-left']" /> Back
        </router-link>
      </header>
      <cable-form v-if="creationType === 'cables'" :form="form" />
      <!-- <org-form v-else-if="creationType === 'org'" :form="form" /> -->
    </div>
    <div class="right w-fit-full">
      <editor-map />
    </div>
  </div>
</template>

<script>
import EditorMap from '../../../components/editor/Editor'
// import OrgForm from '../../../components/userCreationForms/org'
import CableForm from '../../../components/userCreationForms/cables'

export default {
  name: 'CreateSection',
  components: {
    'editor-map': EditorMap,
    'cable-form': CableForm
    // 'org-form': OrgForm
  },
  data: () => ({
    form: {},
    creationType: null
  }),
  mounted() {
    if (!this.$route.query.id) {
      return this.$router.push('/')
    }

    this.creationType = this.$route.query.id
    this.checkCreationType(this.creationType)
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    routeGiver() {
      const { creationType } = this
      let route = '/user/section/cables'
      switch (creationType) {
        // case 'orgs':
        //   route = '/user/section/orgs'
        //   break
        case 'cls':
          route = '/user/section/cls'
          break
        // case 'networks':
        //   route = '/user/section/networks'
        //   break
        default:
          route = '/user/section/cables'
          break
      }
      return route
    }
  },
  methods: {
    sendData() {
      console.warn('Not done yet')
    },
    checkCreationType(type) {
      switch (type) {
        case 'cable':
          this.form = {
            cls: '',
            name: '',
            urls: [],
            notes: '',
            facilities: '',
            fiberPairs: '',
            system_length: 0,
            capacity_tbps: 0,
            terrestrial: false,
            activationDateTime: ''
          }
          break
        default:
          this.form = {
            cls: '',
            name: '',
            urls: [],
            notes: '',
            facilities: '',
            fiberPairs: '',
            system_length: 0,
            capacity_tbps: 0,
            terrestrial: false,
            activationDateTime: ''
          }
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/scss/pages/user/create-styles.scss';
</style>
