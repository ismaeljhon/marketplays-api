const { schemaComposer } = require('graphql-compose')
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 12

const UserTC = schemaComposer.getOTC('User')

// remove hahsedPassword from User type
UserTC.removeField('hashedPassword')
schemaComposer.getITC('UpdateByIdUserInput')
  .removeField([ 'hashedPassword', 'created', 'changed', 'lastActive' ])
  .addFields({
    password: 'String'
  })

// update 'updateById' to apply hash
const oldUpdateById = schemaComposer.Mutation.getField('updateUserById')
schemaComposer.Mutation.removeField('updateUserById')

UserTC.addResolver({
  name: 'updateUserById',
  type: 'UpdateByIdUserPayload',
  args: oldUpdateById.args,
  description: oldUpdateById.description,
  resolve: async ({ source, args }) => {
    if (args.record.password) {
      args.record.hashedPassword = await bcrypt.hash(args.record.password, SALT_ROUNDS)
    }
    return oldUpdateById.resolve(source, args)
  }
})

schemaComposer.Mutation.addFields({
  updateUserById: UserTC.getResolver('updateUserById')
})
