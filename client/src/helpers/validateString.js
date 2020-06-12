import specialChars from '../config/specialChars'

export default function validateString(str) {
  let valid = true
  for (let letter of str) {
    if (specialChars.includes(letter)) {
      valid = false
      break
    } else valid = true
  }
  return valid
}
