import {
  point,
  polygonToLine,
  nearestPointOnLine,
  lineString
} from '@turf/turf'
import { fCollectionFormat } from '../../helpers/featureCollection'
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
    this.map.on('click', this.addSnapToDraw)
    this.map.on('mousemove', this.mouseMove)
    this.map.on('draw.update', this.addSnapToDraw)
  }

  addSnapToDraw() {
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
          const mypoint = this.draw.getSelectedPoints()
          const lines = this.draw.getSelected()
          if (mypoint.features.length > 0 && lines.features.length > 0) {
            const line = lines.features[0]
            const selectLat = mypoint.features[0].geometry.coordinates[1]
            const selectLng = mypoint.features[0].geometry.coordinates[0]
            const newcoords = line.geometry.coordinates.map(c => {
              if (selectLat == c[1] && selectLng == c[0]) {
                return this.snapPoint.geometry.coordinates
              } else return c
            })

            const newLine = lineString(newcoords)
            newLine.id = line.id
            this.draw.set(fCollectionFormat([newLine]))
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
  mouseMove(e) {
    if (this.status) {
      var feature = this.getFeatures(e)
      if (feature !== false) {
        this.snapPoint = this.findSnapPoint(e, feature)
        if (this.snapPoint !== false) {
          this.map.getSource('snappoint').setData(this.snapPoint)
        } else {
          this.map
            .getSource('snappoint')
            .setData({ type: 'FeatureCollection', features: [] })
        }
      }
    }
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
