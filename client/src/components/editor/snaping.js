import {
  point,
  polygonToLine,
  nearestPointOnLine,
  lineString
} from '@turf/turf'

class Snaping {
  constructor({ map, draw, pixel, snapLayers, scene }) {
    this.status = true
    this.map = map
    this.draw = draw
    this.pixel = pixel
    this.scene = scene
    this.snapLayers = snapLayers
    this.snapPoint = false
    this.feature = false
    this.init()
  }
  init() {
    var vm = this

    this.map.on('mousemove', function(e) {
      if (vm.scene.creation || vm.scene.edition) {
        vm.mouseMove(e, vm)
      }
    })

    this.map.on('click', function(e) {
      vm.addSnapToDraw(e)
    })

    this.map.on('draw.update', function() {
      vm.addSnapToDraw()
    })
  }

  addSnapToDraw() {
    var that = this
    if (this.scene.creation || this.scene.edition) {
      if (this.snapPoint !== false) {
        var drawMode = this.draw.getMode()
        if (drawMode == 'draw_line_string' || drawMode == 'direct_select') {
          if (drawMode == 'draw_line_string') {
            var lines = this.draw.getAll()
            var line = lines.features[0]
            line.geometry.coordinates.pop()
            line.geometry.coordinates.pop()
            line.geometry.coordinates.push(this.snapPoint.geometry.coordinates)
            lines.features[0] = line
            this.draw.set(lines)
          }
          if (drawMode == 'direct_select') {
            debugger
            var mypoint = this.draw.getSelectedPoints()
            var lines1 = this.draw.getSelected()
            if (mypoint.features.length > 0 && lines1.features.length > 0) {
              var line1 = lines1.features[0]
              var id = line1.id
              var newcoords = []
              var selectLat = mypoint.features[0].geometry.coordinates[1]
              var selectLng = mypoint.features[0].geometry.coordinates[0]

              line1.geometry.coordinates.map(function(c) {
                if (selectLat == c[1] && selectLng == c[0]) {
                  newcoords.push(that.snapPoint.geometry.coordinates)
                } else {
                  newcoords.push(c)
                }
              })
              var newLine = lineString(newcoords)
              newLine.id = id
              var fcol = { type: 'FeatureCollection', features: [newLine] }
              this.draw.set(fcol)
            }
          }
        }
      }
    }
  }

  getSnapPoint() {
    if (this.status) {
      return this.snapPoint
    } else {
      return false
    }
  }
  mouseMove(e, vm) {
    if (vm.status) {
      var feature = this.getFeatures(e)
      if (feature !== false) {
        vm.snapPoint = vm.findSnapPoint(e, feature)
        if (vm.snapPoint !== false) {
          vm.map.getSource('snappoint').setData(vm.snapPoint)
        } else {
          vm.map
            .getSource('snappoint')
            .setData({ type: 'FeatureCollection', features: [] })
        }
      }
    }
    return { e: e, vm: vm, features: feature }
  }
  findSnapPoint(e, f) {
    var that = this
    var mousePoint = point([e.lngLat.lng, e.lngLat.lat])
    var type = f.geometry.type
    if (type == 'Point') {
      var featureXY = this.map.project({
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1]
      })
      var status = this.absPoint(e.point, featureXY)
      if (status) {
        this.snapPoint = f
        this.snapPoint.properties.color = '#cddc39'
      } else {
        this.snapPoint = false
      }
      return this.snapPoint
    } else {
      var snapLine = null
      if (type == 'Polygon') {
        snapLine = polygonToLine(f)
      } else {
        snapLine = f
      }
      var coords = snapLine.geometry.coordinates
      var status1 = coords.find(function(c) {
        var pointNow = that.map.project({
          lng: c[0],
          lat: c[1]
        })
        var isSnaped = that.absPoint(e.point, pointNow)
        if (isSnaped) {
          return pointNow
        }
      })
      if (status1 !== undefined) {
        this.snapPoint = point(status1)
        this.snapPoint.properties.color = '#cddc39'
      } else {
        this.snapPoint = nearestPointOnLine(snapLine, mousePoint)
        this.snapPoint.properties.color = '#8bc34a'
      }
      return this.snapPoint
    }
  }
  absPoint(p1, p2) {
    var xAbs = Math.abs(p2.x - p1.x)
    var yAbs = Math.abs(p2.y - p1.y)
    if (xAbs <= this.pixel && yAbs <= this.pixel) {
      return true
    } else {
      return false
    }
  }
  getFeatures(e) {
    var x = e.point.x
    var y = e.point.y

    var mybbox = [
      [x - this.pixel, y - this.pixel],
      [x + this.pixel, y + this.pixel]
    ]

    var features = this.map.queryRenderedFeatures(mybbox, {
      layers: this.snapLayers
    })
    if (features.length > 0) {
      this.feature = features[0].toJSON()
    } else {
      this.feature = false
      this.snapPoint = false
      this.map
        .getSource('snappoint')
        .setData({ type: 'FeatureCollection', features: [] })
    }

    return this.feature
  }
  setStatus(status) {
    this.status = status
  }
  setActive() {
    this.status = true
  }
  setPassive() {
    this.status = false
  }
}

export default Snaping
