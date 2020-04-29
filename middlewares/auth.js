const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const User = require("../models/User");

module.exports = checkAuth = async (request, response, next) => {
  try {
    const token = await request.headers.authorization.split(" ")[1];
    const decoded = await jwt.verify(token, keys.secret);
    const authUser = await User.findOne({
      _id: decoded.id,
      "authTokens.token": token,
    }).populate({ path: "trips", options: { sort: { createdAt: "desc" } } });
    if (!authUser) {
      response.status(404).json({ success: false, error: "User not found !" });
    } else {
      request.token = token;
      request.authUser = authUser;
      next();
    }
  } catch (error) {
    console.log("auth.js", error.message);
    response
      .status(401)
      .json({ success: false, error: "Unauthorized. Token Missing !" });
  }
};
