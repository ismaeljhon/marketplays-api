const expect = require('expect')
const { request } = require('../../utils/test')
const { QualificationFactory } = require('../../utils/factories/')
const Qualification = require('../../models/qualifications')

describe('qualifications', () => {
  let skills = []
  let knowledge = []
  before(async () => {
    for (let y = 0; y < 10; y++) {
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

  it('there is more than 5 skills in database', () => {
    return request({
      query: `
        query {
          qualifications (filter: { type: "skill" }) {
            title
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.qualifications')
        expect(res.body.data.qualifications.length).toBeGreaterThan(5)
      })
      .expect(200)
  })

  it('there is more than 5 knowledge in database', () => {
    return request({
      query: `
        query {
          qualifications (filter: { type: "knowledge" }) {
            title
          }
        }
      `
    })
      .expect((res) => {
        expect(res.body).toHaveProperty('data.qualifications')
        expect(res.body.data.qualifications.length).toBeGreaterThan(5)
      })
      .expect(200)
  })
})
