export const editorMapConfig = {
  sources: ['cls-source', 'ixps-source', 'cables-source', 'facilities-source'],
  layers: [
    {
      id: 'cables-layer',
      source: 'cables-source',
      type: 'line',
      paint: {
        'line-width': 1.5,
        'line-color': '#7288b0'
      }
    },
    {
      id: 'cables-label-layer',
      source: 'cables-source',
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
      id: 'cls-layer',
      type: 'circle',
      source: 'cls-source',
      paint: {
        'circle-radius': 5.42,
        'circle-color': '#f78682',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#333333'
      }
    },
    {
      id: 'cls-label-layer',
      source: 'cls-source',
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
      id: 'ixps-layer',
      type: 'circle',
      source: 'ixps-source',
      minzoom: 12,
      layout: {},
      paint: {
        'circle-color': '#666666',
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 1.75, 5, 6],
        'circle-stroke-color': '#ffffff'
      }
    },
    {
      id: 'ixps-label-layer',
      source: 'ixps-source',
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
      id: 'facilities-layer',
      type: 'fill-extrusion',
      source: 'facilities-source',
      minzoom: 14,
      layout: {},
      paint: {
        'fill-extrusion-color': '#666666',
        'fill-extrusion-height': ['/', ['get', 'height'], 1.25]
      }
    },
    {
      id: 'facilities-label-layer',
      source: 'facilities-source',
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
    }
  ]
}

export const customMapLayerTypes = {
  cables: {
    id: 'default-layer',
    source: 'default-source',
    type: 'line',
    paint: {
      'line-width': 1.5,
      'line-color': '#7288b0'
    }
    // filter: ['==', '$type', 'LineString']
    // filter: ['==', ['$type', 'LineString']]
  },
  label: {
    id: 'default-label-layer',
    source: 'default-source',
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
  points: {
    id: 'default-layer',
    type: 'circle',
    source: 'default-source',
    paint: {
      'circle-radius': 5.42,
      'circle-color': '#f78682',
      'circle-stroke-width': 1,
      'circle-stroke-color': '#333333'
    },
    filter: ['==', '$type', 'Point']
  },
  buildings: {
    id: 'default-layer',
    type: 'fill-extrusion',
    source: 'default-source',
    minzoom: 14,
    layout: {},
    filter: ['==', '$type', 'Polygon'],
    paint: {
      'fill-extrusion-color': '#666666',
      'fill-extrusion-height': ['/', ['get', 'height'], 1.25]
    }
  }
}
