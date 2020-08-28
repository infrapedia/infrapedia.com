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
      title: 'Global Internet Infrastructure Map | Infrapedia',
      meta: [
        {
          name: 'application-name',
          content:
            'Global Internet Infrastructure Map | Telecommunications and Data Center Infrastructure'
        },
        {
          name: 'description',
          content:
            "Infrapedia is the world’s largest crowd-sourced map of the global Internet infrastructure. Explore in detail the world's data centers, submarine and terrestrial networks in real-time."
        },
        {
          name: 'keywords',
          content:
            'internet map, global internet infrastructure, submarine cable map. telecommunications, network pops, world internet structure'
        },
        // ------------------ FACEBOOK - OPEN GRAPH
        {
          vmid: 'og:title',
          name: 'og:title',
          content:
            'The world’s largest network and datacenter infrastructure atlas.'
        },
        {
          vmid: 'og:description',
          name: 'og:description',
          content:
            "Infrapedia is the world’s largest crowd-sourced map of the global Internet infrastructure. Explore in detail the world's data centers, submarine and terrestrial networks in real-time."
        },
        {
          vmid: 'og:image',
          name: 'og:image',
          content: '/infrapedia-2.jpg'
        },
        // ---------------------- TWITTER
        {
          vmid: 'twitter:title',
          name: 'twitter:title',
          content:
            'The world’s largest network and datacenter infrastructure atlas.'
        },
        {
          vmid: 'twitter:description',
          name: 'twitter:description',
          content:
            "Infrapedia is the world’s largest crowd-sourced map of the global Internet infrastructure. Explore in detail the world's data centers, submarine and terrestrial networks in real-time."
        },
        {
          vmid: 'twitter:image',
          name: 'twitter:image',
          content: '/infrapedia-2.jpg'
        },
        {
          vmid: 'content-language',
          name: 'content-language',
          content: 'en-US'
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
          // this.$router.replace('/app')
        } else {
          this.metaData = {
            ...getMetaDataTagsFromSelectionType({
              name: data.name,
              owners: data.owners,
              type: this.focus ? this.focus.type : ''
            })
          }
          // this.$router.replace(`/app/${this.focus.type}`/data.slug)
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
