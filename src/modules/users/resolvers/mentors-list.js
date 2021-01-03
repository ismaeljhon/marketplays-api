const { schemaComposer } = require('graphql-compose')
const User = require('../../../models/user')

const UserTC = schemaComposer.getOTC('User')

UserTC.addResolver({
  name: 'mentors',
  type: 'MentorsListPayload',
  description: 'Retrieves a list of certified mentors from users table',
  resolve: async () => {
    const users = await User.find({ mentorshipCertified: true }, null, {
      limit: 50
    })
    return {
      record: users
    }
  }
})
schemaComposer.Query.addFields({
  mentors: UserTC.getResolver('mentors')
})
