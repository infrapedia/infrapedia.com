<template>
  <div class="el-input" :class="{ dark }">
    <input
      type="text"
      :id="id"
      v-model="search"
      :class="{ 'el-input--mini': size === 'mini' }"
      class="el-input__inner "
      @focus="geolocate"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    search: '',
    autocomplete: undefined
  }),
  props: {
    value: {
      type: String,
      default: () => ''
    },
    mode: {
      type: String,
      default: () => 'create'
    },
    id: {
      type: String,
      default: () => 'autocompleteGoogle'
    },
    size: {
      type: String,
      default: () => 'mini'
    }
  },
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  mounted() {
    this.initAutocomplete()
    if (this.mode !== 'create' && this.value) {
      this.search = this.value
    }
  },
  methods: {
    initAutocomplete() {
      // eslint-disable-next-line
      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(this.id),
        { types: ['geocode'] }
      )

      // Avoid paying for data that you don't need by restricting the set of
      // place fields that are returned to just the address components.
      autocomplete.setFields(['address_component'])

      // When the user selects an address from the drop-down, populate the
      // address fields in the form.
      autocomplete.addListener('place_changed', this.fillInAddress)
      this.autocomplete = autocomplete
    },
    fillInAddress() {
      if (this.autocomplete) {
        // Get the place details from the autocomplete object.
        return this.$emit('place-changed', {
          ...this.autocomplete.getPlace(),
          fullAddress: document.getElementById(this.id).value
        })
      }
    },
    geolocate() {
      if (navigator.geolocation) {
        const autocomplete = this.autocomplete
        navigator.geolocation.getCurrentPosition(function(position) {
          // eslint-disable-next-line
          const circle = new google.maps.Circle({
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            radius: position.coords.accuracy
          })
          autocomplete.setBounds(circle.getBounds())
        })
      }
    }
  }
}
</script>
