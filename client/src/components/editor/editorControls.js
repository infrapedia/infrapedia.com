import createControlButton from './createControlButton'

class EditorControls {
  constructor({
    draw,
    $dispatch,
    scene,
    isCLS,
    handleEditFeatureProperties,
    handleBeforeFeatureCreation
  }) {
    this.draw = draw
    this.scene = scene
    this.isCLS = isCLS
    this.$dispatch = $dispatch
    this.resetScene = this.resetScene
    this.updateControls = this.updateControls
    this.handleBeforeFeatureCreation = handleBeforeFeatureCreation
    this.handleEditFeatureProperties = handleEditFeatureProperties
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
        visible: this.isCLS ? false : true,
        eventListener: () => {
          this.$dispatch('editor/beginCreation')
          this.draw.changeMode(this.draw.modes.DRAW_LINE_STRING)
        }
      }),

      point: createControlButton('point', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-point',
        title: 'Create point',
        visible: !this.isCLS ? false : true,
        eventListener: () => {
          this.$dispatch('editor/beginCreation')
          this.draw.changeMode(this.draw.modes.DRAW_POINT)
        }
      }),

      editProperties: createControlButton('edit-properties', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-edit-properties',
        title: 'Edit properties',
        eventListener: () => this.handleEditFeatureProps()
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
          try {
            return this.scene.creation
              ? this.handleFeatureCreation()
              : this.handleFeatureEdition()
          } catch (err) {
            console.warn(err)
          }
        }
      }),

      cancel: createControlButton('cancel', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-cancel',
        title: 'Cancel',
        eventListener: () => this.handleCancel()
      })
    }
  }
  /**
   *
   * @param { boolean } isResetList - A boolean indicating if it should reset the list of features saved too
   */
  resetScene(isResetList) {
    this.$dispatch('editor/resetScene')
    this.draw.changeMode(this.draw.modes.SIMPLE_SELECT)
    if (isResetList) this.$dispatch('editor/resetList')
  }

  featureDeleted() {
    const { selected } = this.scene.features
    if (selected && selected.length) {
      for (let feat of selected) {
        this.$dispatch('editor/deleteFeature', feat.id)
      }
      this.draw.trash()
      this.resetScene()
    }
  }

  /**
   *
   * @param { Object } scene - Reference to the Vuex state of the scene
   */
  updateControls(scene = this.scene) {
    if (scene.creation || scene.edition) {
      this.buttons.ok.style.setProperty('display', 'block')
      this.buttons.cancel.style.setProperty('display', 'block')
      this.buttons.trash.style.setProperty('display', 'block')

      this.buttons.point.style.setProperty('display', 'none')
      this.buttons.line_string.style.setProperty('display', 'none')

      if (scene.edition) {
        this.buttons.editProperties.style.setProperty('display', 'block')
      } else {
        this.buttons.editProperties.style.setProperty('display', 'none')
      }
    } else if (!scene.creation || !scene.edition) {
      this.buttons.ok.style.setProperty('display', 'none')
      this.buttons.cancel.style.setProperty('display', 'none')
      this.buttons.trash.style.setProperty('display', 'none')
      this.buttons.editProperties.style.setProperty('display', 'none')

      if (this.isCLS) this.buttons.point.style.setProperty('display', 'block')
      else this.buttons.point.style.setProperty('display', 'none')

      if (!this.isCLS) {
        this.buttons.line_string.style.setProperty('display', 'block')
      } else {
        this.buttons.line_string.style.setProperty('display', 'none')
      }
    }
  }

  handleCancel() {
    this.$dispatch('editor/selectionChange', this.draw.getSelected())
    const creations = this.draw.getAll()
    const savedFeats = Array.from(this.scene.features.list).map(feat => feat.id)
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
      // Because you cancel the edition we need to recreate all the draw(s) again
      // This function does the same as doing this.draw.trash() and them this.draw.add() for each feature
      // The difference is that this one has better performance
      this.draw.set({
        type: 'FeatureCollection',
        features: Array.from(this.scene.features.list, i => ({
          ...i.feature
        }))
      })
      this.resetScene()
    }
  }

  /**
   *
   * @param { Array } features - FeatureCollection with the features that has been selected by the user
   */
  handleDrawSelectionChange(features) {
    if (!this.scene.edition && !this.scene.creation && features.length) {
      this.$dispatch('editor/beginEdition')
      this.$dispatch('editor/selectionChange', { features })
    }
  }

  async handleFeatureCreation() {
    this.$dispatch('editor/selectionChange', this.draw.getSelected())
    const { features } = this.scene

    if (features && features.selected.length) {
      return await this.handleBeforeFeatureCreation({
        id: features.selected[0].id,
        feature: { ...features.selected[0] },
        type: features.selected[0].geometry.type
      })
    } else return
  }
  /**
   *
   * @param { Object } features - Features that has been edited
   */
  handleFeatureEdition() {
    const currentFeature = this.draw.getSelected()

    if (currentFeature.features.length) {
      const feat = JSON.parse(
        JSON.stringify(
          this.scene.features.list.filter(
            f => f.id === currentFeature.features[0].id
          )[0]
        )
      )

      feat.feature.geometry.coordinates =
        currentFeature.features[0].geometry.coordinates

      this.$dispatch('editor/editFeature', [feat])
      return this.resetScene()
    }
  }

  async handleEditFeatureProps() {
    const featureId = this.scene.features.selected[0].id
    const features = this.scene.features.list.filter(f => f.id === featureId)
    await this.handleEditFeatureProperties(
      features.length ? JSON.parse(JSON.stringify(features[0])) : null
    )
  }
}

export default EditorControls
