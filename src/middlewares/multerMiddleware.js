const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images/avatars'));
    },
    filename: (req, file, cb) => {
        let fileName = `avatar_${Date.now()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

    const isValidExtension = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());

    if (isValidExtension) {
        cb(null, true); 
    } else {
        cb(new Error('Invalid file extension. Only .jpg, .jpeg, .png, and .gif files are allowed.'));
    }
};

const uploadFile = multer({ storage, fileFilter });

module.exports = uploadFile;