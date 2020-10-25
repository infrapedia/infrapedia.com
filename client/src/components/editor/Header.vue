<template>
  <header
    class="information-box z-index20 h4 relative flex align-items-center p4 text-left"
    :class="{ dark }"
  >
    <div
      :class="{ hidden: isSearchActive }"
      class="flex row nowrap align-items-center"
    >
      <span class="inline-block mr4 fs-small">
        Actions
      </span>
      <el-popover
        title="Instructions"
        placement="bottom"
        trigger="click"
        width="246"
        :popper-class="`${dark ? dark : ''} p4`"
      >
        <span class="fs-small">
          Geojson files dropped here, will be imported <br />
          into the map.
        </span>
        <el-divider class="mt2 mb2" />
        <div class="fs-small">
          <p class="m0" v-if="oneClickMessage.length == 1">
            {{ oneClickMessage[0] }}
          </p>
          <template v-else-if="oneClickMessage.length == 2">
            <p class="m0" v-html="oneClickMessage[0]" />
            <p class="m0 inline-block" v-html="oneClickMessage[1]" />
          </template>
          <p class="m0" v-if="type != 'facilities'">
            {{ doubleClickMessage[0] }}
          </p>
          <span class="inline-block ml1" v-else>
            {{ doubleClickMessage[0] }}
          </span>
        </div>
        <el-button
          circle
          size="mini"
          slot="reference"
          :class="{ dark }"
          icon="el-icon-info"
          title="Toggle information"
        />
      </el-popover>
    </div>
    <search-box
      @toggle-search="handleSearchToggle"
      @place-selected="$emit('place-selected', $event)"
    />
  </header>
</template>

<script>
export default {
  components: {
    SearchBox: () => import('./search')
  },
  data: () => ({
    isSearchActive: false
  }),
  props: {
    type: {
      type: String,
      validator: function(t) {
        return (
          [
            'cls',
            'map',
            'ixps',
            'subsea',
            'facilities',
            'terrestrial-network'
          ].indexOf(t) != -1
        )
      }
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    },
    oneClickMessage() {
      let msg = []
      switch (this.type) {
        case 'ixps':
          msg = [
            'Click once to edit the properties of the IXP or change its position'
          ]
          break
        case 'cls':
          msg = [
            'Click once to edit the properties of the CLS or change its position'
          ]
          break
        case 'facilities':
          msg = [
            '<strong>Points:</strong> Click once to edit the properties of the Facility or change its position',
            '<strong>Polygons:</strong> Click once to edit the properties of a segment.'
          ]
          break
        default:
          msg = ['Click once to edit the properties of a segment.']
          break
      }
      return msg
    },
    doubleClickMessage() {
      let msg = []
      switch (this.type) {
        case 'subsea':
          msg = ['Click twice to edit the shape of a segment.']
          break
        case 'terrestrial-network':
          msg = ['Click twice to edit the shape of a segment.']
          break
        default:
          msg = []
          break
      }
      return msg
    }
  },
  methods: {
    handleSearchToggle(bool) {
      this.isSearchActive = bool
      if (!bool) this.$emit('close-search')
    }
  }
}
</script>
