const convertToYear = date => {
  return new Date(parseInt(date) * 1000).getUTCFullYear() || ''
}

export default convertToYear
