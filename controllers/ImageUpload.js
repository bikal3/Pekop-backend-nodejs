const path = require("path");

// multer for file uploads
const multer = require("multer");

const storageDir = multer.diskStorage({
  destination: "public/uploads/",
  filename(req, file, callback) {
    callback(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFileFilter = (req, file, callback) => {
  if (!path.extname(file.originalname).match(/\.(jpg|jpeg|png)$/)) {
    callback({ message: "The file does not seem like an image !" });
  } else {
    return callback(null, true);
  }
};

const upload = multer({
  storage: storageDir,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 30000000000, // 3MB
  },
}).single("displayPicture");

module.exports = upload;
