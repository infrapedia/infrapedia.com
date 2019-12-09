const token = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN

const cableLayer = 'cables'
const cableLabelLayer = 'cable-label'
const highlightLayer = 'cables2'
const pointsLayer = 'pointTMS'
const source = 'network-atlas'
const highlightSource = `${source}-highlight`
const sourceLayer = 'fullnetworkV30'
const buildingFootprints = 'buildingFootprints'
const buildingLabels = 'buildingLabels'
const buildingPoints = 'buildingPoints'
const buildingFootprintLight = `light${buildingFootprints}`
const buildingPointLight = `light${buildingPoints}`
const buildingLabelLight = `light${buildingLabels}`
const buildingFootprintDark = `dark${buildingFootprints}`
const buildingPointDark = `dark${buildingPoints}`
const buildingLabelDark = `dark${buildingLabels}`
const clusterPts = 'facPoints'
const currentEpoch = Math.round(new Date().getTime() / 1000)

export const mapConfig = {
  mapToken: token,
  default: 'mapbox://styles/networkatlas/cjt4y5k77443z1fmfu2pfbcuu',
  // default: 'mapbox://styles/mapbox/light-v10',
  darkBasemap: 'mapbox://styles/mapbox/dark-v10',
  zoom: 1.75,
  dark: false,
  maptiks_id: 'Infrapedia',
  center: [-34.292, 27.57],
  cableLayer,
  pointsLayer,
  cableLabelLayer,
  highlightLayer,
  buildingFootprintLight,
  buildingPointLight,
  buildingLabelLight,
  buildingFootprintDark,
  buildingPointDark,
  buildingLabelDark,
  clusterPts,
  data: {
    source,
    source2: 'cableTMS',
    highlightSource,
    sourceLayer,
    url: 'mapbox://networkatlas.ay1i6jsf',
    buildingPointUrl: `${process.env.VUE_APP_BASE_API}/facility/geojson/points`,
    buildingPolyUrl: `${process.env.VUE_APP_BASE_API}/facility/geojson/polygons`,
    buildingLabelsUrl: `${process.env.VUE_APP_BASE_API}/facility/geojson/labels`,
    layers: [
      {
        id: cableLayer,
        source: 'cableTMS',
        'source-layer': 'cables',
        type: 'line',
        paint: {
          'line-width': 1.5,
          'line-color': [
            'case',
            ['==', ['get', 'status'], 0],
            '#FF0000',
            ['>', ['get', 'activation'], 1558130779],
            '#af6ec7',
            ['==', ['get', 'hasoutage'], 'true'],
            '#7288b0',
            ['==', ['get', 'haspartial'], 'true'],
            '#CC591F',
            ['==', ['get', 'isterrestr'], 'true'],
            '#7288b0',
            '#7288b0'
          ]
        }
      },
      {
        id: cableLabelLayer,
        source: 'cableTMS',
        'source-layer': 'cables',
        type: 'symbol',
        layout: {
          'text-field': '{name}',
          'symbol-placement': 'line',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 10,
          'text-justify': 'right',
          'text-anchor': 'bottom',
          'text-offset': [0, -0.1]
        },
        paint: {
          'text-color': '#485E69'
        }
      },
      {
        id: highlightLayer,
        type: 'line',
        source: 'cableTMS',
        'source-layer': 'cables',
        layout: {},
        paint: {
          'line-width': 3,
          'line-color': '#F7D079'
        },
        filter: ['==', ['get', 'cable_id'], false]
      },
      {
        id: clusterPts,
        source: clusterPts,
        type: 'circle',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#FF3860',
          'circle-radius': ['step', ['get', 'point_count'], 15, 2, 22, 4, 30]
        }
      },
      {
        id: 'cluster-count',
        type: 'symbol',
        source: clusterPts,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      },
      {
        id: 'unclustered-point',
        type: 'circle',
        source: clusterPts,
        maxzoom: 15,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#FF3860',
          'circle-radius': 10
        }
      },
      {
        id: 'pointTMS',
        type: 'circle',
        source: 'pointTMS',
        'source-layer': 'all_point',
        paint: {
          'circle-radius': 3,
          'circle-color': '#FFFFFF',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#333333'
        }
      },
      {
        id: 'pointTMS-label',
        type: 'symbol',
        source: 'pointTMS',
        'source-layer': 'all_point',
        layout: {
          'text-field': '{name}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 11,
          'text-anchor': 'bottom',
          'text-offset': [0, -0.3]
        },
        paint: {
          'text-color': '#485E69'
        }
      },
      // {
      //   id: 'cableTMS',
      //   type: 'line',
      //   source: 'cableTMS',
      //   'source-layer': 'all_cable',
      //   paint: {
      //     'line-width': 1.5,
      //     'line-color': [
      //       'case',
      //       ['>', ['get', 'activation'], 1558130779],
      //       '#af6ec7',
      //       ['==', ['get', 'hasoutage'], 'true'],
      //       '#D11539',
      //       ['==', ['get', 'haspartial'], 'true'],
      //       '#CC591F',
      //       ['==', ['get', 'isterrestr'], 'true'],
      //       '#7288b0',
      //       '#7288b0'
      //     ]
      //   }
      // },
      {
        id: 'buildingLayers',
        light: [
          {
            id: buildingPointLight,
            type: 'circle',
            source: buildingPointLight,
            minzoom: 12,
            layout: {},
            paint: {
              'circle-color': '#666666',
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1.75,
                5,
                6
              ],
              'circle-stroke-color': '#ffffff'
            }
          },
          {
            id: buildingFootprintLight,
            type: 'fill-extrusion',
            source: buildingFootprintLight,
            minzoom: 14,
            layout: {},
            paint: {
              'fill-extrusion-color': '#666666',
              'fill-extrusion-height': ['/', ['get', 'height'], 1.25]
            }
          },
          {
            id: buildingLabelLight,
            type: 'symbol',
            source: buildingLabelLight,
            minzoom: 12,
            layout: {
              'text-field': ['to-string', ['get', 'address']],
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
              'text-size': 13,
              'text-anchor': 'bottom',
              'text-offset': [0, -1]
            },
            paint: {
              'text-color': '#666666',
              'text-halo-color': '#ffffff',
              'text-halo-width': 0.75
            }
          }
        ],
        dark: [
          {
            id: buildingPointDark,
            type: 'circle',
            source: buildingPointDark,
            minzoom: 12,
            layout: {},
            paint: {
              'circle-color': '#bfbfbf',
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1.75,
                5,
                6
              ],
              'circle-stroke-color': '#ffffff'
            }
          },
          {
            id: buildingFootprintDark,
            type: 'fill-extrusion',
            source: buildingFootprintDark,
            minzoom: 14,
            layout: {},
            paint: {
              'fill-extrusion-height': ['/', ['get', 'height'], 1.25],
              'fill-extrusion-color': '#6989af'
            }
          },
          {
            id: buildingLabelDark,
            type: 'symbol',
            source: buildingLabelDark,
            minzoom: 12,
            layout: {
              'text-field': ['to-string', ['get', 'address']],
              'text-size': 13,
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
              'text-anchor': 'bottom',
              'text-offset': [0, -1]
            },
            paint: {
              'text-color': '#fff',
              'text-halo-color': '#545e66',
              'text-halo-width': 0.75,
              'text-translate': [0, 0]
            }
          }
        ]
      }
    ]
  },
  filter: {
    subsea: ['!=', ['get', 'isterrestrial'], 'true'],
    activeSubsea: [
      'all',
      ['!=', 'isterrestrial', 'true'],
      ['!=', 'isinactive', 'true']
    ],
    active: ['!=', ['get', 'isinactive'], 'true'],
    all: ['has', 'cable_id'],
    future: ['>', ['get', 'activation'], currentEpoch],
    timemachine: ['>=', ['get', 'eosepoch'], 0] // We change the 0 value when using the filter component inside the navbar for the sub-sea time machine
  }
}
