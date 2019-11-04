<script>
import { mapActions } from 'vuex'
import { bus } from '../helpers/eventBus'
import {
  TOGGLE_SIDEBAR,
  TOGGLE_LOADING,
  GET_SUBMARINE,
  GET_DATA_CENTERS,
  GET_IX_FACILITIES,
  GET_NETWORKS
} from '../store/actionTypes'
import { FOCUS_ON } from '../events'
import { MAP_BOUNDS, MAP_FOCUS_ON, MAP_POINTS } from '../store/actionTypes/map'

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
      getIxpsData: 'getIxpsData',
      // --- Services for retrieving navbar item selection - start ---
      getPremiumSelectedData: 'getPremiumSelectedData',
      getOrganizationID: 'getOrganizationID',
      getPremiumSelectedBoundsData: 'getPremiumSelectedBoundsData',
      getPremiumSelectedFeaturesData: 'getPremiumSelectedFeaturesData',
      getSubseaCableBoundsData: 'getSubseaCableBoundsData'
      // --- Services for retrieving navbar item selection - end ---
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
    async handleCableSelected({ cable_id, name }) {
      if (!cable_id) return

      await this.$store.commit(`${TOGGLE_LOADING}`, true)
      await this.$store.commit(`${MAP_FOCUS_ON}`, { type: 'fac', id: cable_id, name })
      try {
        await this.getCurrentSelectionData(cable_id).then(() => {
          this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
        })
      } catch {
        // Ignore
      } finally {
        this.$store.commit(`${TOGGLE_LOADING}`, false)
      }
    },
    async handleItemListSelection({ option, id }) {
      console.log(option, id)
      this.closeUnwantedOpenMenus()
      switch (option.toLowerCase()) {
        case 'partners':
          this.handlePremiumPartnerSelection(id)
          break
        case 'submarine':
          this.handleSubmarineCablesSelection(id)
          break
        case 'ixps':
          break
        case 'networks':
          break
        case 'datacenters':
          break
        case 'data centers':
          break
      }
    },
    async handlePremiumPartnerSelection(id) {
      if (!id) throw { message: 'MISSING ID PARAMETER'}

      // RETRIEVING BOUNDS FOR MAP ZOOM IN
      const bounds = await this.getPremiumSelectedBoundsData(id)
      if (bounds) {
        // SETTING BOUNDS
        await this.$store.commit(`${MAP_BOUNDS}`, bounds)
        // RETRIEVING FEATURES
        const points = await this.getPremiumSelectedFeaturesData(id)
        if (!points) return
        // SETTING POINTS
        await this.$store.commit(`${MAP_POINTS}`, points.features)

        // IF THE LENGTH IS EXACTLY 1.
        // I NEED TO GET THE ORG INFORMATION FOR OPENING THE SIDEBAR
        if (points.features && points.features.length === 1) {
          await this.getPremiumSelectedData(points.features[0].properties.fac_id)
        }

        // GETTING ORGANIZATION ID
        const orgID = await this.getOrganizationID(id)
        if (orgID) {
          const data = { id: orgID, type: 'org' }
          this.$store.commit(`${MAP_FOCUS_ON}`, data)
          bus.$emit(`${FOCUS_ON}`, data)
        }
      }
    },
    async handleSubmarineCablesSelection(id) {
      if (!id) throw { message: 'MISSING ID PARAMETER'}
      const bounds = await this.getSubseaCableBoundsData(id)

      if (bounds) {
        await this.$store.commit(`${MAP_BOUNDS}`, bounds)
        bus.$emit(`${FOCUS_ON}`, { id, type: 'cable' })
      }
    }
  }
}
</script>
