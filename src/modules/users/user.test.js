const expect = require('expect')
const faker = require('faker')
const { request } = require('../../utils/test')
const User = require('../../models/user')

const firstName = faker.name.firstName()
const lastName = faker.name.lastName()
const testUser = {
  fullName: firstName + ' ' + lastName,
  email: faker.internet.email(firstName, lastName, faker.internet.domainName()),
  password: faker.internet.password(20)
}
describe('user', () => {
  const createUser = ({
    fullName,
    email,
    password
  }, returnValues = `{
    recordId
    record {
      fullName
    }
  }`) => {
    return request({
      query: `
        mutation {
          UserSignup(
            record: {
              fullName: "${fullName}",
              email: "${email}",
              password: "${password}"        
            }
          ) ${returnValues}
        }
      `
    })
  }

  describe('create', () => {
    it('should create a new user', () => {
      return createUser(testUser)
        .expect(res => {
          expect(res.body).toHaveProperty('data.UserSignup.record.fullName')
        })
        .expect(200)
    })
    it('should not create a new user if email is not unique', () => {
      return createUser(testUser)
        .expect(res => {
          expect(res.body).toHaveProperty('errors')
          expect(res.body.data.UserSignup).toEqual(null)
          expect(Array.isArray(res.body.errors)).toBe(true)
        })
        .expect(200)
    })
  })

  const retrieveUsers = () => {
    return request({
      query: `
        query {
          UserMany {
            _id
            fullName
          }
        }
      `
    })
  }
  describe('retrieve', () => {
    let userId = null
    it('should retrieve all users', () => {
      return retrieveUsers()
        .expect(res => {
          expect(res.body).toHaveProperty('data.UserMany')
          expect(res.body.data.UserMany).toHaveLength(1)
          userId = res.body.data.UserMany[0]._id
        })
    })
    it('should retrieve the user by ID', () => {
      return request({
        query: `
          query {
            UserById(_id: "${userId}") {
              _id
              fullName
            }
          }
        `
      })
        .expect(res => {
          expect(res.body).toHaveProperty('data.UserById.fullName')
        })
    })
  })

  describe('update', () => {
    let userId = null
    before(async () => {
      const user = await User.findOne()
      userId = user._id
    })
    const updateUser = ({
      id,
      fullName
    }, returnValues = `{
      recordId,
      record {
        fullName
      }
    }`) => {
      return request({
        query: `
          mutation{
            UserUpdateById(
              _id: "${id}",
              record: {
                fullName: "${fullName}"
              }
            ) ${returnValues}
          }
        `
      })
    }
    it('should update an existing user', () => {
      const updatedUser = {
        id: userId,
        fullName: faker.name.firstName() + ' ' + faker.name.lastName()
      }
      return updateUser(updatedUser)
        .expect(res => {
          expect(res.body).toHaveProperty('data.UserUpdateById.record.fullName')
          expect(res.body.data.UserUpdateById.record.fullName).toStrictEqual(updatedUser.fullName)
        })
    })
  })
})
