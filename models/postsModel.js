const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
	{
		title: {
			type: String,
			trim: true,
			minLength: 5,
			lowercase: true,
		},
		description: {
			type: String,
			trim: true,
			minLength: 5,
		},
		thumbnailLink: {
			type: String,
			trim: true,
		},
		videoLink: {
			type: String,
			trim: true,
		},
		externelLink: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
