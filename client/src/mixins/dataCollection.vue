<script>
import { mapActions } from 'vuex'
import { TOGGLE_SIDEBAR, TOGGLE_LOADING } from '../store/actionTypes'

export default {
  methods: {
    ...mapActions({
      getCurrentSelectionData: 'map/getCurrentSelectionData'
    }),
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
