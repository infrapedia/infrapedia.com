<template>
  <div>
    <map-overlay />
    <!-- <votation-dialog
      :is-visible="isPoolDialog"
      @close="() => (isPoolDialog = false)"
    /> -->
  </div>
</template>

<script>
// import VotationDialog from '../components/dialogs/VotationDialog'
import MapOverlay from '../components/mainMap/MapOverlay'
// import { checkUserVote } from '../services/api/voting'
import { IS_DRAWING } from '../store/actionTypes'
// import debounce from '../helpers/debounce'

export default {
  components: {
    MapOverlay
    // VotationDialog
  },
  data: () => ({
    isPoolDialog: false
  }),
  computed: {
    focus() {
      return this.$store.state.map.focus
    }
  },
  head() {
    return {
      title: this.focus
        ? this.focus.name
        : 'Infrapedia | Global Internet Infrastructure Map',
      meta: [
        {
          vmid: 'application-name',
          name: 'application-name',
          content: 'Infrapedia | Global Internet Infrastructure Map'
        },
        {
          vmid: 'keywords',
          name: 'keywords',
          content:
            'custom maps, fiber optics maps, internet infrastructure map, live map, consulting, data center, sponsorship, ads, telecommunications'
        },
        {
          vmid: 'description',
          name: 'description',
          content: this.focus
            ? this.focus.name
            : 'Navigate through the World’s Largest Live Map of the Global Internet Infrastructure. All the data you need for free in a crowd-sourced platform.'
        }
      ]
    }
  },
  // watch: {
  //   '$store.state.map.currentSelection'(info) {
  //     this.handleMetaDataChange(info)
  //   }
  // },
  beforeCreate() {
    this.$emit('layout', 'map-app-layout')
  },
  // async created() {
  //   await this.checkVote()
  // },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.isDrawing) {
      this.$store.commit(`${IS_DRAWING}`, false)
    }
    next()
  }
  // methods: {
  // checkVote: debounce(async function() {
  //   const { t } = (await checkUserVote(await this.$auth.getUserID())) || {
  //     t: 'error'
  //   }
  //   if (t && t != 'error') {
  //     this.isPoolDialog = true
  //   }
  // }, 1200)
  // }
}
</script>
