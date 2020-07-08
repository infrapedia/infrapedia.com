import { fCollectionFormat } from '../../helpers/featureCollection'
import { mapConfig } from '../../config/mapConfig.js'
import {
  length,
  lineSlice,
  point,
  lineIntersect,
  round,
  lineString,
  nearestPointOnLine,
  circle,
  bbox,
  polygonToLine
} from '@turf/turf'
import $axios from '../../services/axios'

export function lastMileToolLayers(map) {
  const fc = fCollectionFormat()

  map.addSource('shortestroads', {
    type: 'geojson',
    data: fc
  })

  map.addLayer({
    id: 'shortestroad',
    type: 'line',
    source: 'shortestroads',
    paint: {
      'line-color': '#FF0000',
      'line-width': 2
    },
    filter: ['==', '$type', 'LineString']
  })

  map.addLayer({
    id: 'shortestroad-label',
    source: 'shortestroads',
    name: 'shortest road',
    type: 'symbol',
    layout: {
      'text-field': ['get', 'distance'],
      'symbol-placement': 'line',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 10,
      'text-justify': 'right',
      'text-anchor': 'bottom',
      'text-offset': [0, 0.1]
    },
    paint: {
      'text-color': '#485E69'
    }
  })

  map.addSource('startpoints', {
    type: 'geojson',
    data: fc
  })

  map.addLayer({
    id: 'startpoint',
    type: 'circle',
    source: 'startpoints',
    paint: {
      'circle-radius': 5,
      'circle-color': '#35af6d',
      'circle-stroke-width': 1,
      'circle-stroke-color': '#333333'
    },
    filter: ['==', '$type', 'Point']
  })

  //finish layer
  map.addSource('finishpoints', {
    type: 'geojson',
    data: fc
  })

  map.addLayer({
    id: 'finishpoint',
    type: 'circle',
    source: 'finishpoints',
    paint: {
      'circle-radius': 5,
      'circle-color': '#FF00C4',
      'circle-stroke-width': 1,
      'circle-stroke-color': '#333333'
    },
    filter: ['==', '$type', 'Point']
  })
  return map
}

export default class lastMileTool {
  constructor({ map }) {
    this.limit = 1
    this.map = map
    this.latlng = null
    this.googlemap = null
    this.requestType = 'mapbox'
    this.directionsService = null
    this.networks = []
    this.networkname = ''
    this.len = ''
  }

  find(e) {
    this.latlng = [e.lng, e.lat]
    this.map.setCenter(e)
    var pnt = point(this.latlng)
    this.map.getSource('startpoints').setData(pnt)
  }

  registerEvents() {
    const vm = this
    this.map.on('idle', function(f) {
      vm.handleIdle(f)
    })
  }

  handleIdle(f) {
    if (!this.latlng) return
    var dist = [500, 750, 1000, 1500, 2000, 2500, 3000]
    var mypoint = this.map.project(this.latlng)
    var x = mypoint.x
    var y = mypoint.y
    for (var i = 0; i < dist.length; i++) {
      var mybbox = [
        [x - dist[i], y - dist[i]],
        [x + dist[i], y + dist[i]]
      ]

      var features = this.map.queryRenderedFeatures(mybbox, {
        layers: [mapConfig.cables]
      })

      var water = this.map.queryRenderedFeatures(mypoint, {
        layers: ['water']
      })

      if (water.length > 0) {
        f.target._listeners.idle = []
        alert('You cant use this skill on the water')
        return false
      }

      features = features.filter(function(a) {
        if (a.properties.terrestrial == 'true') {
          return true
        }
      })

      if (features.length > 0) {
        break
      }
    }

    if (features.length == 0) {
      var zoom = this.map.getZoom()
      this.map.setZoom(zoom - 1)
    } else {
      f.target._listeners.idle = []
      var geojson = { type: 'FeatureCollection', features: [] }
      var lastFeatures = features.map(feature => feature.toJSON())
      if (lastFeatures.length > 0) {
        geojson.features = lastFeatures
      }

      var nearestPoints = []
      var pt = point(this.latlng)
      if (geojson.features.length > 0) {
        geojson.features.forEach(function(feature) {
          var snapped = nearestPointOnLine(feature, pt, {
            units: 'kilometers'
          })
          nearestPoints.push({
            feature: feature,
            distance: snapped.properties.dist,
            point: snapped
          })
        })
      }
      var sortList = nearestPoints.sort((a, b) => a.distance - b.distance)
      var resultinfo = {
        networkName: sortList[0].feature.properties.name,
        len: 0,
        networks: []
      }
      if (sortList.length > this.limit) {
        sortList = sortList.splice(0, this.limit)
      }
      this.map.getSource('finishpoints').setData(sortList[0].point)
      if (sortList.length > 0) {
        var shortestGoogleLines = []

        // eslint-disable-next-line no-inner-declarations
        function findGooglePath(i, that) {
          if (i < sortList.length) {
            var pnt = sortList[i].point.geometry.coordinates
            that.calcRoute(that.latlng, pnt, function(way) {
              shortestGoogleLines.push(way)
              i++
              findGooglePath(i, that)
            })
          } else {
            var sortGoogleList = shortestGoogleLines.sort(
              (a, b) => a.properties.len - b.properties.len
            )

            var shortWay = that.findIntersects(sortGoogleList, geojson)
            that.map.getSource('shortestroads').setData(shortWay.line)
            that.map.getSource('finishpoints').setData(shortWay.point)
            var resultNear = that.findNearNetworks(
              shortWay.point.geometry.coordinates
            )
            resultinfo.networks = resultNear.networks
            that.networks = resultNear.networks
            that.networkName = resultinfo.networkName
            that.len = length(sortGoogleList[0], { units: 'meters' })

            if (that.len < 1000) {
              that.len = round(that.len, 3) + ' m'
            } else {
              that.len = length(sortGoogleList[0], { units: 'kilometers' })
              that.len = round(that.len, 3) + ' km'
            }
          }
        }

        findGooglePath(0, this)
      }
    }
  }

  findIntersects(roads, cables) {
    const shortest = []
    const start = point(this.latlng)

    for (let road of roads) {
      var last = point(
        road.geometry.coordinates[road.geometry.coordinates.length - 1]
      )

      cables.features.forEach(function(cable) {
        var intersects = lineIntersect(cable, road)
        let featLength
        if (intersects.features.length > 0) {
          for (let stop of intersects.features) {
            let sliced = lineSlice(start, stop, road)
            featLength = length(sliced, { units: 'meters' })
            shortest.push({
              lastpoint: stop,
              len: featLength,
              line: sliced
            })
          }
        } else {
          featLength = length(road, { units: 'meters' })
          shortest.push({
            lastpoint: last,
            len: length,
            line: road
          })
        }
      })
    }
    const shortestList = shortest.sort((a, b) => a.len - b.len)
    return {
      line: shortestList[0].line,
      point: shortestList[0].lastpoint
    }
  }
  findNearNetworks(point) {
    const radius = 20
    const options = {
      steps: 36,
      units: 'meters',
      properties: { name: 'bufferarea' }
    }
    var mycircle = circle(point, radius, options)
    var sline = polygonToLine(mycircle)
    var mybbox = bbox(mycircle)
    var p1 = [mybbox[0], mybbox[1]]
    var p2 = [mybbox[2], mybbox[3]]
    var mypoint1 = this.map.project(p1)
    var mypoint2 = this.map.project(p2)
    const pixelbbox = [
      [mypoint1.x, mypoint1.y],
      [mypoint2.x, mypoint2.y]
    ]
    const features = this.map.queryRenderedFeatures(pixelbbox, {
      layers: [mapConfig.cables]
    })
    const result = features.map(a => a.toJSON().properties.name)
    return { networks: result, circle: sline }
  }
  async calcRoute(start, finish, callback) {
    const url =
      'https://api.mapbox.com/directions/v5/mapbox/walking/' +
      start[0] +
      ',' +
      start[1] +
      ';' +
      finish[0] +
      ',' +
      finish[1] +
      '.json?geometries=polyline&steps=true&overview=full&language=en&access_token=' +
      mapConfig.mapToken

    const vm = this
    try {
      const res = await $axios.get(url)
      callback(vm.getMapboxRoad(res))
    } catch (err) {
      console.error(err)
    }
  }
  changeLimit(e) {
    this.limit = e.value
  }
  // changeRequestType(e) {
  //   this.requestType = e.value
  // }
  getMapboxRoad(data) {
    const routes = data.routes[0]
    const distance = round(routes.distance, 3)
    const ll = this.googlePointDecode(routes.geometry)
    const line = lineString(ll, {
      distance: distance,
      len: distance
    })
    return line
  }
  googlePointDecode(encoded) {
    var points = []
    var index = 0,
      len = encoded.length
    var lat = 0,
      lng = 0
    while (index < len) {
      var b,
        shift = 0,
        result = 0
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63 //finds ascii                                                                                    //and substract it by 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)

      var dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1
      lat += dlat
      shift = 0
      result = 0
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      var dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1
      lng += dlng

      points.push({ lat: lat / 1e5, lng: lng / 1e5 })
    }
    var pointArray = []
    points.map(function(a) {
      var lat = a.lat
      var lng = a.lng
      pointArray.push([lng, lat])
    })
    return pointArray
  }
}
