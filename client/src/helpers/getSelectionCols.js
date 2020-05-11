import {
  clsColumns,
  cablesColumns,
  ixpsColumns,
  orgsColumns,
  netColumns,
  facsColumns
} from '../config/columns'

export function getSelectionCols(type) {
  if (!type) return []

  let col = []
  let t = type.toLowerCase()

  if (t == 'cls') {
    col = [...clsColumns]
  } else if (t.includes('fac')) {
    col = [...facsColumns]
  } else if (t.includes('cable')) {
    col = [...cablesColumns]
  } else if (t.includes('ixp')) {
    col = [...ixpsColumns]
  } else if (t.includes('org') || t.includes('owners')) {
    col = [...orgsColumns]
  } else if (t.includes('network')) {
    col = [...netColumns]
  }
  return col
}
