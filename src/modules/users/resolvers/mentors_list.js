const { schemaComposer } = require('graphql-compose')
const User = require('../../../models/user')

const UserTC = schemaComposer.getOTC('User')

// remove create user and replace with signup
// schemaComposer.Mutation.removeField('createOneUser')
UserTC.addResolver({
  name: 'mentors',
  type: 'MentorsListPayload',
  description: 'Retrieves a list of certified mentors from users table',
  resolve: async () => {
    const users = await User.find({ certified_for_mentorship: true })
    return {
      record: users
    }
  }
})
schemaComposer.Query.addFields({
  mentors: UserTC.getResolver('mentors')
})
