import { fCollectionFormat } from '../../helpers/featureCollection'
import { point, booleanEqual, lineSlice } from '@turf/turf'
import createControlButton from './createControlButton'
import { Message, MessageBox } from 'element-ui'
import Snaping from './snaping'

class EditorControls {
  constructor({
    map,
    draw,
    type,
    scene,
    handleCategoriesChange,
    handleBeforeFeatureCreation,
    handleEditFeatureProperties,
    handleSetFeaturesIntoDataSource
  }) {
    this.type = type
    this.map = map
    this.draw = draw
    this.scene = scene
    this.snaping = new Snaping({
      map: map,
      pixel: 8,
      draw: draw,
      scene: scene,
      snapLayers: [
        'cls-layer',
        'ixps-layer',
        'cables-layer',
        'facilities-layer'
      ]
    })
    this.snapMode = false
    this.resetScene = this.resetScene
    this.updateControls = this.updateControls
    this.handleCategoriesChange = handleCategoriesChange
    this.handleBeforeFeatureCreation = handleBeforeFeatureCreation
    this.handleEditFeatureProperties = handleEditFeatureProperties
    this.handleDrawSelectionChange = this.handleDrawSelectionChange
    this.handleSetFeaturesIntoDataSource = handleSetFeaturesIntoDataSource
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
        eventListener: () => this.handleCutFeature()
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
        eventListener: () => this.handleDeleteVertex()
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
          this.scene.creation = true
          this.draw.changeMode(this.draw.modes.DRAW_POINT)
        }
      }),

      polygon: createControlButton('polygon', {
        container: this.controlGroup,
        className: 'editor-ctrl editor-polygon',
        title: 'Create polygon',
        visible: this.type == 'map' || this.type == 'facilities' ? true : false,
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
            .then(() => {
              this.resetScene(true)
              this.handleSetFeaturesIntoDataSource({
                reset: true,
                map: this.map
              })
            })
            .catch(() => {})
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
        eventListener: () => this.resetScene()
      })
    }
  }
  /**
   *
   * @param { boolean } reset - A boolean indicating if it should reset the list of features saved too
   */
  resetScene(reset, removeFilter = Boolean(this.scene.features.layerFiltered)) {
    this.scene.edition = null
    this.scene.creation = null
    this.scene.snappoint = null
    this.scene.features.selected = null

    if (removeFilter) {
      this.map.setFilter(this.scene.features.layerFiltered, ['has', '$type'])
    }
    this.scene.features.layerFiltered = null
    this.draw.changeMode(this.draw.modes.SIMPLE_SELECT)
    this.draw.set(fCollectionFormat())

    if (reset) this.scene.features.list = []
  }

  deleteFeature() {
    const selected = this.draw.getSelected().features
    //TODO: WHEN DELETING A FEATURE IS NOT DELETING THE LABEL ASSOCIATION IN THE SOURCE-LAYER

    if (selected && selected.length > 0) {
      for (let feature of selected) {
        this.scene.features.list = this.scene.features.list.filter(
          feat => feat.properties.__editorID != feature.properties.__editorID
        )

        if (feature.properties.category) {
          this.handleCategoriesChange({
            feature,
            isDelete: true,
            list: this.scene.features.list
          })
        } else {
          this.handleSetFeaturesIntoDataSource({
            feature,
            map: this.map,
            list: this.scene.features.list
          })
        }
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

  /**
   *
   * @param { Array } features - FeatureCollection with the features that has been selected by the user
   */
  handleDrawSelectionChange(feature) {
    if (feature) {
      const id = this.draw.add(feature)
      this.scene.edition = true
      this.scene.features.selected = { ...feature }
      this.draw.changeMode('simple_select', { featureIds: id })
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
  async handleFeatureEdition() {
    const features = this.draw.getSelected().features

    if (features.length > 0) {
      await this.handleEditFeatureProperties({
        feat: features[0],
        isGeomEdit: true
      })
      this.resetScene()
    }
  }

  async handleEditFeatureProps() {
    const features = this.draw.getSelected().features

    if (features && features.length > 0) {
      const feature = this.scene.features.list.filter(
        f => f.properties.__editorID == features[0].properties.__editorID
      )[0]

      if (feature)
        await this.handleEditFeatureProperties({
          feat: feature,
          isGeomEdit: false
        })
    }
  }

  async handleCutFeature() {
    var mypoint = this.draw.getSelectedPoints()
    var line = this.draw.getSelected()
    var len = line.features[0].geometry.coordinates.length
    var id = line.features[0].id
    var all = Array.from(this.scene.features.list, it => ({ ...it }))
    var newlist = fCollectionFormat()
    if (mypoint.features.length > 0 && line.features.length > 0) {
      var start = point(line.features[0].geometry.coordinates[0])
      var stop = point(mypoint.features[0].geometry.coordinates)
      var finish = point(line.features[0].geometry.coordinates[len - 1])

      var firstSegment = lineSlice(start, stop, line.features[0])
      var secondSegment = lineSlice(stop, finish, line.features[0])
      firstSegment.id = this.draw.add(firstSegment)[0]
      secondSegment.id = this.draw.add(secondSegment)[0]
      firstSegment.properties.__editorID = firstSegment.id
      secondSegment.properties.__editorID = secondSegment.id

      firstSegment.geometry.coordinates.pop()

      const selection = all.filter(item => item.id == id)
      if (selection && selection.length > 0) {
        firstSegment.properties = { ...selection[0].properties }
        secondSegment.properties = {
          ...selection[0].properties,
          name: `${selection[0].properties.name}.copy`
        }
      }

      for (let feat of all) {
        if (feat.id != id) {
          newlist.features.push(feat)
        } else {
          newlist.features.push(firstSegment)
          newlist.features.push(secondSegment)
        }
      }

      for (let feat of newlist) {
        this.handleSetFeaturesIntoDataSource({
          list: this.scene.features.list,
          feature: feat,
          map: this.map
        })
      }
      this.scene.edition = null
      this.scene.creation = null
      this.scene.features.selected = null
      this.scene.features.list = newlist.features
    } else {
      alert('Please Select a geometry and a point')
    }
  }

  async handleDeleteVertex() {
    var mypoint = this.draw.getSelectedPoints()
    var pt1 = mypoint.features[0]
    var line = this.draw.getSelected()

    if (mypoint.features.length > 0 && line.features.length > 0) {
      var id = line.features[0].id
      var newCoords = []
      var all = this.draw.getAll()
      if (line.features[0].geometry.coordinates.length > 2) {
        line.features[0].geometry.coordinates.forEach(function(a) {
          var pt2 = point(a)
          var status = booleanEqual(pt1, pt2)
          if (status == false) {
            newCoords.push(a)
          }
        })
        all.features.forEach(function(a) {
          if (a.id == id) {
            a.geometry.coordinates = newCoords
          }
        })

        this.draw.set(all)
      } else {
        return Message({
          message:
            'A feature needs to have at least 2 coordinates in order to be valid.',
          type: 'info',
          duration: 8000
        })
      }
    } else {
      return Message({
        message: 'You must first select the vertex point of a feature.',
        type: 'info',
        duration: 8000
      })
    }
  }
}

export default EditorControls
