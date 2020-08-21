import createControlButton from './createControlButton'
import { MessageBox } from 'element-ui'
import EventEmitter from '../../lib/EventEmitter'

class EditorControls extends EventEmitter {
  constructor({ map, draw, type }) {
    super()
    this.map = map
    this.draw = draw
    this.type = type
  }

  onAdd() {
    this.controlGroup = document.createElement('div')
    this.controlGroup.className = 'mapboxgl-ctrl-group mapboxgl-ctrl'
    this.buttons = this.createButtons()
    return this.controlGroup
  }

  onRemove() {
    this.controlGroup.parentNode.removeChild(this.controlGroup)
  }

  createButtons() {
    return {
      line_string: createControlButton('line_string', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-line-string',
        title: 'Draw line',
        visible:
          this.type == 'map' ||
          this.type == 'subsea' ||
          this.type == 'terrestrial-network'
            ? true
            : false,
        eventListener: () => this.createDraw(this.draw.modes.DRAW_LINE_STRING)
      }),

      point: createControlButton('point', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-point',
        title: 'Create point',
        visible:
          this.type == 'map' ||
          this.type == 'cls' ||
          this.type == 'ixps' ||
          this.type == 'facilities'
            ? true
            : false,
        eventListener: () => this.createDraw(this.draw.modes.DRAW_POINT)
      }),

      polygon: createControlButton('polygon', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-polygon',
        title: 'Create polygon',
        visible: this.type == 'map' || this.type == 'facilities' ? true : false,
        eventListener: () => this.createDraw(this.draw.modes.DRAW_POLYGON)
      }),

      editProperties: createControlButton('edit-properties', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-edit-properties',
        title: 'Edit properties',
        eventListener: () => this.emit('update-feature-properties')
      }),

      trash: createControlButton('trash', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-trash',
        title: 'Delete',
        eventListener: () =>
          this.emit('delete-feature', this.draw.getSelected().features)
      }),

      deleteAll: createControlButton('delete-all', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-delete-all',
        title: 'Delete All',
        visible: true,
        eventListener: () => {
          const message =
            this.type == 'map'
              ? 'This will delete everything on the editor. Including the elements on each category you created. You sure you want to continue?'
              : 'This will delete everything on the editor. Except the elements you have selected on the form.'

          return MessageBox.confirm(message, 'Delete all?')
            .then(() => this.resetScene(true, true))
            .catch(() => {})
        }
      }),

      ok: createControlButton('ok', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-ok',
        title: 'Accept',
        eventListener: () =>
          this.emit('confirm', this.draw.getSelected().features)
      }),

      cancel: createControlButton('cancel', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-cancel',
        title: 'Cancel',
        eventListener: () => this.resetScene(false, true)
      })
    }
  }
  /**
   *
   * @param { string } mode - Mapbox Draw Mode
   */
  createDraw(mode) {
    this.emit('draw')
    this.draw.changeMode(mode)
  }
  /**
   *
   * @param { boolean } reset - A boolean indicating if it should reset the list of features saved too
   */
  resetScene(reset, removeFilter = false) {
    this.emit('reset-scene', { reset, removeFilter })
  }
  /**
   *
   * @param { Object } scene
   */
  updateControls(scene) {
    const isCreation = scene.creation || scene.edition
    const isEdition = !scene.creation || !scene.edition
    const lineStringAllowed = ['map', 'subsea', 'terrestrial-network']

    if (isCreation) {
      this.buttons.ok.style.setProperty('display', 'block')
      this.buttons.cancel.style.setProperty('display', 'block')
      this.buttons.trash.style.setProperty('display', 'block')

      this.buttons.point.style.setProperty('display', 'none')
      this.buttons.polygon.style.setProperty('display', 'none')
      this.buttons.line_string.style.setProperty('display', 'none')

      if (scene.edition) {
        this.buttons.editProperties.style.setProperty('display', 'block')
      } else {
        this.buttons.polygon.style.setProperty('display', 'none')
        this.buttons.editProperties.style.setProperty('display', 'none')
      }
    } else if (isEdition) {
      this.buttons.ok.style.setProperty('display', 'none')
      this.buttons.trash.style.setProperty('display', 'none')
      this.buttons.cancel.style.setProperty('display', 'none')
      this.buttons.polygon.style.setProperty('display', 'none')
      this.buttons.editProperties.style.setProperty('display', 'none')

      if (
        this.type.includes('subsea') &&
        this.type.includes('terrestrial-network')
      ) {
        this.buttons.point.style.setProperty('display', 'none')
      } else {
        this.buttons.point.style.setProperty('display', 'block')
      }

      if (this.type == 'facilities' || this.type == 'map') {
        this.buttons.polygon.style.setProperty('display', 'block')
      }

      if (lineStringAllowed.includes(this.type)) {
        this.buttons.line_string.style.setProperty('display', 'block')
      } else {
        this.buttons.line_string.style.setProperty('display', 'none')
      }
    }
  }
}

export default EditorControls
