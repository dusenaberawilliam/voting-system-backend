const { verify } = require("jsonwebtoken");
require("dotenv").config();

const userAuthentication = (allowedRoles) => {
  return (req, res, next) => {
    const accessToken = req.header("authorization");

    if (!accessToken)
      return res
        .status(401)
        .send({ message: "Unauthorized", error: "Not logged in" });

    try {
      const validToken = verify(accessToken, process.env.SECRET_KEY_TOKEN);
      if (validToken && allowedRoles.includes(validToken.role)) {
        req.userData = validToken;
        return next();
      } else {
        return res
          .status(403)
          .json({ message: "Forbidden", error: "Not allowed access" });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Unauthorized", error: error.message });
    }
  };
};

module.exports = userAuthentication;
