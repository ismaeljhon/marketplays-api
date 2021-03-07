const expect = require('expect')
const { request } = require('../../utils/test')
const { UserFactory } = require('../../utils/factories/')

describe('SignupUser', () => {
  const fakeUser = UserFactory.generate()
  const fakeUserFTP = UserFactory.generate()
  const fakeUserCommerce = UserFactory.generate()
  const fakeUserSocialMedia = UserFactory.generate()

  it('should create a new user', () => {
    return request({
      query: `
        mutation {
          SignupUser(record: {
              fullName: "${fakeUser.fullName}",
              email: "${fakeUser.email}",
              password: "${fakeUser.password}",
              isEcommerce : ${fakeUser.isEcommerce},
              isFTP : ${fakeUser.isFTP},
              isSocialMedia  :${fakeUser.isSocialMedia}
          }) {
            record {
              fullName
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

  it('should only create a new user if the email is unique', () => {
    return request({
      query: `
        mutation {
          SignupUser(record: {
              fullName: "${fakeUser.fullName}",
              email: "${fakeUser.email}",
              password: "${fakeUser.password}",
              isEcommerce : ${fakeUser.isEcommerce},
              isFTP : ${fakeUser.isFTP},
              isSocialMedia  :${fakeUser.isSocialMedia}

          }) {
            record {
              fullName
              email
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
      .expect(200)
  })
  it('should create a new user with access FTP', () => {
    return request({
      query: `
        mutation {
          SignupUser(record: {
              fullName: "${fakeUserFTP.fullName}",
              email: "${fakeUserFTP.email}",
              password: "${fakeUserFTP.password}",
              isEcommerce : ${fakeUser.isEcommerce},
              isFTP : ${fakeUser.isFTP},
              isSocialMedia  :${fakeUser.isSocialMedia}
          }) {
            record {
              fullName
              email
              isEcommerce
              isFTP
              isSocialMedia
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.SignupUser.record')
        expect(res.body.data.SignupUser.record.isFTP).toStrictEqual(fakeUserFTP.isFTP.toString())
      })
      .expect(200)
  })

  it('should create a new user with access Ecommere Access', () => {
    return request({
      query: `
        mutation {
          SignupUser(record: {
              fullName: "${fakeUserCommerce.fullName}",
              email: "${fakeUserCommerce.email}",
              password: "${fakeUserCommerce.password}",
              isEcommerce : ${fakeUser.isEcommerce},
              isFTP : ${fakeUser.isFTP},
              isSocialMedia  :${fakeUser.isSocialMedia}
          }) {
            record {
              fullName
              email
              isEcommerce
              isFTP
              isSocialMedia
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.SignupUser.record')
        expect(res.body.data.SignupUser.record.isEcommerce).toStrictEqual(fakeUserCommerce.isEcommerce)
      })
      .expect(200)
  })

  it('should create a new user with default Social Media Access', () => {
    return request({
      query: `
        mutation {
          SignupUser(record: {
              fullName: "${fakeUserSocialMedia.fullName}",
              email: "${fakeUserSocialMedia.email}",
              password: "${fakeUserSocialMedia.password}",
              isEcommerce : ${fakeUser.isEcommerce},
              isFTP : ${fakeUser.isFTP},
              isSocialMedia  :${fakeUser.isSocialMedia}
          }) {
            record {
              fullName
              email
              isEcommerce
              isFTP
              isSocialMedia
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.SignupUser.record')
        expect(res.body.SignupUser.isSocialMedia).toStrictEqual(true)
      })
      .expect(200)
  })
})
