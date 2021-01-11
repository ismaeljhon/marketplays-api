const { schemaComposer } = require('graphql-compose')
const Variant = require('../../../models/variant')
const VariantTC = schemaComposer.getOTC('User')

// endpoint for generating variants
VariantTC.addResolver({
  name: 'generateVariants',
  type: 'GenerateVariantsPayload',
  args: {
    record: 'GenerateVariantsInput'
  },
  description: 'Generates all the possible variants out of the attributes and options',
  resolve: ({ source, args }) => {
    try {
      return {
        record: {
          variants: Variant.generateFromAttributes(args.record.attributeData)
        }
      }
    } catch (error) {
      // @TODO - update to show only relevant information
      return error
    }
  }
})

schemaComposer.Mutation.addFields({
  generateVariants: VariantTC.getResolver('generateVariants')
})
