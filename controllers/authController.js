const Admin = require('../models/adminsModel');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { doHashValidation } = require('../middlewares/hashing');

const signinScheema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(3).required(),
});

exports.signin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const { error, value } = signinScheema.validate({ email, password });

		if (error) {
			return res
				.status(400)
				.json({ success: false, message: 'Invalid Credentials!' });
		}

		const existingAdmin = await Admin.findOne({ email });

		if (!existingAdmin) {
			return res.status(400).json({ message: 'Admin unavailable!' });
		}

		const result = await doHashValidation(password, existingAdmin.password);

		if (existingAdmin.email !== process.env.ADMIN_EMAIL || !result) {
			return res
				.status(400)
				.json({ success: false, message: 'Invalid Credentials!' });
		}

		const token = jwt.sign(
			{
				email,
			},
			process.env.TOKEN_SECRET,
			{
				expiresIn: '1h',
			}
		);

		res
			.status(200)
			.header('auth-token', token)
			.json({ success: true, token, message: 'You are logged in!' });
	} catch (err) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while authencating' });
	}
};
