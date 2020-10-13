const Department = require('../../../models/department')

const departments = async (_) => {
  const departments = await Department
    .find()

  return departments
}

module.exports = departments
