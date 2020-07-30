import distance from '@turf/distance'
import area from '@turf/area'
import { DRAWING, TITLE_BY_SELECTION } from '../../events'

/**
 *
 * @param { data } Array - Draw Array containing all the draws
 * @param { elemnt } Object - HTML Element to set the calculated data
 */
export default function handleDraw({ data, elemnt }) {
  debugger
  if (data.features.length) {
    this.$emit(`${DRAWING}`, true)
    let calculated

    // If a feature is directly selected
    if (window.draw.getMode() === 'direct_select') {
      const selected = window.draw.getSelected()

      if (selected.features.length) {
        let featureData = selected.features[0]

        if (featureData.geometry.type.toLowerCase() === 'polygon') {
          this.$emit(`${TITLE_BY_SELECTION}`, 'Area')
          calculated = area(data)

          elemnt.innerHTML =
            '<p><strong>' +
            Math.round(calculated) / 1000 +
            '</strong></p><p>hectares</p>'
        } else if (featureData.geometry.type.toLowerCase() === 'linestring') {
          this.$emit(`${TITLE_BY_SELECTION}`, 'Distance')
          calculated = distance(
            featureData.geometry.coordinates[0],
            featureData.geometry.coordinates[1]
          )

          elemnt.innerHTML =
            '<p><strong>' + calculated + '</strong></p><p>Kms</p>'
        }
      }
      return
    }

    // Otherwise I need to check all the drawn features
    for (let feature of data.features) {
      if (feature.geometry.type.toLowerCase() === 'linestring') {
        this.$emit(`${TITLE_BY_SELECTION}`, 'Distance')
        calculated = distance(
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1]
        )

        elemnt.innerHTML =
          '<p><strong>' + calculated + '</strong></p><p>Kms</p>'
      } else {
        this.$emit(`${TITLE_BY_SELECTION}`, 'Area')
        calculated = area(data)

        elemnt.innerHTML =
          '<p><strong>' +
          Math.round(calculated) / 1000 +
          '</strong></p><p>hectares</p>'
      }
    }
  } else this.$emit(`${DRAWING}`, false)
}
