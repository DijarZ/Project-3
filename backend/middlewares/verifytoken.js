const jwt = require("jsonwebtoken");

// function generateToken(user) {
//   const payload = {
//     userId: user.id,
//     userEmail: user.email,
//     userRole: user.role, // Përdor rolin për të menaxhuar autorizimin
//   };
//   const verify = jwt.verify(token, process.env.SECRET_TOKEN);
//   return jwt.sign(payload, secretKey, { expiresIn: "24h" });
// }

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.SECRET_TOKEN);
    if (verify) {
      req.user = verify;
      next();
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.log(error);
      res.status(401).send("Invalid Token");
    } else {
      console.log(error);
      res.status(500).send("Internal server error!");
    }
  }
};

module.exports = {
  verifyToken,
};
