import createControlButton from './createControlButton'
import GL from '../mainMap/GL'
import { point, booleanEqual, featureCollection, lineSlice } from '@turf/turf'

class EditorControls {
  constructor({
    map,
    draw,
    type,
    scene,
    handleEditFeatureProperties,
    handleBeforeFeatureCreation
  }) {
    this.type = type
    this.map = map
    GL.setMap(this.map)
    this.draw = draw
    this.scene = scene
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
          this.type == 'map' ||
          this.type == 'subsea' ||
          this.type == 'terrestrial-network'
            ? true
            : false,
        eventListener: () => {
          debugger
          this.scene.creation = true
          this.draw.changeMode(this.draw.modes.DRAW_LINE_STRING)
        }
      }),
      cut: createControlButton('cut', {
        container: this.controlGroup,
        className:
          'editor-ctrl el-button m0 p0 el-button--text el-button--small',
        title: 'Cut Lines',
        icon: 'el-icon-scissors',
        visible:
          this.type == 'map' ||
          this.type == 'subsea' ||
          this.type == 'terrestrial-network'
            ? true
            : false,
        eventListener: () => {
          debugger
          var Draw = this.draw
          var mypoint = Draw.getSelectedPoints()
          var line = Draw.getSelected()
          var len = line.features[0].geometry.coordinates.length
          var id = line.features[0].id
          var all = Draw.getAll()
          var newlist = featureCollection([])
          if (mypoint.features.length > 0 && line.features.length > 0) {
            var start = point(line.features[0].geometry.coordinates[0])
            var stop = point(mypoint.features[0].geometry.coordinates)
            var finish = point(line.features[0].geometry.coordinates[len - 1])

            var slicedFirst = lineSlice(start, stop, line.features[0])
            var slicedSecond = lineSlice(stop, finish, line.features[0])
            slicedFirst.id = id + '_old'
            slicedFirst.geometry.coordinates.pop()
            slicedSecond.id = id + '_new'

            all.features.map(function(a) {
              if (a.id !== id) {
                newlist.features.push(a)
              } else {
                newlist.features.push(slicedFirst)
                newlist.features.push(slicedSecond)
              }
            })
            Draw.set(newlist)
          } else {
            alert('Please Select a geometry and a point')
          }
        }
      }),
      vertexdelete: createControlButton('vertexdelete', {
        container: this.controlGroup,
        className:
          'editor-ctrl el-button m0 p0 el-button--text el-button--small',
        title: 'Vertex Deleting',
        icon: 'el-icon-delete-location',
        visible:
          this.type == 'map' ||
          this.type == 'subsea' ||
          this.type == 'terrestrial-network'
            ? true
            : false,
        eventListener: () => {
          debugger
          var Draw = this.draw
          var mypoint = Draw.getSelectedPoints()
          var pt1 = mypoint.features[0]
          var line = Draw.getSelected()

          if (mypoint.features.length > 0 && line.features.length > 0) {
            var id = line.features[0].id
            var newCoords = []
            var all = Draw.getAll()
            line.features[0].geometry.coordinates.map(function(a) {
              var pt2 = point(a)
              var status = booleanEqual(pt1, pt2)
              if (status == false) {
                newCoords.push(a)
              }
            })
            all.features.map(function(a) {
              if (a.id == id) {
                a.geometry.coordinates = newCoords
              }
            })
            Draw.set(all)
          } else {
            alert('Please Select a geometry and a point')
          }
        }
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
        eventListener: () => {
          debugger
          this.scene.creation = true
          this.draw.changeMode(this.draw.modes.DRAW_POINT)
        }
      }),

      polygon: createControlButton('polygon', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-polygon',
        title: 'Create polygon',
        visible:
          this.type === 'map' || this.type === 'facilities' ? true : false,
        eventListener: () => {
          this.scene.creation = true
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
          this.scene.features.selected = this.draw.getSelected()
          this.deleteFeature()
        }
      }),

      ok: createControlButton('ok', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-ok',
        title: 'Accept',
        eventListener: () => {
          try {
            this.scene.creation
              ? this.handleFeatureCreation()
              : this.handleFeatureEdition()
          } catch (err) {
            console.error(err)
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
    this.scene.edition = null
    this.scene.creation = null
    this.scene.features.selected = null
    this.draw.changeMode(this.draw.modes.SIMPLE_SELECT)
    if (isResetList) {
      this.scene.features.list = []
    }
  }

  deleteFeature() {
    const selected = this.draw.getSelected()

    if (selected && selected.features.length > 0) {
      for (let featureSelected of selected.features) {
        this.scene.features.list = this.scene.features.list.filter(
          feat => feat.id != featureSelected.id
        )
        this.draw.delete(featureSelected.id)
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
    const lineStringAllowed = ['map', 'subsea', 'terrestrial-network']

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

      if (lineStringAllowed.includes(this.type)) {
        this.buttons.line_string.style.setProperty('display', 'block')
      } else {
        this.buttons.line_string.style.setProperty('display', 'none')
      }
    }
  }

  handleCancel() {
    this.scene.features.selected = this.draw.getSelected()
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
      this.scene.edition = true
      this.scene.features.selected = { features }
    }
  }

  async handleFeatureCreation() {
    this.scene.features.selected = this.draw.getSelected()
    const { selected } = this.scene.features

    if (selected && selected.features.length > 0) {
      const onlyOneFeatureAllowed = ['cls', 'ixps']
      if (
        onlyOneFeatureAllowed.includes(this.type) &&
        this.scene.features.list.length > 0
      ) {
        return
      }

      await this.handleBeforeFeatureCreation({
        ...selected.features[0]
      })
    }
  }
  /**
   *
   * @param { Object } features - Features that has been edited
   */
  handleFeatureEdition() {
    const currentFeature = this.draw.getSelected()

    if (currentFeature.features.length > 0) {
      const feat = JSON.parse(
        JSON.stringify(
          this.scene.features.list.filter(
            f => f.id == currentFeature.features[0].id
          )[0]
        )
      )

      feat.geometry.coordinates =
        currentFeature.features[0].geometry.coordinates

      this.scene.features.list.forEach((feature, i) => {
        for (let featEdit of [feat]) {
          if (feature.id == featEdit.id) {
            this.scene.features.list[i] = { ...featEdit }
          }
        }
      })
      this.resetScene()
    }
  }

  async handleEditFeatureProps() {
    const featuresSelected = this.draw.getSelected()

    if (featuresSelected && featuresSelected.features.length > 0) {
      const features = this.scene.features.list.filter(
        f => f.id == featuresSelected.features[0].id
      )
      await this.handleEditFeatureProperties(
        features.length ? JSON.parse(JSON.stringify(features[0])) : null
      )
    }
  }
}

export default EditorControls
