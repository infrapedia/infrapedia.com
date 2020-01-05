import createControlButton from './createControlButton'

class EditorControls {
  constructor(draw, dispatch, scene) {
    this.draw = draw
    this.scene = scene
    this.$dispatch = dispatch
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
          this.$dispatch('editor/beginCreation')
          this.draw.changeMode(this.draw.modes.DRAW_LINE_STRING)
        }
      }),
      point: createControlButton('point', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-point',
        title: 'Create point',
        visible: true,
        eventListener: () => {
          this.$dispatch('editor/beginCreation')
          this.draw.changeMode(this.draw.modes.DRAW_POINT)
        }
      }),

      trash: createControlButton('trash', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-trash',
        title: 'Delete',
        eventListener: () => {
          this.$dispatch('editor/selectionChange', this.draw.getSelected())
          this.featureDeleted()
        }
      }),

      ok: createControlButton('ok', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-ok',
        title: 'Accept',
        eventListener: () => {
          this.$dispatch('editor/selectionChange', this.draw.getSelected())
          const { features, edition, creation } = this.scene

          if (creation) {
            if (features && features.selected.length) {
              for (let feature of features.selected) {
                this.$dispatch('editor/confirmCreation', {
                  feature: { ...feature },
                  id: feature.id
                })
              }
            } else return
          } else if (edition) {
            this.$dispatch('editor/editFeature', features.selected)
          }

          this.resetScene()
        }
      }),
      cancel: createControlButton('cancel', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-cancel',
        title: 'Cancel',
        eventListener: () => {
          this.$dispatch('editor/selectionChange', this.draw.getSelected())
          const creations = this.draw.getAll()
          const savedFeats = Array.from(this.scene.features.list).map(
            feat => feat.id
          )
          const { selected } = this.scene.features

          if (this.scene.creation) {
            // We are deleting the selected and just created draw(s)
            if (selected && selected.length) {
              for (let feat of selected) {
                this.draw.delete(feat.id)
              }
            } else if (creations.features.length) {
              // Otherwise if the user has created draw(s) but he un-selected them
              // We are checking for ones which aren't saved on the store and deleting them
              for (let feat of creations.features) {
                if (!savedFeats.includes(feat.id)) {
                  this.draw.delete(feat.id)
                }
              }
            }
            this.resetScene()
          } else if (this.scene.edition) {
            // Deleting all draws
            this.draw.trash()
            // Because you cancel the edition we need to recreate all the draw(s) again
            // It will work like this for now, but I know it can't be cost-effective
            const savedFeatures = Array.from(this.scene.features.list, i => ({
              ...i.feature
            }))
            for (let feat of savedFeatures) {
              this.draw.add(feat)
            }
            this.resetScene()
          }
        }
      })
    }
  }

  resetScene() {
    this.$dispatch('editor/resetScene')
    this.draw.changeMode(this.draw.modes.SIMPLE_SELECT)
  }

  async featureDeleted() {
    const { selected } = this.scene.features
    if (selected && selected.length) {
      for (let feat of selected) {
        this.$dispatch('editor/deleteFeature', feat.id)
      }
      this.draw.trash()
      this.resetScene()
    }
  }

  updateControls(scene = this.scene) {
    if (scene.creation || scene.edition) {
      this.buttons.ok.style.setProperty('display', 'block')
      this.buttons.cancel.style.setProperty('display', 'block')
      this.buttons.trash.style.setProperty('display', 'block')

      this.buttons.point.style.setProperty('display', 'none')
      this.buttons.line_string.style.setProperty('display', 'none')

      return
    } else if (!scene.creation || !scene.edition) {
      this.buttons.ok.style.setProperty('display', 'none')
      this.buttons.cancel.style.setProperty('display', 'none')
      this.buttons.trash.style.setProperty('display', 'none')

      this.buttons.point.style.setProperty('display', 'block')
      this.buttons.line_string.style.setProperty('display', 'block')
    }

    if (scene.features.selected) {
      this.buttons.ok.style.setProperty('display', 'none')
      this.buttons.cancel.style.setProperty('display', 'none')
      this.buttons.trash.style.setProperty('display', 'block')

      this.buttons.point.style.setProperty('display', 'none')
      this.buttons.line_string.style.setProperty('display', 'none')

      return
    }
  }

  handleDrawSelectionChange(features) {
    if (!this.scene.edition && !this.scene.creation && features.length) {
      this.$dispatch('editor/beginEdition')
      this.$dispatch('editor/selectionChange', { features })
    }
  }
}

export default EditorControls
