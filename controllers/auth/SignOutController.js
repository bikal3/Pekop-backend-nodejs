var User = require("../../models/User");

class SignOutController {
  // single sign out
  async signOut(request, response) {
    try {
      request.authUser.authTokens = request.authUser.authTokens.filter(
        (authToken) => {
          return authToken.token !== request.token;
        }
      );
      await request.authUser.save();
      response.status(200).json({ success: true });
    } catch (error) {
      response.status(500).json({ success: false, error: error.message });
    }
  }

  // sign out of all the devices
  async signOutAll(request, response) {
    try {
      request.authUser.authTokens = [];
      await request.authUser.save();
      response.status(200).json({ success: true });
    } catch (error) {
      response.status(500).json({ success: false, error: error.message });
    }
  }
}

const signOutController = new SignOutController();
module.exports = signOutController;
