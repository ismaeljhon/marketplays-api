const mongoose = require('mongoose')

/**
 *
 * @param {String} name model name to check
 * @param {Boolean} autoLoad If set to true, automatically loads the model if it doesn't exist
 *
 * @return {mongoose.model} returns the retrieved or loaded model
 */
const getModel = (name, autoLoad = true) => {
  let model = null
  try {
    model = mongoose.model(name)
  } catch (error) {
    // @TODO - add error message
  }

  if (!model && autoLoad) {
    let fileName = name.charAt(0).toLowerCase() + name.slice(1)
    model = require(`../models/${fileName}.js`)
  }
  return model
}

module.exports = getModel
