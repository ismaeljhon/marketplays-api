const expect = require('expect')
const { request } = require('../../utils/test')
const { UserFactory, GmailUserFactory } = require('../../utils/factories/')

describe('Login User', () => {
  const fakeUser = UserFactory.generate()

  it('should create a new user', () => {
    return request({
      query: `
        mutation {
          SignupUser(record: {
              firstName :"${fakeUser.firstName}",
              middleName :"${fakeUser.middleName}",
              lastName: "${fakeUser.lastName}",
              email: "${fakeUser.email}",
              password: "${fakeUser.password}",
              contactNumber: "${fakeUser.contactNumber}",
            }) {
            record {
              firstName,
              middleName,
              lastName,
              email
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.SignupUser.record')
        expect(res.body.data.SignupUser.record.email).toStrictEqual(fakeUser.email)
      })
      .expect(200)
  })

  it('Should be able to login user via email', () => {
    // create user;
    return request({
      query: `
        mutation {
          LoginUser(record: {
              email: "${fakeUser.email}",
              password: "${fakeUser.password}",
            }) {
            record {
              _id,
              email
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.LoginUser.record')
        expect(res.body.data.LoginUser.record.email).toStrictEqual(fakeUser.email)
      })
      .expect(200)
  })

  it('Should be able to login user via gmail', () => {
    // create user;

    const gmailUser = GmailUserFactory.generate()

    return request({
      query: `
        mutation {
          LoginViaGmail(record: {

            fullName :"${gmailUser.firstName}",
            givenName:"${gmailUser.givenName}",
            familyName:"${gmailUser.familyName}",
            imageURL:"${gmailUser.imageURL}",
            email:"${gmailUser.email}",
            idToken: "${gmailUser.idToken}",
            }) {
            record {
              _id,
              email
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.LoginViaGmail.record')
        expect(res.body.data.LoginViaGmail.record.email).toStrictEqual(gmailUser.email)
      })
      .expect(200)
  })
})
