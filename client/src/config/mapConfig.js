const token = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN

const cableSubsea = 'cables_subsea'
const cableSubseaLabel = 'cables_subsea_label'
const cableSubseaHighlight = 'cables_subsea_highlight'
const cableTerrestrial = 'cables_terrestrial'
const cableTerrestrialLabel = 'cables_terrestrial_label'
const cableTerrestrialHighlight = 'cables_terrestrial_highlight'

const cls = 'cls'
const ixps = 'ixps'
const clusters = 'clusters'
const facilities = 'facilities'
const facilitiesLabel = 'facilities_label'
const currentEpoch = Math.round(new Date().getTime() / 1000)

export const mapConfig = {
  mapToken: token,
  default: 'mapbox://styles/networkatlas/cjt4y5k77443z1fmfu2pfbcuu',
  darkBasemap: 'mapbox://styles/mapbox/dark-v10',
  zoom: 1.75,
  center: [-34.292, 27.57],
  cls,
  ixps,
  clusters,
  facilities,
  facilitiesLabel,
  cableTerrestrial,
  cableSubsea,
  cableSubseaLabel,
  cableSubseaHighlight,
  cableTerrestrialLabel,
  cableTerrestrialHighlight,
  data: {
    sources: [
      {
        name: cableTerrestrial,
        opts: {
          type: 'vector',
          tiles: [`${process.env.VUE_APP_TILES_TERRESTRIAL_CABLES}`]
        }
      },
      {
        name: cableTerrestrialHighlight,
        opts: {
          type: 'vector',
          tiles: [`${process.env.VUE_APP_TILES_TERRESTRIAL_CABLES}`]
        }
      },
      {
        name: cableSubsea,
        opts: {
          type: 'vector',
          tiles: [`${process.env.VUE_APP_TILES_SUBSEA_CABLES}`]
        }
      },
      {
        name: cableSubseaHighlight,
        opts: {
          type: 'vector',
          tiles: [`${process.env.VUE_APP_TILES_SUBSEA_CABLES}`]
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
          data: `${process.env.VUE_APP_TILES_FACILITIES}`
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
          clusterMaxZoom: 20
        }
      }
    ],
    layers: [
      {
        id: cableTerrestrial,
        source: cableTerrestrial,
        'source-layer': cableTerrestrial,
        type: 'line',
        minzoom: 4,
        paint: {
          'line-width': 1.62,
          'line-color': [
            'case',
            ['==', ['get', 'status'], 0],
            '#FF0000',
            ['>', ['get', 'activation'], (new Date().getTime() / 1000) * 1000],
            '#af6ec7',
            ['==', ['get', 'hasoutage'], 'true'],
            '#7288b0',
            ['==', ['get', 'haspartial'], 'true'],
            '#CC591F',
            ['==', ['get', 'terrestrial'], 'true'],
            '#7288b0',
            '#7288b0'
          ]
        }
      },
      {
        id: cableTerrestrialLabel,
        source: cableTerrestrial,
        'source-layer': cableTerrestrial,
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
        id: cableTerrestrialHighlight,
        type: 'line',
        source: cableTerrestrialHighlight,
        'source-layer': cableTerrestrial,
        paint: {
          'line-width': 2.6,
          'line-color': '#F7D079'
        },
        filter: ['==', ['get', '_id'], false]
      },
      {
        id: cableSubsea,
        type: 'line',
        source: cableSubsea,
        'source-layer': cableSubsea,
        paint: {
          'line-width': 1.62,
          'line-color': [
            'case',
            ['==', ['get', 'status'], 0],
            '#FF0000',
            ['>', ['get', 'activation'], (new Date().getTime() / 1000) * 1000],
            '#af6ec7',
            ['==', ['get', 'hasoutage'], 'true'],
            '#7288b0',
            ['==', ['get', 'haspartial'], 'true'],
            '#CC591F',
            ['==', ['get', 'terrestrial'], 'true'],
            '#7288b0',
            '#7288b0'
          ]
        }
      },
      {
        id: cableSubseaLabel,
        source: cableSubsea,
        'source-layer': cableSubsea,
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
        id: cableSubseaHighlight,
        type: 'line',
        source: cableSubseaHighlight,
        'source-layer': cableSubsea,
        paint: {
          'line-width': 2.6,
          'line-color': '#F7D079'
        },
        filter: ['==', ['get', '_id'], false]
      },
      {
        id: facilities,
        type: 'fill-extrusion',
        source: facilities,
        minzoom: 14,
        paint: {
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
      },
      {
        id: facilitiesLabel,
        type: 'symbol',
        source: facilities,
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
      },
      {
        id: ixps,
        type: 'circle',
        source: ixps,
        minzoom: 12,
        paint: {
          'circle-radius': 4,
          'circle-color': '#b10f0f',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#333333'
        }
      },
      {
        id: cls,
        type: 'circle',
        source: cls,
        minzoom: 3.4,
        paint: {
          'circle-radius': 3,
          'circle-color': '#ffffff',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#333333'
        }
      },
      {
        id: clusters,
        source: clusters,
        type: 'circle',
        paint: {
          'circle-color': '#2196f3',
          'circle-radius': ['step', ['get', 'point_count'], 15, 2, 22, 4, 30]
        }
      },
      {
        id: 'cluster-count',
        type: 'symbol',
        source: clusters,
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
        maxzoom: 15,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#2196f3',
          'circle-radius': 10
        }
      }
    ]
  },
  filter: {
    subsea: ['!=', ['get', 'terrestrial'], true],
    activeSubsea: [
      'all',
      ['!=', 'terrestrial', 'true'],
      ['!=', 'isinactive', 'true']
    ],
    active: ['==', ['get', 'category'], 'online'],
    all: ['has', '_id'],
    future: ['>', ['get', 'activationDateTime'], currentEpoch],
    timemachine: ['>=', ['get', 'activationDateTime'], 0] // We change the 0 value when using the filter component inside the navbar for the sub-sea time machine
  }
}
