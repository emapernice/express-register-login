const { validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');

const User = require('../models/User');

const controller = {
	register: (req, res) => {
		res.render('user/register');
	},
	processRegister: (req, res) => {
		const resultValidation = validationResult(req);
		if (resultValidation.errors.length > 0) {
			return res.render('user/register', {
				errors: resultValidation.mapped(),
				oldData: req.body
			});
		}
		
		let userInDB = User.findByField('email', req.body.email);

		if (userInDB) {
			return res.render('user/register', {
				errors: {
					email: {
						msg: "There's already an account with this email."
					}
				},
				oldData: req.body
			});
		}

		let userToCreate = {
			fullName: req.body.fullName,
			email: req.body.email,
			password: bcryptjs.hashSync(req.body.password, 10),
			avatar: req.file ? req.file.filename : 'default.png',
		}

		User.create(userToCreate);

		return res.redirect('/user/login');
	},
	login: (req, res) => {
		return res.render('user/login');
	},
	processLogin: (req, res) => {
		let userToLogin = User.findByField('email', req.body.email);
		
		if(userToLogin) {
			
			let isOkThePassword = bcryptjs.compareSync(req.body.password, userToLogin.password);
			if (isOkThePassword) {
				delete userToLogin.password;
				req.session.userLogged = userToLogin;
				if(req.body.remember_user) {
					res.cookie('userEmail', req.body.email, { maxAge: (1000 * 60) * 60 })
				}

				return res.redirect('/user/profile');
			} 
			return res.render('user/login', {
				errors: {
					email: {
						msg: 'Credentials are invalid'
					}
				}
			});
		}

		return res.render('user/login', {
			errors: {
				email: {
					msg: 'This email cannot be found in our database'
				}
			}
		});
	},
	profile: (req, res) => {
		return res.render('user/profile', {
			user: req.session.userLogged
		});
	},

	logout: (req, res) => {
		res.clearCookie('userEmail');
		req.session.destroy();
		return res.redirect('/');
	}
};

module.exports = controller