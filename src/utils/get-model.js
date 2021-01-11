const mongoose = require('mongoose')

/**
 * Retrives the model instance for a given model name
 * @param {String} name model name to check
 *
 * @return {mongoose.model} returns the retrieved or loaded model
 */
const getModel = name => {
  let model = null
  try {
    model = mongoose.model(name)
  } catch (error) {
    // @TODO - add error message
  }

  if (!model) {
    let fileName = name.charAt(0).toLowerCase() + name.slice(1)
    model = require(`../models/${fileName}.js`)
  }
  return model
}

module.exports = getModel
