const { errorTypes } = require('./constants/constants')

const getErrorCode = errorName => {
  return errorTypes[errorName]
}

module.exports = {getErrorCode}