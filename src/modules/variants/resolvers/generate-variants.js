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
  resolve: async ({ source, args }) => {
    return {
      record: {
        variants: await Variant.generateMany(args.record.attributeData)
      }
    }
  }
})

schemaComposer.Mutation.addFields({
  generateVariants: VariantTC.getResolver('generateVariants')
})
