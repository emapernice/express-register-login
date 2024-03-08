const path = require('path');
const { body } = require('express-validator');

module.exports = [
    body('fullName').notEmpty().withMessage('Enter your name'),
    body('email').notEmpty().withMessage('Enter your email').bail()
                .isEmail().withMessage('Wrong or Invalid email address. Please correct and try again.'),
    body('password').notEmpty().withMessage('Minimum 6 characters required').bail()
        .isLength({ min: 6 }).withMessage('Minimum 6 characters required').bail(),
    body('re_password').notEmpty().withMessage('Type your password again').bail(),
    body('re_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords must match');
        }
        return true;
    }).bail(),    
    body('avatar').custom((value, { req }) => {
		let file = req.file;
		let acceptedExtensions = ['.jpg','.jpeg', '.png', '.gif'];

		if (file) {
			let fileExtension = path.extname(file.originalname);
			if (!acceptedExtensions.includes(fileExtension)) {
				throw new Error(`Allowed file extensions are ${acceptedExtensions.join(' ')}`);
			}
		}

		return true;
	})

];