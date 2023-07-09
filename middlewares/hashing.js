const { compare } = require('bcryptjs');

exports.doHashValidation = (value, hashedValue) => {
	const result = compare(value, hashedValue);
	return result;
};
