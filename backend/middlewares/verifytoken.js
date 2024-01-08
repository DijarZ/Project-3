const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).send("Missing Authorization Header");
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send("Invalid Token");
    }

    const verify = jwt.verify(token, process.env.SECRET_TOKEN);

    if (verify) {
      req.user = verify;
      next();
    } else {
      return res.status(401).send("Invalid Token");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  verifyToken,
};
