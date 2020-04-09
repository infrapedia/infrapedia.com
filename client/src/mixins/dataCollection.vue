<script>
import { mapActions } from 'vuex'
import { bus } from '../helpers/eventBus'
import { TOGGLE_SIDEBAR, TOGGLE_LOADING } from '../store/actionTypes'
import { FOCUS_ON } from '../events'
import { MAP_FOCUS_ON } from '../store/actionTypes/map'

export default {
  methods: {
    ...mapActions({
      getPremiumData: 'getPremiumData',
      getCableData: 'map/getCableData',
      getIxpsData: 'getIxpsData',
      getSubseaCableBoundsData: 'getSubseaCableBoundsData',
      getFacilityBoundsData: 'getFacilityBoundsData',
      getIxpsBoundsData: 'getIxpsBoundsData',
      getClsBoundsData: 'getClsBoundsData',
      getClustersPointsOrgsData: 'getClustersPointsOrgsData',
      getClustersPointsNetworksData: 'getClustersPointsNetworksData'
    }),
    async loadPremiumPartners() {
      return await this.getPremiumData()
    },
    async handleCableSelected({ _id, name }) {
      if (!_id) return

      await this.$store.commit(`${TOGGLE_LOADING}`, true)
      try {
        await this.getCableData({
          user_id: this.$auth.user.sub,
          _id
        }).then(() => {
          this.$store.commit(`${TOGGLE_SIDEBAR}`, true)
          this.$store.commit(`${MAP_FOCUS_ON}`, {
            name,
            id: _id,
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
      if (this.$auth.isAuthenticated) {
        switch (option.toLowerCase().trim()) {
          case 'ixps':
            await this.handleIxpsItemSelected({ id, type: option })
            break
          case 'facility':
            await this.handleFacilityItemSelected({ id, type: option })
            break
          case 'facilities':
            await this.handleFacilityItemSelected({ id, type: option })
            break
          case 'cls':
            await this.handleClsItemSelected({ id, type: option })
            break
          case 'networks':
            await this.handleNetworkItemSelected({ id, type: option })
            break
          case 'groups':
            await this.handleNetworkItemSelected({ id, type: 'networks' })
            break
          case 'cable':
            await this.handleSubmarineCableItemSelected(id)
            break
          case 'cables':
            await this.handleSubmarineCableItemSelected(id)
            break
          case 'subsea cables':
            await this.handleSubmarineCableItemSelected(id)
            break
          case 'terrestrial networks':
            await this.handleSubmarineCableItemSelected(id)
            break
          case 'terrestrial':
            await this.handleSubmarineCableItemSelected(id)
            break
          case 'organizations':
            await this.handleOrgItemSelected({ id, type: option })
            break
          case 'org':
            await this.handleOrgItemSelected({ id, type: option })
            break
          case 'owners':
            await this.handleOrgItemSelected({ id, type: option })
            break
          case 'partners':
            await this.handleOrgItemSelected({ id, type: option })
            break
        }
      } else await this.$auth.loginWithRedirect()
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
    async handleFacilityItemSelected({ id, type }) {
      if (!id) throw { message: 'MISSING ID PARAMETER' }

      // GETTING APPROPIATE MAP BOUNDS FOR ZOOM IN
      await this.getFacilityBoundsData({
        user_id: this.$auth.user.sub,
        _id: id
      })

      bus.$emit(`${FOCUS_ON}`, { id, type })
    },
    async handleIxpsItemSelected({ id, type }) {
      if (!id) throw { message: 'MISSING ID PARAMETER' }

      // GETTING APPROPIATE MAP BOUNDS FOR ZOOM IN
      await this.getIxpsBoundsData({
        user_id: this.$auth.user.sub,
        _id: id
      })

      bus.$emit(`${FOCUS_ON}`, { id, type })
    },
    async handleClsItemSelected({ id, type }) {
      if (!id) throw { message: 'MISSING ID PARAMETER' }

      // GETTING APPROPIATE MAP BOUNDS FOR ZOOM IN
      await this.getClsBoundsData({
        user_id: this.$auth.user.sub,
        _id: id
      })

      bus.$emit(`${FOCUS_ON}`, { id, type })
    },
    async handleNetworkItemSelected({ id, type }) {
      if (!id) throw { message: 'MISSING ID PARAMETER' }

      const res = await this.getClustersPointsNetworksData({
        user_id: this.$auth.user.sub,
        _id: id
      })
      return bus.$emit(`${FOCUS_ON}`, {
        id,
        type,
        fc:
          res.data.r && res.data.r.features && res.data.r.features.length
            ? res.data.r
            : false
      })
    },
    async handleOrgItemSelected({ id, type }) {
      if (!id) throw { message: 'MISSING ID PARAMETER' }

      const res = await this.getClustersPointsOrgsData({
        user_id: this.$auth.user.sub,
        _id: id
      })
      return bus.$emit(`${FOCUS_ON}`, {
        id,
        type,
        fc:
          res.data.r && res.data.r.features && res.data.r.features.length
            ? res.data.r
            : false
      })
    }
  }
}
</script>
