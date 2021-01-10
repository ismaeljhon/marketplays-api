const expect = require('expect')
const { request } = require('../../utils/test')
const {
  UserFactory,
  ServiceFactory,
  DepartmentFactory
} = require('../../utils/factories/')
const User = require('../../models/user')
const Department = require('../../models/department')

describe('service project manager', () => {
  // create dummy user
  let defaultProjectManager = null
  let newProjectManager = null
  let updatedProjectManager = null
  let department = null
  before(async () => {
    defaultProjectManager = await User.signup(UserFactory.generate())
    newProjectManager = await User.signup(UserFactory.generate())
    updatedProjectManager = await User.signup(UserFactory.generate())

    // create a dummy department, assigning a team lead
    const fakeDepartment = DepartmentFactory.generate()
    department = await Department.create({
      ...fakeDepartment,
      teamLead: defaultProjectManager._id
    })
  })

  let service = null
  it('should create a service defaulting the project manager to department team lead', () => {
    const fakeService = ServiceFactory.generate()
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeService.name}"
            code: "${fakeService.code}"
            pricing: ${fakeService.pricing}
            department: "${department._id}"
          }) {
            record {
              _id
              name
              projectManager {
                _id
                firstName
                lastName
                email
              }
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty(
        'data.createOneService.record.projectManager'
      )
      expect(
        res.body.data.createOneService.record.projectManager.email
      ).toStrictEqual(defaultProjectManager.email)
      service = res.body.data.createOneService.record
    })
  })

  it('should add the service under the default project manager', () => {
    return request({
      query: `
        query {
          user(_id: "${defaultProjectManager._id}") {
            _id
            projectManagerOf {
              _id
              name
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.user.projectManagerOf')
      expect(res.body.data.user.projectManagerOf).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: service.name
          })
        ])
      )
    })
  })

  it('should create a service with a project manager', () => {
    const fakeService = ServiceFactory.generate()
    return request({
      query: `
        mutation {
          createOneService(record: {
            name: "${fakeService.name}"
            code: "${fakeService.code}"
            pricing: ${fakeService.pricing}
            department: "${department._id}"
            projectManager: "${newProjectManager._id}"
          }) {
            record {
              _id
              name
              projectManager {
                _id
                firstName
                lastName
                email
              }
            }
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty(
          'data.createOneService.record.projectManager'
        )
        expect(
          res.body.data.createOneService.record.projectManager.email
        ).toStrictEqual(newProjectManager.email)
        service = res.body.data.createOneService.record
      })
      .expect(200)
  })

  it('should add the new service under the set project manager', () => {
    return request({
      query: `
        query {
          user(_id: "${newProjectManager._id}") {
            _id
            projectManagerOf {
              _id
              name
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.user.projectManagerOf')
      expect(res.body.data.user.projectManagerOf).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: service.name
          })
        ])
      )
    })
  })

  it('should update the project manager of an existing service', () => {
    return request({
      query: `
        mutation {
          updateServiceById(
            _id: "${service._id}",
            record: {
              projectManager: "${updatedProjectManager._id}"
            }
          ) {
            record {
              _id
              projectManager {
                _id
                firstName
                lastName
                email
              }
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty(
        'data.updateServiceById.record.projectManager'
      )
      expect(
        res.body.data.updateServiceById.record.projectManager.email
      ).toStrictEqual(updatedProjectManager.email)
    })
  })

  it('should add the service under the updated project manager', () => {
    return request({
      query: `
        query {
          user(_id: "${updatedProjectManager._id}") {
            _id
            projectManagerOf {
              _id
              name
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.user.projectManagerOf')
      expect(res.body.data.user.projectManagerOf).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: service.name
          })
        ])
      )
    })
  })

  it('should remove the service under the old project manager', () => {
    return request({
      query: `
        query {
          user(_id: "${newProjectManager._id}") {
            _id
            projectManagerOf {
              _id
              name
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.user')
      expect(res.body.data.user.projectManagerOf).toHaveLength(0)
    })
  })

  it('should remove the set project manager and fall back to the department team lead', () => {
    return request({
      query: `
        mutation {
          updateServiceById(
            _id: "${service._id}",
            record: {
              projectManager: null
            }
          ) {
            record {
              _id
              projectManager {
                _id
                firstName
                lastName
                email
              }
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty(
        'data.updateServiceById.record.projectManager'
      )
      expect(
        res.body.data.updateServiceById.record.projectManager.email
      ).toStrictEqual(defaultProjectManager.email)
    })
  })

  it('should remove the service under the preivous project manager', () => {
    return request({
      query: `
        query {
          user(_id: "${updatedProjectManager._id}") {
            _id
            projectManagerOf {
              _id
              name
            }
          }
        }
      `
    }).expect((res) => {
      expect(res.body).toHaveProperty('data.user.projectManagerOf')
      expect(res.body.data.user.projectManagerOf).toHaveLength(0)
    })
  })
})
