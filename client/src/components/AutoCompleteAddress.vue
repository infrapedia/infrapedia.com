<template>
  <div class="w-fit-full" role="search">
    <input
      type="text"
      id="autocomplete-address"
      :placeholder="place"
      class="el-input__inner"
      :class="{ dark }"
      v-model="search"
      @focus="autocomplete.geolocate()"
    />
    <ul class="p0 m0 h-fit-full absolute" role="group" v-if="results.length">
      <li
        class="inline-block relative"
        role="listitem"
        v-for="(r, i) in results"
        :key="i"
      >
        {{ r }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AutoCompleteAddress',
  data: () => ({
    autocomplete: undefined,
    results: [],
    place: '',
    selected: '',
    search: ''
  }),
  computed: {
    dark() {
      return this.$store.state.isDark
    }
  },
  mounted() {
    this.initSearch()
  },
  methods: {
    initSearch() {
      // eslint-disable-next-line
      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete-address'),
        { types: ['geocode'] }
      )

      console.log(autocomplete)

      autocomplete.setFields(['address_component'])
      autocomplete.addListener('place_changed', this.getAddress)
      this.autocomplete = autocomplete
    },
    geolocate() {
      if (!navigator.geolocation) return
      const vm = this

      navigator.geolocation.getCurrentPosition(function(position) {
        const geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        // eslint-disable-next-line
        const circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        })
        vm.autocomplete.setBounds(circle.getBounds())
      })
    },
    getAddress(res) {
      if (Object.keys(res.place).length > 0) {
        console.log(res)
        this.place = res.place
        this.results = res.response
      }
    },
    handleOptionSelected(selection) {
      return this.$emit('address-selected', selection)
    },
    clearSearch() {
      this.results = []
    }
  }
}
</script>
