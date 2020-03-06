import createControlButton from './createControlButton'

class EditorControls {
  constructor({
    draw,
    type,
    scene,
    $dispatch,
    handleEditFeatureProperties,
    handleBeforeFeatureCreation
  }) {
    this.type = type
    this.draw = draw
    this.scene = scene
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
        visible:
          this.type === 'map' ||
          this.type === 'subsea' ||
          this.type === 'terrestrial-network'
            ? true
            : false,
        eventListener: () => {
          this.$dispatch('editor/beginCreation')
          this.draw.changeMode(this.draw.modes.DRAW_LINE_STRING)
        }
      }),

      point: createControlButton('point', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-point',
        title: 'Create point',
        visible: this.type === 'map' || this.type === 'cls' ? true : false,
        eventListener: () => {
          this.$dispatch('editor/beginCreation')
          this.draw.changeMode(this.draw.modes.DRAW_POINT)
        }
      }),

      polygon: createControlButton('polygon', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-polygon',
        title: 'Create polygon',
        visible: this.type === 'map' ? true : false,
        eventListener: () => {
          this.$dispatch('editor/beginCreation')
          this.draw.changeMode(this.draw.modes.DRAW_POLYGON)
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
        this.draw.delete(feat.id)
        this.$dispatch('editor/deleteFeature', feat.id)
      }
      this.resetScene()
    }
  }

  /**
   *
   * @param { Object } scene - Reference to the Vuex state of the scene
   */
  updateControls(scene = this.scene) {
    const isCreation = scene.creation || scene.edition
    const isEdition = !scene.creation || !scene.edition

    if (isCreation) {
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
    } else if (isEdition) {
      this.buttons.ok.style.setProperty('display', 'none')
      this.buttons.cancel.style.setProperty('display', 'none')
      this.buttons.trash.style.setProperty('display', 'none')
      this.buttons.editProperties.style.setProperty('display', 'none')

      if (
        !this.type.includes('subsea') &&
        !this.type.includes('terrestrial-network')
      ) {
        this.buttons.point.style.setProperty('display', 'block')
      } else {
        this.buttons.point.style.setProperty('display', 'none')
      }

      if (this.type !== 'cls') {
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
        features: Array.from(this.scene.features.list, f => ({
          ...f
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
      if (this.type === 'cls' && this.scene.features.list.length) return
      else {
        return await this.handleBeforeFeatureCreation({
          ...features.selected[0]
        })
      }
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

      feat.geometry.coordinates =
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
