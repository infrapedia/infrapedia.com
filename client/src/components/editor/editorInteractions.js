class editorInteractions {
  constructor({ $dispatch, map, scene }) {
    this.map = map
    this.scene = scene
    this.$dispatch = $dispatch
    this.methods = this.methods()
  }
  methods() {
    return {
      handlePopUpShow: this.handlePopUpShow
    }
  }
  handlePopUpShow(e) {
    if (!e.features || !e.features.length) return

    const mapboxgl = require('mapbox-gl')
    var coordinates = e.features[0].geometry.coordinates.slice()
    var description = e.features[0].properties.description
    let popup = new mapboxgl.Popup()

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
    }

    popup
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(this.map)
  }
}

export default editorInteractions
