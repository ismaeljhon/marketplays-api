const { schemaComposer } = require('graphql-compose')
const User = require('../../../models/user')

const UserTC = schemaComposer.getOTC('User')

UserTC.addResolver({
  name: 'qualification',
  type: 'VerifyPayload',
  args: {
    record: 'QualificationUserInput'
  },
  description: 'Verify user has particular qualification',
  resolve: async ({ args }) => {
    const user = await User.findById(args.record.userID)
    if (!user) {
      return {
        error: { message: 'user does not not exist' }
      }
    }
    return {
      record:
        user.skills.includes(args.record.qualificationID) ||
        user.knowledge.includes(args.record.qualificationID)
    }
  }
})
schemaComposer.Query.addFields({
  qualification: UserTC.getResolver('qualification')
})
