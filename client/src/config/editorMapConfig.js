export const editorMapConfig = {
  sources: ['nondrawn-features', 'drawn-features', 'snappoint'],
  layers: [
    {
      id: 'cables-layer',
      source: 'nondrawn-features',
      type: 'line',
      filter: ['all', ['!=', '$type', 'Point'], ['!=', '$type', 'Polygon']],
      paint: {
        'line-width': 1.5,
        'line-color': '#7288b0'
      }
    },
    {
      id: 'cables-label-layer',
      source: 'nondrawn-features',
      type: 'symbol',
      filter: ['all', ['!=', '$type', 'Point'], ['!=', '$type', 'Polygon']],
      layout: {
        'text-field': '{name}',
        'symbol-placement': 'line',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
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
      source: 'nondrawn-features',
      filter: ['==', '$type', 'Point'],
      paint: {
        'circle-radius': 5.42,
        'circle-color': '#f78682',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#333333'
      }
    },
    {
      id: 'cls-label-layer',
      source: 'nondrawn-features',
      filter: ['==', '$type', 'Point'],
      type: 'symbol',
      layout: {
        'text-field': '{name}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
        'text-justify': 'right',
        'text-anchor': 'top',
        'text-offset': [0, -2]
      },
      paint: {
        'text-color': '#485E69'
      }
    },
    {
      id: 'snappoint',
      type: 'circle',
      source: 'snappoint',
      paint: {
        'circle-radius': 6,
        'circle-color': ['get', 'color'],
        'circle-stroke-width': 1,
        'circle-stroke-color': '#333333'
      }
    },
    {
      id: 'ixps-layer',
      type: 'circle',
      source: 'nondrawn-features',
      filter: ['==', '$type', 'Point'],
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
      source: 'nondrawn-features',
      filter: ['==', '$type', 'Point'],
      type: 'symbol',
      layout: {
        'text-field': '{name}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
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
      source: 'nondrawn-features',
      filter: ['==', '$type', 'Polygon'],
      minzoom: 14,
      layout: {},
      paint: {
        'fill-extrusion-color': '#666666',
        'fill-extrusion-height': ['/', ['get', 'height'], 1.25]
      }
    },
    {
      id: 'facilities-label-layer',
      source: 'nondrawn-features',
      filter: ['==', '$type', 'Polygon'],
      type: 'symbol',
      layout: {
        'text-field': '{name}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
        'text-justify': 'right',
        'text-anchor': 'bottom',
        'text-offset': [0, -0.1]
      },
      paint: {
        'text-color': '#485E69'
      }
    },
    {
      id: 'drawn-cables-layer',
      source: 'drawn-features',
      type: 'line',
      filter: ['all', ['!=', '$type', 'Point'], ['!=', '$type', 'Polygon']],
      paint: {
        'line-width': 1.5,
        'line-color': '#7288b0'
      }
    },
    {
      id: 'drawn-cables-label-layer',
      source: 'drawn-features',
      type: 'symbol',
      filter: ['all', ['!=', '$type', 'Point'], ['!=', '$type', 'Polygon']],
      layout: {
        'text-field': '{name}. Status: {status}',
        'symbol-placement': 'line',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
        'text-justify': 'right',
        'text-anchor': 'bottom',
        'text-offset': [0, -0.1]
      },
      paint: {
        'text-color': '#485E69'
      }
    },
    {
      id: 'drawn-cls-layer',
      type: 'circle',
      source: 'drawn-features',
      filter: ['==', '$type', 'Point'],
      paint: {
        'circle-radius': 5.42,
        'circle-color': '#f78682',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#333333'
      }
    },
    {
      id: 'drawn-cls-label-layer',
      source: 'drawn-features',
      filter: ['==', '$type', 'Point'],
      type: 'symbol',
      layout: {
        'text-field': '{name}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
        'text-justify': 'right',
        'text-anchor': 'top',
        'text-offset': [0, -2]
      },
      paint: {
        'text-color': '#485E69'
      }
    },
    {
      id: 'drawn-ixps-layer',
      type: 'circle',
      source: 'drawn-features',
      filter: ['==', '$type', 'Point'],
      minzoom: 12,
      layout: {},
      paint: {
        'circle-color': '#666666',
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 1.75, 5, 6],
        'circle-stroke-color': '#ffffff'
      }
    },
    {
      id: 'drawn-ixps-label-layer',
      source: 'drawn-features',
      type: 'symbol',
      filter: ['==', '$type', 'Point'],
      layout: {
        'text-field': '{name}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
        'text-justify': 'right',
        'text-anchor': 'bottom',
        'text-offset': [0, -0.1]
      },
      paint: {
        'text-color': '#485E69'
      }
    },
    {
      id: 'drawn-facilities-layer',
      type: 'fill-extrusion',
      source: 'drawn-features',
      filter: ['==', '$type', 'Polygon'],
      paint: {
        'fill-extrusion-color': '#666666',
        'fill-extrusion-height': ['/', ['get', 'height'], 1.25]
      }
    },
    {
      id: 'drawn-facilities-label-layer',
      source: 'drawn-features',
      type: 'symbol',
      filter: ['==', '$type', 'Polygon'],
      layout: {
        'text-field': '{name}. Status: {status}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 14,
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
  label: {
    id: 'default-label-layer',
    source: 'default-source',
    type: 'symbol',
    layout: {
      'text-field': '{name}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 14,
      'text-justify': 'right',
      'text-anchor': 'top',
      'text-offset': [0, -2]
    },
    paint: {
      'text-color': '#485E69'
    }
  },
  cables: {
    id: 'default-layer',
    source: 'default-source',
    type: 'line',
    paint: {
      'line-width': 1.5
      // 'line-color': ['case', ['get', 'color'], '{color}', '#7288b0']
    },
    filter: ['all', ['!=', '$type', 'Point'], ['!=', '$type', 'Polygon']]
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
    layout: {},
    filter: ['==', '$type', 'Polygon'],
    paint: {
      'fill-extrusion-opacity': 1,
      'fill-extrusion-color': '#666666',
      'fill-extrusion-height': ['get', 'height']
    }
  }
}
