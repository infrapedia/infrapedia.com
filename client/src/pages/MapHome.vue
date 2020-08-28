<template>
  <div>
    <map-overlay />
  </div>
</template>

<script>
import MapOverlay from '../components/mainMap/MapOverlay'
import { IS_DRAWING } from '../store/actionTypes'
import { getMetaDataTagsFromSelectionType } from '../helpers'

export default {
  components: {
    MapOverlay
  },
  data: () => ({
    isPoolDialog: false,
    metaData: {
      title: 'Infrapedia | Global Internet Infrastructure Map',
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
          content:
            'Navigate through the World’s Largest Live Map of the Global Internet Infrastructure. All the data you need for free in a crowd-sourced platform.'
        }
      ]
    }
  }),
  computed: {
    focus() {
      return this.$store.state.map.focus
    }
  },
  head() {
    return this.metaData
  },
  watch: {
    '$store.state.map.currentSelection'(data) {
      this.handleCurrentMetaTagsUpdate(data)
    },
    '$store.state.isSidebar'(bool) {
      if (!bool) {
        this.handleCurrentMetaTagsUpdate(bool)
      }
    }
  },
  beforeCreate() {
    this.$emit('layout', 'map-app-layout')
  },
  beforeRouteLeave(to, from, next) {
    if (this.$store.state.isDrawing) {
      this.$store.commit(`${IS_DRAWING}`, false)
    }
    next()
  },
  methods: {
    handleCurrentMetaTagsUpdate(data) {
      setTimeout(() => {
        if (!data) {
          this.metaData = {
            title: 'Infrapedia | Global Internet Infrastructure Map',
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
              }
            ]
          }
        } else {
          this.metaData = {
            ...getMetaDataTagsFromSelectionType({
              name: data.name,
              owners: data.owners,
              type: this.focus ? this.focus.type : ''
            })
          }
        }
      }, 220)
    }
  }
  // ----------------------------------------------------------------------------
  // ----------------------------------------------------------------------------
  // ----------------------------------------------------------------------------
  //  <votation-dialog
  //     :is-visible="isPoolDialog"
  //     @close="() => (isPoolDialog = false)"
  //   />
  // import VotationDialog from '../components/dialogs/VotationDialog'
  // import { checkUserVote } from '../services/api/voting'
  // import debounce from '../helpers/debounce'
  // VotationDialog
  // async created() {
  //   await this.checkVote()
  // },
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
