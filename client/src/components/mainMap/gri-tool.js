import { fCollectionFormat } from '../../helpers/featureCollection'
import { mapConfig } from '../../config/mapConfig.js'
import {
  length,
  lineSlice,
  point,
  lineIntersect,
  round,
  lineString,
  nearestPointOnLine
} from '@turf/turf'

export function lastMileToolLayers(map) {
  const fc = fCollectionFormat()

  map.addSource('lines', {
    type: 'geojson',
    data: fc
  })

  map.addLayer({
    id: 'line',
    type: 'line',
    source: 'lines',
    paint: {
      'line-color': '#FF0000',
      'line-width': 2
    },
    filter: ['==', '$type', 'LineString']
  })

  map.addLayer({
    id: 'line-label',
    source: 'lines',
    name: 'Production Backbone',
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

  map.addSource('points', {
    type: 'geojson',
    data: fc
  })

  map.addLayer({
    id: 'point',
    type: 'circle',
    source: 'points',
    paint: {
      'circle-radius': 5,
      'circle-color': '#35af6d',
      'circle-stroke-width': 1,
      'circle-stroke-color': '#333333'
    },
    filter: ['==', '$type', 'Point']
  })

  //finish layer
  map.addSource('finishpoint', {
    type: 'geojson',
    data: fc
  })

  map.addLayer({
    id: 'finish',
    type: 'circle',
    source: 'finishpoint',
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
  }

  find(e) {
    this.latlng = [e.lat, e.lng]
    this.map.setCenter(e)
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
    var point = this.map.project(this.latlng)
    var x = point.x
    var y = point.y
    for (var i = 0; i < dist.length; i++) {
      var bbox = [
        [x - dist[i], y - dist[i]],
        [x + dist[i], y + dist[i]]
      ]

      var features = this.map.queryRenderedFeatures(bbox, {
        layers: [mapConfig.cables]
      })

      var water = this.map.queryRenderedFeatures(point, {
        layers: ['water']
      })

      if (water.length > 0) {
        f.target._listeners.idle = []
        // alert('You cant use this skill on the water')
        return false
      }

      features = features.filter(function(a) {
        console.log(a.properties)
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
      var lastFeatures = []
      features.map(function(feature) {
        var geojson2 = feature.toJSON()
        lastFeatures.push(geojson2)
      })
      if (lastFeatures.length > 0) {
        geojson.features = lastFeatures
      }

      var nearestPoints = []
      var pt = point([...this.latlng])
      if (geojson.features.length > 0) {
        geojson.features.map(function(feature) {
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
      if (sortList.length > this.limit) {
        sortList = sortList.splice(0, this.limit)
      }
      this.map.getSource('finishpoint').setData(sortList[0].point)
      if (sortList.length > 0) {
        var shortestGoogleLines = []

        // eslint-disable-next-line no-inner-declarations
        function findGooglePath(i) {
          if (i < sortList.length) {
            var pnt = sortList[i].point.geometry.coordinates
            this.calcRoute(this.latlng, pnt, function(way) {
              shortestGoogleLines.push(way)
              i++
              findGooglePath(i)
            })
          } else {
            var sortGoogleList = shortestGoogleLines.sort(
              (a, b) => a.properties.len - b.properties.len
            )
            var shortWay = this.findIntersects(sortGoogleList, geojson)
            this.map.getSource('lines').setData(shortWay.line)
            this.map.getSource('finishpoint').setData(shortWay.point)
          }
        }
        findGooglePath(0)
      }
    }
  }

  findIntersects(roads, cables) {
    const shortest = []
    const start = point(this.latlng)
    roads.forEach(function(road) {
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
    })
    const shortestList = shortest.sort((a, b) => a.len - b.len)
    return {
      line: shortestList[0].line,
      point: shortestList[0].lastpoint
    }
  }
  initGoogleServices() {
    const id = 'googlemap'
    if (!document.getElementById('googlemap')) {
      let div = document.createElement('div')
      div.id = id
      const app = document.querySelector('.application')
      app.appendChild(div)
    }
    // eslint-disable-next-line
    this.googlemap = new google.maps.Map(document.getElementById(id), {
      center: {
        lat: mapConfig.center[1],
        lng: mapConfig.center[0]
      },
      zoom: 8
    })
    // eslint-disable-next-line
    this.directionsService = new google.maps.DirectionsService()
  }
  calcRoute(start, finish, callback) {
    if (this.requestType == 'google') {
      let route = {}
      // eslint-disable-next-line
      const startPoint = new google.maps.LatLng(start[1], start[0])
      // eslint-disable-next-line
      const finishPoint = new google.maps.LatLng(finish[1], finish[0])
      const request = {
        origin: startPoint,
        destination: finishPoint,
        travelMode: 'WALKING'
      }

      this.directionsService.route(request, function(result, status) {
        if (status == 'OK') {
          var waypoints = result.routes[0].overview_path
          var waypointsArr = waypoints.map(pnt => [pnt.lng(), pnt.lat()])
          var distancetext = result.routes[0].legs[0].distance.text
          var distanceval = result.routes[0].legs[0].distance.value
          route = {
            type: 'Feature',
            properties: {
              distance: distancetext,
              len: distanceval
            },
            geometry: {
              type: 'LineString',
              coordinates: waypointsArr
            }
          }
          callback(route)
        } else {
          route = {
            type: 'Feature',
            properties: { distance: 0, len: 0 },
            geometry: {
              type: 'LineString',
              coordinates: [start, finish]
            }
          }
          var lenn = length(route, { units: 'meters' })
          lenn = round(lenn, 3)
          route.properties.len = lenn
          if (lenn >= 1000) {
            var lennkm = length(route, {
              units: 'kilometers'
            })
            lennkm = round(lennkm, 3)
            route.properties.distance = lennkm + 'km'
          } else {
            route.properties.distance = lenn + 'm'
          }
          callback(route)
        }
      })
    } else if (this.requestType == 'mapbox') {
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
        this.config.mapboxglAccessToken
      fetch(url)
        .then(res => res.json())
        .then(function(result) {
          callback(this.getMapboxRoad(result))
        })
    }
  }
  changeLimit(e) {
    this.limit = e.value
  }
  changeRequestType(e) {
    this.requestType = e.value
  }
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
  initService() {
    this.initGoogleServices()
  }
}
