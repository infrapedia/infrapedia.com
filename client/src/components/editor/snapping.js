import {
  point,
  polygonToLine,
  nearestPointOnLine,
  lineString
} from '@turf/turf'
import { fCollectionFormat } from '../../helpers/featureCollection'
import EventEmitter from '../../lib/EventEmitter'

export default class Snapping extends EventEmitter {
  constructor({ map, draw, pixel, snapLayers }) {
    super()
    this.status = true
    this.map = map
    this.draw = draw
    this.pixel = pixel
    this.snapLayers = snapLayers
    this.snapPoint = false
    this.feature = false
    this.init()
  }

  init() {
    this.map.on('click', 'snappoint', this.addSnapToDraw.bind(this))
    this.map.on('mousemove', this.mouseMove.bind(this))
    this.map.on('draw.update', this.addSnapToDraw.bind(this))
  }

  addSnapToDraw() {
    if (!this.snapPoint) return

    const drawMode = this.draw.getMode()
    if (drawMode == 'draw_line_string') {
      const line = [...this.draw.getAll().features][0]
      line.geometry.coordinates.pop()
      line.geometry.coordinates.pop()
      line.geometry.coordinates.push(this.snapPoint.geometry.coordinates)
      this.emit('confirm', [line])
    } else if (drawMode == 'direct_select') {
      const mypoint = this.draw.getSelectedPoints()
      const lines = this.draw.getSelected()

      if (mypoint.features.length > 0 && lines.features.length > 0) {
        const line = lines.features[0]
        const selectLat = mypoint.features[0].geometry.coordinates[1]
        const selectLng = mypoint.features[0].geometry.coordinates[0]
        const newcoords = line.geometry.coordinates.map(c =>
          selectLat == c[1] && selectLng == c[0]
            ? this.snapPoint.geometry.coordinates
            : c
        )

        const newLine = lineString(newcoords)
        newLine.id = line.id
        this.emit('confirm', [newLine])
      }
    }
  }

  getSnapPoint() {
    return Boolean(this.snapPoint)
  }

  mouseMove(e) {
    if (!this.status) {
      this.map.getSource('snappoint').setData(fCollectionFormat())
      return
    }

    const feature = this.getFeatures(e)
    if (feature !== false) {
      this.snapPoint = this.findSnapPoint(e, feature)
      if (this.snapPoint !== false) {
        this.map.getSource('snappoint').setData(this.snapPoint)
      } else {
        this.map.getSource('snappoint').setData(fCollectionFormat())
      }
    }
  }

  findSnapPoint(e, f) {
    const mousePoint = point([e.lngLat.lng, e.lngLat.lat])
    const type = f.geometry.type
    let vm = this

    if (type == 'Point') {
      const featureXY = this.map.project({
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1]
      })

      if (this.absPoint(e.point, featureXY)) {
        this.snapPoint = f
        this.snapPoint.properties.color = '#cddc39'
      } else {
        this.snapPoint = false
      }
      return this.snapPoint
    } else {
      const snapLine = type == 'Polygon' ? polygonToLine(f) : f
      const status = snapLine.geometry.coordinates.find(c => {
        let pointNow = vm.map.project({
          lng: c[0],
          lat: c[1]
        })

        if (vm.absPoint(e.point, pointNow)) return pointNow
      })

      if (status !== undefined) {
        this.snapPoint = point(status)
        this.snapPoint.properties.color = '#cddc39'
      } else {
        this.snapPoint = nearestPointOnLine(snapLine, mousePoint)
        this.snapPoint.properties.color = '#8bc34a'
      }
      return this.snapPoint
    }
  }

  absPoint(p1, p2) {
    const xAbs = Math.abs(p2.x - p1.x)
    const yAbs = Math.abs(p2.y - p1.y)
    return xAbs <= this.pixel && yAbs <= this.pixel ? true : false
  }

  getFeatures({ point: { x, y } }) {
    const bbox = [
      [x - this.pixel, y - this.pixel],
      [x + this.pixel, y + this.pixel]
    ]
    const features = this.map.queryRenderedFeatures(bbox, {
      layers: this.snapLayers
    })

    if (features.length > 0) {
      this.feature = features[0].toJSON()
    } else {
      this.feature = false
      this.snapPoint = false
      this.map.getSource('snappoint').setData(fCollectionFormat())
    }

    return this.feature
  }
}
