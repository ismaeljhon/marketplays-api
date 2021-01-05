const {
  uniq
} = require('lodash')

/**
 * Checks if an array of strings contains duplicates
 * @param {Array} data Array of string data to check if duplicates exists
 *
 * @return {Boolean} Returns true if any duplicates exists
 */
const hasDuplicates = data => {
  return data.length !== uniq(data).length
}

module.exports = hasDuplicates
