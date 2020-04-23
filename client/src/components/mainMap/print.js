import download from 'downloadjs'
import mapboxgl from 'mapbox-gl'

export default class PrintGL {
  constructor({ map }) {
    this.map = map
    this.loading = false
    this.mapContainerID = 'printMap'
  }

  getDate() {
    const date = new Date() //date
    let day = date.getDate() //day
    if (day < 10) {
      day = '0' + day
    }
    let month = date.getMonth() + 1 //month
    if (month < 10) {
      month = '0' + month
    }
    const year = date.getFullYear() //year

    let hours = date.getHours() //hours
    if (hours < 10) {
      hours = '0' + hours
    }
    let min = date.getMinutes() //min
    if (min < 10) {
      min = '0' + min
    }
    let sec = date.getSeconds() //sec
    if (sec < 10) {
      sec = '0' + sec
    }
    const fulldate =
      day + '.' + month + '.' + year + ' ' + hours + ':' + min + ':' + sec
    return fulldate
  }

  getLoading() {
    return this.loading
  }

  async createVirtualCanvas(dpi) {
    const originalCanvas = this.map.getCanvas()
    const width = originalCanvas.width / this.getPixelRatio(dpi)
    const height = originalCanvas.height / this.getPixelRatio(dpi)

    const hiddenMapWrapper = document.createElement('div')
    hiddenMapWrapper.id = this.mapContainerID
    hiddenMapWrapper.style.visibility = 'hidden'
    document.body.appendChild(hiddenMapWrapper)
    const container = document.createElement('div')
    container.style.width = width + 'px'
    container.style.height = height + 'px'
    container.style.position = 'absolute'
    hiddenMapWrapper.appendChild(container)

    const zoom = this.map.getZoom()
    const center = this.map.getCenter()
    const bearing = this.map.getBearing()
    const pitch = this.map.getPitch()
    const style = this.map.getStyle()

    const map = new mapboxgl.Map({
      container: container,
      center: center,
      zoom: zoom,
      style: style,
      bearing: bearing,
      pitch: pitch,
      interactive: false,
      preserveDrawingBuffer: true,
      fadeDuration: 0,
      attributionControl: false
    })
    return map
  }

  getPixelRatio(dpi) {
    return dpi / 96
  }

  async downloadCanvas(canvas, name) {
    const mapWrapper = document.getElementById(this.mapContainerID)
    await canvas.getCanvas().toBlob(function(blob) {
      if (mapWrapper) mapWrapper.remove()
      download(blob, name + '.png', 'image/png')
    })
  }

  async printMap(dpi = 300, fileName = 'Infrapedia-Print-Map-') {
    this.loading = true
    const map = await this.createVirtualCanvas(parseInt(dpi, 10))
    let vm = this
    let once = 0

    map.on('idle', function() {
      setTimeout(() => {
        if (once == 0) {
          vm.downloadCanvas(map, fileName + vm.getDate())
          vm.loading = false
          once += 1
        }
      }, 5000)
    })
  }
}
