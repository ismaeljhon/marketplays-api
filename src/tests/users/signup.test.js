const expect = require('expect')
const { request } = require('../../utils/test')
const { UserFactory, QualificationFactory } = require('../../utils/factories/')
const Qualification = require('../../models/qualifications')
const User = require('../../models/user')

describe('signup', () => {
  const fakeUser = UserFactory.generate()
  const fakeUser2 = UserFactory.generate()
  let users = []
  let skills = []
  let knowledge = []
  let user = null
  before(async () => {
    for (let y = 0; y < 5; y++) {
      const skill = await Qualification.create(
        QualificationFactory.generateSkill()
      )
      skills.push(`"${skill._id}"`)
      const knowledge1 = await Qualification.create(
        QualificationFactory.generateKnowledge()
      )
      knowledge.push(`"${knowledge1._id}"`)
    }
    for (let x = 0; x <= 1; x++) {
      let user = await UserFactory.generate()
      user = await User.signup(user)
      users.push(user)
    }
  })

  it("should not signup if mentor is not certified or mentor's email is not verified", () => {
    return request({
      query: `
        mutation {
          signup(record: {
              firstName: "${fakeUser.firstName}"
              lastName: "${fakeUser.lastName}"
              email: "${fakeUser.email}"
              password: "${fakeUser.password}"  
              username: "${fakeUser.username}"
              mentor: "${users[0]._id}"
              skills: [${skills}]
              knowledge: [${knowledge}]
          }) {
            record {
              email
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
      .expect(200)
  })

  it('should make user a mentor', () => {
    return request({
      query: `
        mutation {
          updateUserById (_id: "${users[0]._id}", record: {
            mentorshipCertified: true
          }) {
            record {
              email
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.updateUserById.record')
        expect(res.body.data.updateUserById.record.email).toStrictEqual(
          users[0].email
        )
      })
      .expect(200)
  })

  it('should not verify email with incorrect verification code', () => {
    return request({
      query: `
        mutation {
          verifyEmail (verificationCode: "XYZ") {
            record 
            error {
              message
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.verifyEmail.error.message')
        expect(res.body.data.verifyEmail.error.message).toStrictEqual(
          'no user associated with this verification code'
        )
      })
      .expect(200)
  })

  it('should verify email', () => {
    return request({
      query: `
        mutation {
          verifyEmail (verificationCode: "${users[0].verificationCode}") {
            record
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.verifyEmail.record')
        expect(res.body.data.verifyEmail.record).toStrictEqual(true)
      })
      .expect(200)
  })

  it('check email verified already', () => {
    return request({
      query: `
        mutation {
          verifyEmail (verificationCode: "${users[0].verificationCode}") {
            record 
            error {
              message
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.verifyEmail.error.message')
        expect(res.body.data.verifyEmail.error.message).toStrictEqual(
          'user verified already'
        )
      })
      .expect(200)
  })

  it('there are more than 0 mentors in database', () => {
    return request({
      query: `
        query {
          mentors {
            record {
              username
              email
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.mentors.record')
        expect(res.body.data.mentors.record.length).toBeGreaterThan(0)
      })
      .expect(200)
  })

  it('should create a new user', () => {
    return request({
      query: `
        mutation {
          signup(record: {
              firstName: "${fakeUser2.firstName}"
              lastName: "${fakeUser2.lastName}"
              email: "${fakeUser2.email}"
              password: "${fakeUser2.password}"  
              username: "${fakeUser2.username}"
          }) {
            record {
              _id
              email
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.signup.record')
        expect(res.body.data.signup.record.email).toStrictEqual(
          fakeUser2.email
        )
      })
      .expect(200)
  })

  it('should create a new user with mentor and atleast 5 skills and 5 knowledge', () => {
    return request({
      query: `
        mutation {
          signup(record: {
              firstName: "${fakeUser.firstName}"
              lastName: "${fakeUser.lastName}"
              email: "${fakeUser.email}"
              password: "${fakeUser.password}"  
              username: "${fakeUser.username}"
              mentor: "${users[0]._id}"
              skills: [${skills}]
              knowledge: [${knowledge}]
          }) {
            record {
              _id
              email
              skills { title }
              knowledge { title }
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.signup.record')
        expect(res.body.data.signup.record.email).toStrictEqual(fakeUser.email)
        expect(
          res.body.data.signup.record.skills.length
        ).toBeGreaterThanOrEqual(5)
        expect(
          res.body.data.signup.record.knowledge.length
        ).toBeGreaterThanOrEqual(5)
        user = res.body.data.signup.record._id
      })
      .expect(200)
  })

  it('check if user has the skill', () => {
    return request({
      query: `
      query {
        userHasQualification(record: { qualificationID: ${skills[0]}, userID: "${user}" }) {
          record 
          error {
            message
          }
        }
      }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.userHasQualification.record')
        expect(res.body.data.userHasQualification.record).toBe(true)
      })
      .expect(200)
  })

  it('check if user has the kowledge', () => {
    return request({
      query: `
      query {
        userHasQualification(record: { qualificationID: ${knowledge[0]}, userID: "${user}" }) {
          record 
          error {
            message
          }
        }
      }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.userHasQualification.record')
        expect(res.body.data.userHasQualification.record).toBe(true)
      })
      .expect(200)
  })

  it('should only create a new user if the email is unique', () => {
    return request({
      query: `
        mutation {
          signup(record: {
            firstName: "${fakeUser.firstName}"
            lastName: "${fakeUser.lastName}"
            email: "${fakeUser.email}"
            password: "${fakeUser.password}"    
            username: "${fakeUser.username}"
          }) {
            record {
              firstName
              lastName
              email
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
      .expect(200)
  })

  it('should only create a new user if the username is unique', () => {
    return request({
      query: `
        mutation {
          signup(record: {
            firstName: "${fakeUser.firstName}"
            lastName: "${fakeUser.lastName}"
            email: "${fakeUser.email}"
            password: "${fakeUser.password}"    
            username: "${fakeUser.username}"
          }) {
            record {
              firstName
              lastName
              email
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('errors')
        expect(Array.isArray(res.body.errors)).toBe(true)
      })
      .expect(200)
  })
})
