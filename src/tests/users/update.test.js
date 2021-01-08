const expect = require('expect')
const { request } = require('../../utils/test')
const { UserFactory } = require('../../utils/factories/')
const User = require('../../models/user')

describe('updating user password', () => {
  const fakeUser = UserFactory.generate()
  let user = null
  before(async () => {
    user = await User.signup(fakeUser)
  })

  // password can be updated and should be saved as hashedPassword
  it('should be able to update the password', () => {
    return request({
      query: `
        mutation {
          updateUserById(_id: "${user._id}", record: {
            password: "somecoolnewpassword"
          }) {
            record {
              email
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.updateUserById.record')

        // let's just check for the email response for now
        // and have the password verified by doing a login request later
        expect(res.body.data.updateUserById.record.email).toStrictEqual(user.email)
      })
      .expect(200)
  })

  // @TODO - test logging in using the new password
})
