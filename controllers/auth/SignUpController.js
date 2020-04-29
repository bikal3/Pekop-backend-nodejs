var User = require("../../models/User");
var Validation = require("../../requests/Validation");

class SignUpController {
  // create a new user and persist in database
  async registerUser(request, response) {
    const result = Validation.SIGNUP(request.body);

    if (result.error) {
      let error = result.error.details[0];
      response
        .status(422)
        .json({
          success: false,
          error: { field: error.path[0], message: error.message },
        });
    } else if (await User.emailExists(result.value.email)) {
      response
        .status(409)
        .json({
          success: false,
          error: { field: "email", message: "Email already registered!" },
        });
    } else {
      try {
        // save the new user in db
        let newUser = new User(result.value);
        let user = await newUser.save();
        response
          .status(201)
          .json({ success: true, message: "Sign up successful!", user: user });
      } catch (error) {
        response.status(500).json({ success: false, error: error.message });
      }
    }
  }
}

module.exports = new SignUpController();
