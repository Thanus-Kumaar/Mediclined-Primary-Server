const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.SEC_KEY;

exports.authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).send({ ERR: "No bearer token found!" });
    }
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Access Denied" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log(decoded.role)
      if (!roles.includes(decoded.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient privileges" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ ERR: "Invalid token or token expired" });
    }
  };
};
