const User = require("../models/User");
const ImageUpload = require("./ImageUpload");
const bcrypt = require("bcrypt");
const Validations = require("../requests/Validation");

class UserController {
  async getCurrentUser(request, response) {
    let userId = request.params.id;
    let user = await User.findById(userId);
    if (!user) {
      response
        .status(404)
        .json({ success: false, message: "User does not exist!" });
    } else {
      response.status(200).json({ success: true, user: user });
    }
  }

  async uploadDisplayPicture(request, response) {
    try {
      ImageUpload(request, response, (error) => {
        if (error) {
          response.status(500).json({ error: error });
        } else {
          User.findOneAndUpdate(
            { _id: request.authUser._id },
            { $set: { displayPicture: request.file.filename } },
            { new: true },
            (err, updatedUser) => {
              if (err) {
                // console.log(err.message);
                response
                  .status(500)
                  .json({ success: false, error: err.message });
              } else {
                response.status(200).json({
                  success: true,
                  message: "Picture uploaded successfully !",
                  image: request.file.filename,
                  updatedUser: updatedUser,
                });
              }
            }
          );
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async updatePersonalDetails(request, response) {
    const result = Validations.UPDATEUSERDETIALS(request.body);
    if (result.error) {
      let error = result.error.details[0];
      response.status(422).json({
        success: false,
        error: { field: error.path[0], message: error.message },
      });
    } else {
      const { firstName, familyName, email, username } = result.value;

      try {
        let userEmail = await User.emailExists(email);
        if (userEmail) {
          if (userEmail._id.toString() !== request.authUser._id.toString()) {
            response.status(409).json({
              success: false,
              error: {
                field: "email",
                message: "Email already registered !",
              },
            });
            return;
          }
        }
        let updatedUser = await User.findOneAndUpdate(
          { _id: request.authUser._id },
          { firstName, familyName, email, username },
          { new: true }
        );

        response.status(200).json({
          success: true,
          message: "Details updated successfully !",
          updatedUser: updatedUser,
        });
      } catch (error) {
        response.status(500).json({ success: false, error: error.message });
      }
    }
  }
}

module.exports = new UserController();
