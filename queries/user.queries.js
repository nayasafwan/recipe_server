const { errorNames } = require("../constants/constants");
const {UserType} = require("../schema/schema")

module.exports = {
  user: {
    type: UserType,
    resolve(parent, args, context) {
      const { req } = context;

      if (!req.session.user) {
        throw new Error(errorNames.UNAUTHENTICATED)
      }
      return {
        username: req.session.user.username
      };
    },
  },
};
