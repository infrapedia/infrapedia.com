<template>
  <div>
    <map-overlay />
    <votation-dialog
      :is-visible="isPoolDialog"
      @close="() => (isPoolDialog = false)"
    />
  </div>
</template>

<script>
import MapOverlay from '../components/mainMap/MapOverlay'
import VotationDialog from '../components/dialogs/VotationDialog'
import { checkUserVote } from '../services/api/voting'
import debounce from '../helpers/debounce'

export default {
  components: {
    MapOverlay,
    VotationDialog
  },
  head: {
    title: 'Infrapedia | Global Internet Infrastructure Map',
    meta: [
      {
        name: 'application-name',
        content: 'Infrapedia | Global Internet Infrastructure Map'
      },
      {
        name: 'keywords',
        content:
          'custom maps, fiber optics maps, internet infrastructure map, live map, consulting, data center, sponsorship, ads, telecommunications'
      },
      {
        name: 'description',
        content:
          'Navigate through the World’s Largest Live Map of the Global Internet Infrastructure. All the data you need for free in a crowd-sourced platform.'
      }
    ]
  },
  data: () => ({
    isPoolDialog: false
  }),
  beforeCreate() {
    this.$emit('layout', 'map-app-layout')
  },
  async created() {
    await this.checkVote()
  },
  methods: {
    checkVote: debounce(async function() {
      const { t } = await checkUserVote(await this.$auth.getUserID())
      if (t != 'error') {
        this.isPoolDialog = true
      }
    }, 1200)
  }
}
</script>
