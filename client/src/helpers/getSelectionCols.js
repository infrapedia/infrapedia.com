import {
  clsColumns,
  cablesColumns,
  ixpsColumns,
  orgsColumns,
  netColumns
  // facsColumns
} from '../config/columns'

export const getSelectionCols = type => {
  if (!type) return

  let col = []

  if (type === 'cls' || type === 'fac') {
    col = [...clsColumns]
    // } else if (type.includes('fac')) {
    // col = [...facsColumns]
  } else if (type.includes('cable') || type.includes('submarine')) {
    col = [...cablesColumns]
  } else if (type.includes('ixp')) {
    col = [...ixpsColumns]
  } else if (type.includes('org')) {
    col = [...orgsColumns]
  } else if (type.includes('net')) {
    col = [...netColumns]
  }
  return col
}
