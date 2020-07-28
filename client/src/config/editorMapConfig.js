export const editorMapConfig = {
  sources: [
    'cls-source',
    'ixps-source',
    'cables-source',
    'facilities-source',
    'snappoint',
    'testpoint',
    'testlines',
    'testpolygons'
  ],
  layers: [
    {
      id: 'testpolygons',
      type: 'fill',
      source: 'testpolygons',
      layout: {},
      paint: {
        'fill-color': '#666666'
      }
    },
    {
      id: 'testpoint',
      source: 'testpoint',
      type: 'circle',
      paint: {
        'circle-radius': 5.42,
        'circle-color': '#f78682',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#333333'
      }
    },
    {
      id: 'testlines',
      source: 'testlines',
      type: 'line',
      paint: {
        'line-width': 1.5,
        'line-color': '#7288b0'
      }
    },
    {
      id: 'cables-layer',
      source: 'cables-source',
      // 'source-layer': 'cables-layer',
      type: 'line',
      paint: {
        'line-width': 1.5,
        'line-color': '#7288b0'
      }
    },
    {
      id: 'cls-layer',
      type: 'circle',
      source: 'cls-source',
      // 'source-layer': 'cls-layer',
      paint: {
        'circle-radius': 5.42,
        'circle-color': '#f78682',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#333333'
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
      id: 'facilities-layer',
      type: 'fill-extrusion',
      source: 'facilities-source',
      minzoom: 14,
      layout: {},
      paint: {
        'fill-extrusion-color': '#666666',
        'fill-extrusion-height': ['/', ['get', 'height'], 1.25]
      }
    }
  ]
}
