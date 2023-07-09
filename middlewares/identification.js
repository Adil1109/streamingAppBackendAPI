const jwt = require('jsonwebtoken');

exports.identifier = (req, res, next) => {
	const token = req.header('auth-token');
	if (!token)
		return res.status(403).json({ message: 'You are not authorized' });

	try {
		const userToken = token.split(' ')[1];
		const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
		req.user = jwtVerified;
		if (req.user.email !== process.env.ADMIN_EMAIL) {
			return res
				.status(403)
				.json({ success: false, message: 'You are not authorized' });
		}
		next();
	} catch (err) {
		return res
			.status(403)
			.json({ success: false, message: 'You are not authorized' });
	}
};
