import { LINE_STRING, POINT } from './geometryTypes'
import createControlButton from './createControlButton'
// import { finalizeCreation } from './editorActions'

class EditorControls {
  constructor(map, draw, state) {
    this.map = map
    this.draw = draw
    this.state = state
    this.updateControls = this.updateControls
    this.handleDrawSelectionChange = this.handleDrawSelectionChange
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
        visible: true,
        eventListener: () => {
          this.draw.changeMode(this.draw.modes.DRAW_LINE_STRING)
          this.state.scene.creation = true
          console.warn('BEGIN CREATION ' + LINE_STRING)
          // this.store.dispatch(beginCreation(LINE_STRING))
        }
      }),
      point: createControlButton('point', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-point',
        title: 'Create point',
        visible: true,
        eventListener: () => {
          this.state.scene.creation = {
            feature: this.draw.getSelected()
          }
          this.draw.changeMode(this.draw.modes.DRAW_POINT)
          console.warn('BEGIN CREATION ' + POINT)
        }
      }),

      editProperties: createControlButton('edit-properties', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-edit-properties',
        title: 'Edit properties',
        eventListener: () => {
          let featureId = this.state.scene.features.selected
          let features = this.state.scene.features.list.filter(
            f => f.properties.__editor._id === featureId
          )
          let feature = features.length ? features[0] : null
          if (feature) {
            console.warn('EDIT FEATURE PROPERTIES' + LINE_STRING)
            // this.store.dispatch(editFeatureProperties(feature))
          }
        }
      }),
      edit: createControlButton('edit', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-edit-geometry',
        title: 'Edit geometry',
        eventListener: () => {
          let featureId = this.state.scene.features.selected
          let features = this.state.scene.features.list.filter(
            f => f.properties.__editor._id === featureId
          )
          let feature = features.length ? features[0] : null
          if (feature) {
            let id = this.draw.add(feature)[0]
            if (feature.geometry.type === POINT) {
              this.draw.changeMode(this.draw.modes.SIMPLE_SELECT, {
                featureIds: [id]
              })
            } else {
              this.draw.changeMode(this.draw.modes.DIRECT_SELECT, {
                featureId: id
              })
            }
            console.warn('BEGIN EDIT ' + feature)
            // this.store.dispatch(beginEdit(feature))
          }
        }
      }),
      trash: createControlButton('trash', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-trash',
        title: 'Delete',
        eventListener: () => {
          this.state.scene.features.selected = this.draw.getSelected()
          this.featureDeleted()
        }
      }),

      ok: createControlButton('ok', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-ok',
        title: 'Accept',
        eventListener: () => {
          const current = this.draw.getSelected()
          if (this.state.scene.creation) {
            if (current && current.features.length) {
              this.state.scene.features.list.push({
                feature: { ...current },
                id: current.features[0].id
              })
            } else return
          } else if (this.state.scene.edition) {
            console.log(current)
          }

          this.resetScene()
        }
      }),
      cancel: createControlButton('cancel', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-cancel',
        title: 'Cancel',
        eventListener: () => {
          const current = this.draw.getSelected()
          const creations = this.draw.getAll()
          const savedFeats = Array.from(this.state.scene.features.list, i => ({
            ...i
          })).map(feat => feat.id)

          if (this.state.scene.creation) {
            if (current.features.length) {
              for (let feat of current.features) {
                this.draw.delete(feat.id)
              }
            } else if (creations.features.length) {
              for (let feat of creations.features) {
                if (!savedFeats.includes(feat.id)) {
                  this.draw.delete(feat.id)
                }
              }
            }

            console.warn('Cancel creation')
            this.resetScene()
          } else if (this.state.scene.edition) {
            console.warn('Cancel edition')
            if (current.features.length) {
              this.draw.delete(current.features[0].id)
              this.draw.add(this.state.scene.features.selected)
              this.resetScene()
            }
          }
        }
      })
    }
  }

  resetScene() {
    this.state.scene.edition = null
    this.state.scene.creation = null
    this.state.scene.features.selected = null
    this.draw.changeMode(this.draw.modes.SIMPLE_SELECT)
  }

  async featureDeleted() {
    const { selected } = this.state.scene.features
    if (selected) {
      console.warn('DELETING FEATURE!!')
      this.state.scene.features.list = this.state.scene.features.list.filter(
        feat => feat._id !== selected.features[0].id
      )
      this.draw.trash()
      this.resetScene()
    }
  }

  updateControls() {
    if (this.state.scene.creation || this.state.scene.edition) {
      this.buttons.ok.style.setProperty('display', 'block')
      this.buttons.cancel.style.setProperty('display', 'block')

      this.buttons.editProperties.style.setProperty('display', 'none')
      this.buttons.edit.style.setProperty('display', 'none')
      this.buttons.trash.style.setProperty('display', 'block')

      this.buttons.line_string.style.setProperty('display', 'none')
      this.buttons.point.style.setProperty('display', 'none')

      return
    } else if (!this.state.scene.creation || !this.state.scene.edition) {
      this.buttons.ok.style.setProperty('display', 'none')
      this.buttons.cancel.style.setProperty('display', 'none')

      this.buttons.editProperties.style.setProperty('display', 'none')
      this.buttons.edit.style.setProperty('display', 'none')
      this.buttons.trash.style.setProperty('display', 'none')

      this.buttons.line_string.style.setProperty('display', 'block')
      this.buttons.point.style.setProperty('display', 'block')
    }

    if (this.state.scene.features.selected) {
      this.buttons.ok.style.setProperty('display', 'none')
      this.buttons.cancel.style.setProperty('display', 'none')

      this.buttons.editProperties.style.setProperty('display', 'block')
      this.buttons.edit.style.setProperty('display', 'block')
      this.buttons.trash.style.setProperty('display', 'block')

      this.buttons.line_string.style.setProperty('display', 'none')
      this.buttons.point.style.setProperty('display', 'none')

      return
    }

    // this.controlGroup.style.setProperty('display', 'none')
  }

  handleDrawSelectionChange(features) {
    if (
      !this.state.scene.creation &&
      !this.state.scene.edition &&
      features.length
    ) {
      this.state.scene.edition = true
      this.state.scene.features.selected = features[0]
    }
  }
}

export default EditorControls
