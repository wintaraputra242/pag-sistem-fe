/**
 * @param {Object} input Object of Object
 * @returns {Array} output Array of Object
 */
export default function(input) {
  const arr = []
  for (const key in input) {
    if (Object.hasOwnProperty.call(input, key)) {
      arr.push(input[key])
    }
  }
  return arr
}
