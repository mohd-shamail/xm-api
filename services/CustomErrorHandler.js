class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
  }

  static alreadyexists(message) {
    return new CustomErrorHandler(409, message);
  }
  static invalidCredentials(message = "invalid credentials!") {
    return new CustomErrorHandler(401, message);
  }
  static unAuthorized(message = "unAuthorized Access!") {
    return new CustomErrorHandler(401, message);
  }
  static notFound(message = "User not found") {
    return new CustomErrorHandler(401, message);
  }
}

module.exports = CustomErrorHandler;
