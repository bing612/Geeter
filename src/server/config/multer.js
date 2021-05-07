const multer = require('multer');

const validTypes = ['image/png', 'image/jpeg', 'image/gif'];

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');

const uploadImage = (req, res, next) => {
  upload(req, res, (err) => {
    // return if error
    if (err instanceof multer.MulterError)
      return res.status(400).send('Invalid image.');
    if (err) return res.status(500).send('Cannot upload image.');

    // otherwise continue
    return next();
  });
};

const isValidImage = (imageType) => validTypes.includes(imageType);

module.exports = {
  upload: uploadImage,
  isValidImage: isValidImage
};
