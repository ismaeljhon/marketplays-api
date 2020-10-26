const mongoose = require('mongoose')
const pluralize = require('pluralize')
/**
 * Generates a mongoose model out of the schema and name provided
 * Adds deifned hooks for all models
 * @param {String} name  name of the model
 * @param {MongooseSchema} schema schema to create a model with
 *
 * @returns {MongooseModel}
 */
const generateModel = (name, schema) => {
  // apply any hooks defined for this model
  try {
    let directory = pluralize(name.charAt(0).toLowerCase() + name.slice(1))
    const hooks = require(`../modules/${directory}/hooks/index.js`)
    const ons = ['init', 'validate', 'save', 'remove']
    if (hooks) {
      ons.forEach(on => {
        const pre = hooks.pre
        const post = hooks.post
        if (pre && pre[on]) {
          schema.pre(on, pre[on])
        }
        if (post && post[on]) {
          schema.post(on, post[on])
        }
      })
    }
  } catch (error) {
    // no hooks found for the current model
    // @TODO - throw exemption?
  }
  return mongoose.model(name, schema)
}

module.exports = generateModel
