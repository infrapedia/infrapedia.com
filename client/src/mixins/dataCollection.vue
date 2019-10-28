<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions({
      getCurrentSelectionData: 'map/getCurrentSelectionData'
    }),
    async handleCableSelected({ cable_id }) {
      if (!cable_id) return
      await this.getCurrentSelectionData(cable_id)
    }
  },
}
</script>
