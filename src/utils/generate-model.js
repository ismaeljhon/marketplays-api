const mongoose = require('mongoose')
const pluralize = require('pluralize')
/**
 * Generates a mongoose model out of the schema and name provided
 * Adds deifned hooks for all models
 * @param {String} name  name of the model
 * @param {MongooseSchema} schema schema to create a model with
 * @param {Object} options Optional parameters
 * @param {mongoose.model} options.baseModel base model of the discriminator model
 *
 * @returns {MongooseModel}
 */
const generateModel = (name, schema, { baseModel } = {}) => {
  // apply any hooks defined for this model
  try {
    let directory = pluralize(name.charAt(0).toLowerCase() + name.slice(1))
    const hooks = require(`../modules/${directory}/hooks/index.js`)
    if (hooks) {
      const pre = hooks.pre
      const post = hooks.post
      if (pre) {
        Object.keys(pre).forEach(key => {
          schema.pre(key, pre[key])
        })
      }

      if (post) {
        Object.keys(post).forEach(key => {
          schema.post(key, post[key])
        })
      }
    }
  } catch (error) {
    // no hooks found for the current model
    // @TODO - throw exemption?
  }

  let model = null
  if (baseModel) {
    // instantiate the model using the base model using discriminator
    model = baseModel.discriminator(name, schema)
  } else {
    model = mongoose.model(name, schema)
  }
  return model
}

module.exports = generateModel
