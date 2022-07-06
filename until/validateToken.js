const jwt = require('jsonwebtoken');

module.exports = {
  validateToken: (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    let result;
    if (authorizationHeader) {
      const token = authorizationHeader;
      const options = {
        expiresIn: '2d',
      };
      try {
        result = jwt.verify(token, process.env.JWT_SECRET, options);
        req.decoded = result;
        next();
      } catch (err) {
        result = {
          error: 'Invalid signature',
          status: 401
        }
        res.status(401).send(result)
      }
    } else {
      result = {
        error: 'Authentication error. Token required.',
        status: 401
      };
      res.status(401).send(result);
    }
  }
};