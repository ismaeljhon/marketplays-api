const expect = require('expect')
const { request } = require('../../utils/test')
const { UserFactory, QualificationFactory } = require('../../utils/factories/')
const Qualification = require('../../models/qualifications')
const User = require('../../models/user')

describe('signup', () => {
  const fakeUser = UserFactory.generate()
  let users = []
  let skills = []
  let knowledge = []
  before(async () => {
    for (let x = 0; x <= 1; x++) {
      let user = await UserFactory.generate()
      user = await User.signup(user)
      users.push(user)
    }
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

  it('there is more than 0 mentor in database', () => {
    return request({
      query: `
        query {
          users (filter: { mentorshipCertified: true }) {
            email
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.users')
        expect(res.body.data.users.length).toBeGreaterThan(0)
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
              email
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.signup.record')
        expect(res.body.data.signup.record.email).toStrictEqual(fakeUser.email)
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

  it('user can be verified via verification code', () => {
    return request({
      query: `
        query {
          getOneUser(filter: {
            email: "${fakeUser.email}"  
            username: "${fakeUser.username}"
          }) {
            verificationCode
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.getOneUser.verificationCode')
      })
      .expect(200)
  })
})
