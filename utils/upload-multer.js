const path = require("path");
const multer = require("multer");
const uuid = require("uuid");

/** MULTER IMAGE UPLOADER  **/

function getTargetImageStorage(address) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(`Destination directory: ./uploads/${address}`);
      cb(null, `./uploads/${address}`);
    },
    filename: function (req, file, cb) {
      console.log(file);
      const extension = path.parse(file.originalname).ext;
      const random_name = uuid.v4() + extension;
      console.log(`Generated filename: ${random_name}`);

      cb(null, random_name);
    },
  });
}
const makeUploader = (address) => {
  const storage = getTargetImageStorage(address);
  return multer({ storage: storage });
};

module.exports = makeUploader;

