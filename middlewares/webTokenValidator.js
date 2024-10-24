const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.SEC_KEY;

exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
