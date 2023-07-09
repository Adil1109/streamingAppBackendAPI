const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
	{
		email: {
			type: String,
			trim: true,
			minLength: 5,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			trim: true,
			minLength: 6,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
