import createControlButton from './createControlButton'
import EventEmitter from '../../lib/EventEmitter'
import { MessageBox } from 'element-ui'

class EditorControls extends EventEmitter {
  constructor({ map, draw, type }) {
    super()
    this.map = map
    this.draw = draw
    this.type = type
    this.buttons = null
    this.visibleControls = {
      lines: ['subsea', 'map', 'terrestrial-network'],
      points: ['facilities', 'ixps', 'cls', 'map'],
      polygon: ['facilities', 'map', 'csp']
    }
  }

  onAdd() {
    this.controlGroup = document.createElement('div')
    this.controlGroup.className = 'mapboxgl-ctrl-group mapboxgl-ctrl'
    this.buttons = this._createButtons()
    return this.controlGroup
  }

  onRemove() {
    this.controlGroup.parentNode.removeChild(this.controlGroup)
  }

  _createButtons() {
    return {
      line_string: createControlButton('line_string-static', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-line-string',
        title: 'Draw line',
        dataset: ['data-control-filter', 'lines'],
        visible: this.visibleControls.lines.includes(this.type),
        eventListener: () => this.createDraw(this.draw.modes.DRAW_LINE_STRING)
      }),

      point: createControlButton('point-static', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-point',
        title: 'Create point',
        dataset: ['data-control-filter', 'points'],
        visible: this.visibleControls.points.includes(this.type),
        eventListener: () => this.createDraw(this.draw.modes.DRAW_POINT)
      }),

      polygon: createControlButton('polygon-static', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-polygon',
        title: 'Create polygon',
        dataset: ['data-control-filter', 'polygon'],
        visible: this.visibleControls.polygon.includes(this.type),
        eventListener: () => this.createDraw(this.draw.modes.DRAW_POLYGON)
      }),

      editProperties: createControlButton('edit-properties-dynamic', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-edit-properties',
        title: 'Edit properties',
        eventListener: () => this.emit('update-feature-properties')
      }),

      trash: createControlButton('trash-dynamic', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-trash',
        title: 'Delete',
        eventListener: () =>
          this.emit('delete-feature', this.draw.getSelected().features)
      }),

      deleteAll: createControlButton('delete-all-static', {
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

      cut: createControlButton('cut-dynamic', {
        container: this.controlGroup,
        className:
          'editor-ctrl el-button m0 p0 el-button--text el-button--small',
        title: 'Cut Lines',
        icon: 'el-icon-scissors',
        visible: this.type == 'map' || this.type == 'subsea' ? true : false,
        eventListener: () => this.handleCutFeature()
      }),

      vertexdelete: createControlButton('vertexdelete-dynamic', {
        container: this.controlGroup,
        className:
          'editor-ctrl el-button m0 p0 el-button--text el-button--small',
        title: 'Vertex Deleting',
        icon: 'el-icon-delete-location',
        visible: this.type == 'map' || this.type == 'subsea' ? true : false,
        eventListener: () => this.handleDeleteVertex()
      }),

      ok: createControlButton('ok-dynamic', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-ok',
        title: 'Accept',
        eventListener: () =>
          this.emit('confirm', this.draw.getSelected().features)
      }),

      cancel: createControlButton('cancel-dynamic', {
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
    const staticControls = Object.keys(this.buttons)
      .map(key => this.buttons[key].id)
      .filter(id => id.includes('-static'))

    const dynamicControls = Object.keys(this.buttons)
      .map(key => this.buttons[key].id)
      .filter(id => id.includes('-dynamic'))

    const deleteAllBtnID = 'delete-all-static'

    if (!scene.isDynamicControls) {
      // ON STATIC MODE, THERE SHOULD ONLY BE TWO CONTROLS AT DISPOSITION
      // THE DRAW BUTTON FOR THE TYPE CREATION AND THE DELETE ALL BUTTON
      for (let key in this.buttons) {
        if (staticControls.includes(this.buttons[key].id)) {
          if (this.buttons[key].id == deleteAllBtnID) {
            this.buttons[key].style.setProperty('display', 'block')
          } else if (
            this.buttons[key].dataset.controlFilter &&
            this.visibleControls[
              this.buttons[key].dataset.controlFilter
            ].includes(this.type)
          ) {
            this.buttons[key].style.setProperty('display', 'block')
          } else {
            this.buttons[key].style.setProperty('display', 'none')
          }
        } else {
          this.buttons[key].style.setProperty('display', 'none')
        }
      }
    } else {
      // OTHERWISE ALL THE DYNAMIC BUTTONS SHOULD BE DISPLAYED
      // WITHOUT REMOVING THE DELETE-ALL BUTTON OFC
      for (let key in this.buttons) {
        if (dynamicControls.includes(this.buttons[key].id)) {
          this.buttons[key].style.setProperty('display', 'block')
        } else if (
          this.buttons[key].id == deleteAllBtnID ||
          this.buttons[key].id == 'cut-dynamic' ||
          this.buttons[key].id == 'vertexdelete-dynamic'
        ) {
          this.buttons[key].style.setProperty('display', 'block')
        } else {
          this.buttons[key].style.setProperty('display', 'none')
        }
      }
    }
  }

  async handleCutFeature() {
    const features = this.draw.getSelected().features
    const feature = features.length ? features[0] : null

    if (feature) {
      await this.emit('cut-feature', {
        feature: feature,
        geometryType: feature.geometry.type.toLowerCase()
      })
    }
  }

  async handleDeleteVertex() {
    const features = this.draw.getSelected().features
    const feature = features.length ? features[0] : null

    if (feature) {
      await this.emit('delete-vertex', {
        feature: feature,
        geometryType: feature.geometry.type.toLowerCase()
      })
    }
  }
}

export default EditorControls
