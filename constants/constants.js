const errorNames = {
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  SERVER_ERROR: 'SERVER_ERROR',
  UNAUTHENTICATED : "UNAUTHENTICATED",
  UNAUTHORIZED : "UNAUTHORIZED",
  USERNAME_ALREADY_EXISTS : "USERNAME_ALREADY_EXISTS",
  EMAIL_ALREADY_EXISTS : "EMAIL_ALREADY_EXISTS",
  RECIPE_NOT_FOUND : "RECIPE_NOT_FOUND",
  USERNAME_NOT_FOUND : "USERNAME_NOT_FOUND",
  EMAIL_NOT_FOUND : "EMAIL_NOT_FOUND",
  INVALID_CREDENTIALS : "INVALID_CREDENTIALS",
}

 const errorTypes = {
  SERVER_ERROR: {
    message: 'Server error.',
    statusCode: 500
  },
  UNAUTHENTICATED : {
    message : "User is not authenticated",
    statusCode : 401
  },
  UNAUTHORIZED : {
    message : "User is not authorized to do this action",
    statusCode : 403,
  },
  USERNAME_ALREADY_EXISTS : {
    message : "Username already exists",
    statusCode : 400
  },
  EMAIL_ALREADY_EXISTS : {
    message : "Email already exists",
    statusCode : 400
  },
  RECIPE_NOT_FOUND : {
    message : "Recipe not found",
    statusCode : 400
  },
  USERNAME_NOT_FOUND : {
    message : "Username not found",
    statusCode : 400
  },
  EMAIL_NOT_FOUND : {
    message : "Email not found",
    statusCode : 400
  },
  INVALID_CREDENTIALS : {
    message : "Invalid credentials",
    statusCode : 400
  }
}

module.exports = {
    errorNames,
    errorTypes
}