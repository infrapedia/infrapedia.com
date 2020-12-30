import { DateTime } from 'luxon'

const token = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN

const cablesLabel = 'cables_label'
const highlightFeatureState = [
  'case',
  ['==', ['get', '_id'], 0],
  '#F7D079',
  'rgba(23,23,23, 0.2)'
]

const ixpsPaintConfig = {
  'circle-radius': 10,
  'circle-stroke-width': 2,
  'circle-color': '#FA7200',
  'circle-stroke-color': '#FA7200'
}

const clsPaintConfig = {
  'circle-radius': 3.4,
  'circle-color': '#ffffff',
  'circle-stroke-width': 2,
  'circle-stroke-color': '#333333'
}

const facsPointPaintConfig = {
  'circle-radius': 10,
  'circle-stroke-width': 2,
  'circle-color': '#2196f3',
  'circle-stroke-color': '#2196f3'
}

const snapPaintConfig = {
  'circle-radius': 3.4,
  'circle-color': '#FF0000',
  'circle-stroke-width': 2,
  'circle-stroke-color': '#333333'
}

const facsPaintConfig = {
  'fill-extrusion-color': [
    'case',
    ['==', ['get', 'premium'], true],
    '#ff9800',
    ['==', ['get', 'premium'], false],
    '#666666',
    '#666666'
  ],
  'fill-extrusion-height': [
    'interpolate',
    ['linear'],
    ['zoom'],
    15,
    0,
    15.05,
    ['get', 'height']
  ],
  'fill-extrusion-base': [
    'interpolate',
    ['linear'],
    ['zoom'],
    15,
    0,
    15.05,
    ['get', 'min_height']
  ],
  'fill-extrusion-opacity': 1
}

function getDate() {
  return new Date()
}

const activationDateTime =
  DateTime.fromMillis(getDate().getTime())
    .plus({
      years: 25
    })
    .toMillis() / 1000

const cablesPaintConfig = {
  'line-width': 1.62,
  'line-color': [
    'case',
    ['==', ['get', 'haspartial'], 'true'],
    '#CC591F',
    ['==', ['get', 'hasoutage'], 'true'],
    '#FF0000',
    ['==', ['get', 'category'], 'project'],
    '#af6ec7',
    ['==', ['get', 'category'], 'decommissioned'],
    '#BFADA3',
    ['==', ['get', 'active'], 0],
    '#af6ec7',
    ['>', ['get', 'eol'], activationDateTime],
    '#af6ec7',
    ['==', ['get', 'terrestrial'], 'true'],
    '#7288b0',
    '#7288b0'
  ]
}

const facsMinZoom = 10.89
const cables = 'cables'
const cls = 'cls'
const ixps = 'ixps'
const clusters = 'clusters'
const facilities = 'facilities'
const facilitiesCount = 'facilities-count'
const facilitiesSinglePoints = 'facilities-single-points'
const facilitiesClusters = 'facilities_clusters'
const facilitiesLabel = 'facilities_label'
const currentEpoch = Math.round(new Date().getTime() / 1000)
const facilitiesPoints = 'facilities-points'

export const mapConfig = {
  mapToken: token,
  default:
    'mapbox://styles/networkatlas/cjt4y5k77443z1fmfu2pfbcuu?optimize=true',
  darkBasemap: 'mapbox://styles/mapbox/dark-v10',
  zoom: 1.75,
  maxZoom: 17.8,
  center: [-34.292, 27.57],
  cls,
  ixps,
  cables,
  clusters,
  facilities,
  facsMinZoom,
  cablesLabel,
  clsPaintConfig,
  snapPaintConfig,
  ixpsPaintConfig,
  facsPaintConfig,
  cablesPaintConfig,
  facilitiesLabel,
  facilitiesCount,
  facilitiesPoints,
  facilitiesClusters,
  facilitiesSinglePoints,
  highlightFeatureState,
  data: {
    sources: [
      {
        name: 'cables',
        opts: {
          type: 'vector',
          tiles: [`${process.env.VUE_APP_TILES_CABLES}`]
        }
      },
      {
        name: ixps,
        opts: {
          type: 'geojson',
          data: `${process.env.VUE_APP_TILES_IXPS}`
        }
      },

      {
        name: facilities,
        opts: {
          type: 'geojson',
          data: `${window.origin}/${process.env.VUE_APP_TILES_FACILITIES}`
        }
      },
      {
        name: facilitiesClusters,
        opts: {
          type: 'geojson',
          data: `${process.env.VUE_APP_TILES_FACS_CLUSTERS}`,
          cluster: true,
          maxzoom: 12,
          clusterRadius: 50,
          clusterMaxZoom: 14
        }
      },
      {
        name: cls,
        opts: {
          type: 'geojson',
          data: `${process.env.VUE_APP_TILES_CLS}`
        }
      },
      {
        name: clusters,
        opts: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          },
          cluster: true,
          clusterRadius: 60,
          clusterMaxZoom: 17.8
        }
      }
    ],
    layers: [
      {
        id: cables,
        source: cables,
        'source-layer': cables,
        type: 'line',
        maxzoom: 20,
        paint: cablesPaintConfig
      },
      {
        id: cablesLabel,
        source: 'cables',
        'source-layer': 'cables',
        type: 'symbol',
        minzoom: 2.89,
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
        id: cls,
        type: 'circle',
        source: cls,
        minzoom: 3.4,
        paint: clsPaintConfig
      },
      {
        id: facilities,
        type: 'fill-extrusion',
        source: facilities,
        minzoom: facsMinZoom,
        paint: facsPaintConfig
      },
      {
        id: facilitiesLabel,
        type: 'symbol',
        source: facilities,
        minzoom: facsMinZoom,
        layout: {
          'text-field': ['to-string', ['get', 'name']],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Regular'],
          'text-size': 13,
          'text-anchor': 'bottom',
          'text-offset': [0, -1]
        },
        paint: {
          'text-color': '#303030',
          'text-halo-color': '#ffffff',
          'text-halo-width': 0.75
        }
      },
      {
        id: ixps,
        type: 'circle',
        source: ixps,
        minzoom: 15,
        paint: ixpsPaintConfig
      },
      {
        id: facilitiesPoints,
        type: 'circle',
        minzoom: 14,
        source: facilities,
        paint: facsPointPaintConfig,
        filter: ['==', '$type', 'Point']
      },
      {
        id: facilitiesClusters,
        type: 'circle',
        source: facilitiesClusters,
        maxzoom: 14,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#51bbd6',
            750,
            '#51bbd6'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      },
      {
        id: facilitiesCount,
        type: 'symbol',
        source: facilitiesClusters,
        maxzoom: 14,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      },
      {
        id: facilitiesSinglePoints,
        type: 'circle',
        // maxzoom: 14,
        source: facilitiesClusters,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#2196f3',
          'circle-radius': 10
        }
      },
      {
        id: clusters,
        source: clusters,
        type: 'circle',
        paint: {
          'circle-color': '#F7B267',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      },
      {
        id: 'cluster-count',
        type: 'symbol',
        source: clusters,
        maxzoom: 14,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      },
      {
        id: 'clusters-single-points',
        type: 'circle',
        source: clusters,
        // maxzoom: 15,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-radius': 12,
          'circle-color': '#F7B267'
        }
      }
    ]
  },
  filter: {
    subsea: ['!=', ['get', 'terrestrial'], 'true'],
    terrestrial: ['==', ['get', 'terrestrial'], 'true'],
    activeSubsea: [
      'all',
      ['!=', 'terrestrial', 'true'],
      ['<', 'activationDateTime', activationDateTime]
    ],
    futureSubsea: ['all', ['!=', 'terrestrial', 'true'], ['>=', 'eol', 0]],
    active: ['!=', ['get', 'active'], 0],
    //  active: ['<=', ['get', 'status'], currentEpoch],
    all: ['has', '_id'],
    future: ['>', ['get', 'activationDateTime'], currentEpoch],
    timemachine: ['>=', ['get', 'eol'], 0] // We change the 0 value when using the filter component inside the navbar for the sub-sea time machine
  }
}
