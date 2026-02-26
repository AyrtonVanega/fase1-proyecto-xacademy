const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

module.exports = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== ".csv") {
      return cb(new Error("Solo se permiten archivos CSV"));
    }
    cb(null, true);
  }
});
