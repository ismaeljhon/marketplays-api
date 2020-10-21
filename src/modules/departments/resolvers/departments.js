const Department = require('../../../models/department')

const departments = async (_) => {
  const departments = await Department
    .find()
    .populate('teamLead')

  return departments
}

module.exports = departments
