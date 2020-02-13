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
import { MAP_FOCUS_ON, MAP_POINTS } from '../store/actionTypes/map'

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
      getSubseaCableBoundsData: 'getSubseaCableBoundsData',
      getFacilityBoundsData: 'getFacilityBoundsData',
      getFacilityPointsData: 'getFacilityPointsData'
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
    async loadPremiumPartners() {
      return await this.getPremiumData()
    },
    async handleSubmarineSelection(opensMenu = true) {
      if (opensMenu) {
        await this.$store.commit(`${TOGGLE_LOADING}`, true)
        // I'm assuming that's opening the menu for the first time
        // Resetting quantity of items to load
        this.quantity = 20
        await this.toggleMenu('submarine')
      }
      await this.getSubseaData(this.quantity).then(() => {
        this.$store.commit(`${TOGGLE_LOADING}`, false)
      })
    },
    async handleDataCenterSelection(opensMenu = true) {
      if (opensMenu) {
        await this.$store.commit(`${TOGGLE_LOADING}`, true)
        // I'm assuming that's opening the menu for the first time
        // Resetting quantity of items to load
        this.quantity = 20
        await this.toggleMenu('dataCenters')
      }
      await this.getDataCentersData(this.quantity).then(() => {
        this.$store.commit(`${TOGGLE_LOADING}`, false)
      })
    },
    async handleIxpsSelection(opensMenu = true) {
      if (opensMenu) {
        await this.$store.commit(`${TOGGLE_LOADING}`, true)
        // I'm assuming that's opening the menu for the first time
        // Resetting quantity of items to load
        this.quantity = 20
        await this.toggleMenu('ixps')
      }
      await this.getIxpsData(this.quantity).then(() => {
        this.$store.commit(`${TOGGLE_LOADING}`, false)
      })
    },
    async handleNetworksSelection(opensMenu = true) {
      if (opensMenu) {
        await this.$store.commit(`${TOGGLE_LOADING}`, true)
        // I'm assuming that's opening the menu for the first time
        // Resetting quantity of items to load
        this.quantity = 20
        await this.toggleMenu('networks')
      }
      await this.getNetworksData(this.quantity).then(() => {
        this.$store.commit(`${TOGGLE_LOADING}`, false)
      })
    },
    async handleLoadMoreItems(option) {
      this.quantity += 50
      switch (option.toLowerCase()) {
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
      try {
        await this.getCurrentSelectionData({
          user_id: this.$auth.user.sub,
          _id: cable_id
        }).then(() => {
          this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
          this.$store.commit(`${MAP_FOCUS_ON}`, {
            name,
            id: cable_id,
            type: 'cable'
          })
        })
      } catch {
        // Ignore
      } finally {
        this.$store.commit(`${TOGGLE_LOADING}`, false)
      }
    },
    async handleItemListSelection({ option, id }) {
      // console.log(option, id)
      if (!id) throw { message: 'MISSING ID PARAMETER' }

      switch (option.toLowerCase()) {
        case 'partners':
          await this.handlePremiumPartnerItemSelected(id)
          break
        case 'submarine':
          await this.handleSubmarineCableItemSelected(id)
          break
        case 'ixps':
          await this.handleFacilityItemSelected({ id, type: 'ix' })
          break
        case 'datacenters':
          await this.handleDataCenterItemSelected({ id, type: option })
          break
        case 'data centers':
          await this.handleDataCenterItemSelected({ id, type: option })
          break
        case 'facility':
          await this.handleDataCenterItemSelected({ id, type: option })
          break
        case 'cls':
          await this.handleDataCenterItemSelected({ id, type: option })
          break
        case 'fac':
          await this.handleDataCenterItemSelected({ id, type: option })
          break
        case 'ixp':
          await this.handleFacilityItemSelected({ id, type: 'ix' })
          break
        case 'networks':
          await this.handleNetworkItemSelected(id)
          break
        case 'network':
          await this.handleNetworkItemSelected(id)
          break
        case 'net':
          await this.handleNetworkItemSelected(id)
          break
        case 'cable':
          await this.handleSubmarineCableItemSelected(id)
          break
        case 'cables':
          await this.handleSubmarineCableItemSelected(id)
          break
        case 'organizations':
          await this.handleOrgItemSelected(id)
          break
        case 'orgs':
          await this.handleOrgItemSelected(id)
          break
      }
    },
    async handlePremiumPartnerItemSelected(id) {
      if (!id) throw { message: 'MISSING ID PARAMETER' }

      // SAVING BOUNDS FOR MAP ZOOM IN
      await this.getPremiumSelectedBoundsData(id)
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
      if (!orgID) return
      else bus.$emit(`${FOCUS_ON}`, { id: orgID, type: 'org' })
    },
    async handleSubmarineCableItemSelected(id) {
      if (!id)
        throw {
          message:
            'MISSING ID PARAMETER, handleSubmarineCableItemSelected() - dataCollection.vue: line 203'
        }

      // GETTING APPROPIATE MAP BOUNDS FOR ZOOM IN
      await this.getSubseaCableBoundsData({
        user_id: this.$auth.user.sub,
        _id: id
      })
      bus.$emit(`${FOCUS_ON}`, { id, type: 'cable' })
    },
    async handleDataCenterItemSelected({ id, type }) {
      if (!id) throw { message: 'MISSING ID PARAMETER' }

      // GETTING APPROPIATE MAP BOUNDS FOR ZOOM IN
      await this.getFacilityBoundsData({
        user_id: this.$auth.user.sub,
        _id: id
      })

      bus.$emit(`${FOCUS_ON}`, { id, type })
    },
    handleNetworkItemSelected(id) {
      if (!id) throw { message: 'MISSING ID PARAMETER' }
      return bus.$emit(`${FOCUS_ON}`, { id, type: 'network' })
    },
    handleOrgItemSelected(id) {
      if (!id) throw { message: 'MISSING ID PARAMETER' }
      return bus.$emit(`${FOCUS_ON}`, { id, type: 'organizations' })
    },
    async handleFacilityItemSelected({ id, type }) {
      if (!id) throw { message: 'MISSING ID PARAMETER' }

      // RETRIEVING AND SAVING POINTS TO THE STORE
      await this.getFacilityPointsData({ id, type })
      bus.$emit(`${FOCUS_ON}`, { id, type })
    }
  }
}
</script>
