<script>
import { mapActions } from 'vuex'
import {
  TOGGLE_SIDEBAR,
  TOGGLE_LOADING,
  GET_SUBMARINE,
  GET_DATA_CENTERS,
  GET_IX_FACILITIES,
  GET_NETWORKS
} from '../store/actionTypes'

export default {
  data: () => ({
    quantity: 20
  }),
  methods: {
    ...mapActions({
      getCurrentSelectionData: 'map/getCurrentSelectionData',
      getDataCentersData: 'getDataCentersData',
      getNetworksData: 'getNetworksData',
      getPremiumData: 'getPremiumData',
      getSubseaData: 'getSubseaData',
      getIxpsData: 'getIxpsData'
    }),
    clearSubsea() {
      this.$store.commit(`${GET_SUBMARINE}`, [])
    },
    clearDataCenters() {
      this.$store.commit(`${GET_DATA_CENTERS}`, [])
    },
    clearIxps() {
      this.$store.commit(`${GET_IX_FACILITIES}`, [])
    },
    clearNetworks() {
      this.$store.commit(`${GET_NETWORKS}`, [])
    },
    async handlePremiumSelection(opensMenu = true) {
      await this.getPremiumData()
      if (opensMenu) await this.toggleMenu('partners')
    },
    async handleSubmarineSelection(opensMenu = true) {
      if (opensMenu) {
        // I'm assuming that's opening the menu for the first time
        // Resetting quantity of items to load
        this.quantity = 20
        await this.toggleMenu('submarine')
      }
      await this.getSubseaData(this.quantity)
    },
    async handleDataCenterSelection(opensMenu = true) {
      if (opensMenu) {
        // I'm assuming that's opening the menu for the first time
        // Resetting quantity of items to load
        this.quantity = 20
        await this.toggleMenu('dataCenters')
      }
      await this.getDataCentersData(this.quantity)
    },
    async handleIxpsSelection(opensMenu = true) {
      if (opensMenu) {
        // I'm assuming that's opening the menu for the first time
        // Resetting quantity of items to load
        this.quantity = 20
        await this.toggleMenu('ixps')
      }
      await this.getIxpsData(this.quantity)
    },
    async handleNetworksSelection(opensMenu = true) {
      if (opensMenu) {
        // I'm assuming that's opening the menu for the first time
        // Resetting quantity of items to load
        this.quantity = 20
        await this.toggleMenu('networks')
      }
      await this.getNetworksData(this.quantity)
    },
    async handleLoadMoreItems(option) {
      this.quantity += 50
      switch(option.toLowerCase()) {
        case 'submarine':
          await this.handleSubmarineSelection(false)
          break
        case 'datacenters':
          await this.handleDataCenterSelection(false)
          break
        case 'ixps':
          await this.handleIxpsSelection(false)
          break
        default:
          this.handleNetworksSelection(false)
          break
      }
    },
    async handleCableSelected({ cable_id }) {
      if (!cable_id) return

      await this.$store.commit(`${TOGGLE_LOADING}`, true)
      try {
        await this.getCurrentSelectionData(cable_id).then(() => {
          this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
        })
      } catch {
        // Ignore
      } finally {
        this.$store.commit(`${TOGGLE_LOADING}`, false)
      }
    }
  },
}
</script>
