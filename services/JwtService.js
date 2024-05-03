const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/index");

class JwtService {
  static sign(payload, expiry = '2y', secret = JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry, algorithm: 'HS256' });
  }
  static verify(token, secret = JWT_SECRET) {
    return jwt.verify(token, secret);
  }
}

module.exports = JwtService;
