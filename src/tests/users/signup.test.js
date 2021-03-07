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
              isECommerce : ${fakeUser.isECommerce},
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
              isECommerce : ${fakeUser.isECommerce},
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
              isFTP : ${fakeUserFTP.isFTP},
              isECommerce : ${fakeUserFTP.isECommerce},
              isSocialMedia  :${fakeUserFTP.isSocialMedia}
          }) {
            record {
              fullName
              email
              isFTP
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.SignupUser.record')
        expect(res.body.data.SignupUser.record.isFTP).toStrictEqual(fakeUserFTP.isFTP)
      })
      .expect(200)
  })

  it('should create a new user with access isECommerce Access', () => {
    return request({
      query: `
        mutation {
          SignupUser(record: {
              fullName: "${fakeUserCommerce.fullName}",
              email: "${fakeUserCommerce.email}",
              password: "${fakeUserCommerce.password}",
              isFTP : ${fakeUserCommerce.isFTP},
              isECommerce : ${fakeUserCommerce.isECommerce},
              isSocialMedia  :${fakeUserCommerce.isSocialMedia}
          }) {
            record {
              fullName
              email
              isECommerce
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.SignupUser.record')
        expect(res.body.data.SignupUser.record.isECommerce).toStrictEqual(fakeUserCommerce.isECommerce)
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
              isECommerce : ${fakeUserSocialMedia.isECommerce},
              isFTP : ${fakeUserSocialMedia.isFTP},
              isSocialMedia  :${fakeUserSocialMedia.isSocialMedia}
          }) {
            record {
              fullName
              email
              isSocialMedia
            }
          }
        }
      `
    })
      .expect(res => {
        expect(res.body).toHaveProperty('data.SignupUser.record')
        expect(res.body.data.SignupUser.record.isSocialMedia).toStrictEqual(fakeUserSocialMedia.isSocialMedia)
      })
      .expect(200)
  })
})
