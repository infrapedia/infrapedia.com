import download from 'downloadjs'
import mapboxgl from 'mapbox-gl'

export default class PrintGL {
  constructor({ map }) {
    this.map = map
    this.loading = false
    this.mapContainerID = 'printMap'
    this.pixelRatio
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
    Object.defineProperty(window, 'devicePixelRatio', {
      get: function() {
        return dpi / 96
      }
    })

    var orjDpi = localStorage.getItem('dpi')
    orjDpi = parseInt(orjDpi, 10)
    const orjinalCanvas = this.map.getCanvas()
    const width = orjinalCanvas.width / orjDpi
    const height = orjinalCanvas.height / orjDpi

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

    const renderMap = new mapboxgl.Map({
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
    return renderMap
  }

  getPixelRatio(dpi) {
    return dpi / 96
  }

  getImage(url, callback) {
    var xhr = new XMLHttpRequest()
    xhr.onload = function() {
      var reader = new FileReader()
      reader.onloadend = function() {
        callback(reader.result)
      }
      reader.readAsDataURL(xhr.response)
    }
    xhr.open('GET', url)
    xhr.responseType = 'blob'
    xhr.send()
  }

  async downloadCanvas(canvas, name, dpi) {
    var that = this
    dpi = parseInt(dpi, 10)
    var mapcanvas = canvas.getCanvas()
    var urllogo = 'print_logo_' + dpi + 'dpi.png'
    var canvas2 = document.createElement('canvas')
    var w = mapcanvas.width
    var h = mapcanvas.height
    canvas2.width = w
    canvas2.height = h
    var ctx = canvas2.getContext('2d')
    var img = mapcanvas.toDataURL('image/png')
    //ctx.drawImage(img, 0,0);
    var mapimage = new Image()
    mapimage.onload = function() {
      ctx.drawImage(mapimage, 0, 0)
      that.getImage(urllogo, function(base64) {
        var image = new Image()
        image.onload = function() {
          var imgWidth = image.width
          var imgHeight = image.height
          var st = w - imgWidth - 10
          var sl = h - imgHeight - 10
          ctx.drawImage(image, st, sl, imgWidth, imgHeight)
          var exp = ctx.canvas.toDataURL('image/png')
          download(exp, name + '.png', 'image/png')
        }
        image.src = base64
      })
    }
    mapimage.src = img
    /*await canvas.getCanvas().toBlob(function(blob) {
      if (mapWrapper) mapWrapper.remove()
      download(blob, name + '.png', 'image/png')
    })*/
  }

  async printMap(dpi = 300, fileName = 'Infrapedia-Print-Map-') {
    this.loading = true
    const map = await this.createVirtualCanvas(parseInt(dpi, 10))
    let vm = this
    let once = 0

    map.on('idle', function() {
      setTimeout(() => {
        if (once == 0) {
          vm.downloadCanvas(map, fileName + vm.getDate(), dpi)
          vm.loading = false
          once += 1
        }
      }, 5000)
    })
  }
}
