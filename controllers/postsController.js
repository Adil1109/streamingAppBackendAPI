const Post = require('../models/postsModel');
const Joi = require('joi');

exports.getPost = async (req, res) => {
	const { _id } = req.params;
	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Post id not found!' });
		}

		const existingPost = await Post.findOne({ _id });

		if (!existingPost) {
			return res
				.status(400)
				.json({ success: false, message: 'Post is already unavailable!' });
		}

		res.status(200).json({
			success: true,
			message: 'Here is the post!',
			data: existingPost,
		});
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the post' });
	}
};

exports.getPosts = async (req, res) => {
	const { page } = req.query;
	const postsPerPage = 10;

	try {
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Post.find()
			.sort({ createdAt: -1 })
			.skip(pageNum * postsPerPage)
			.limit(postsPerPage);

		res.status(200).json({ success: true, message: 'posts', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while getting the posts' });
	}
};

const joiSearchTermScheema = Joi.object({
	term: Joi.string().min(3).required(),
});

exports.searchPost = async (req, res) => {
	const { _term } = req.params;
	const { page } = req.query;
	const postsPerPage = 10;
	const term = _term.toLowerCase();

	try {
		const { error, value } = joiSearchTermScheema.validate({
			term,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid search term! ',
				error: error.details,
			});
		}
		let pageNum = 0;

		if (page <= 1) {
			pageNum = 0;
		} else {
			pageNum = page - 1;
		}
		const result = await Post.find({ $or: [{ title: { $regex: term } }] })
			.sort({ createdAt: -1 })
			.skip(pageNum * postsPerPage)
			.limit(postsPerPage);

		res.status(200).json({ success: true, message: 'posts', data: result });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while searching' });
	}
};

const joiPostScheema = Joi.object({
	title: Joi.string().min(5).required(),
	description: Joi.string().min(10).required(),
	thumbnailLink: Joi.string().uri().required(),
	videoLink: Joi.string().uri().required(),
	externelLink: Joi.string().uri().allow('').optional(),
});

exports.createPost = async (req, res) => {
	const { title, description, thumbnailLink, videoLink, externelLink } =
		req.body;
	try {
		const { error, value } = joiPostScheema.validate({
			title,
			description,
			thumbnailLink,
			videoLink,
			externelLink,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		await Post.create({
			title,
			description,
			thumbnailLink,
			videoLink,
			externelLink,
		});

		res
			.status(201)
			.json({ success: true, message: 'Post created successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while creating the post' });
	}
};

exports.updatePost = async (req, res) => {
	const { _id } = req.params;
	const { title, description, thumbnailLink, videoLink, externelLink } =
		req.body;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Post id not found!' });
		}

		const existingPost = await Post.findOne({ _id });

		if (!existingPost) {
			return res
				.status(400)
				.json({ success: false, message: 'Post is unavailable!' });
		}

		const { error, value } = joiPostScheema.validate({
			title,
			description,
			thumbnailLink,
			videoLink,
			externelLink,
		});

		if (error) {
			return res.status(400).json({
				success: false,
				message: 'Invalid data! ',
				error: error.details,
			});
		}

		existingPost.title = title;
		existingPost.description = description;
		existingPost.thumbnailLink = thumbnailLink;
		existingPost.videoLink = videoLink;
		existingPost.externelLink = externelLink;

		await existingPost.save();

		res
			.status(201)
			.json({ success: true, message: 'Post updated successfully!' });
	} catch (error) {
		return res.status(400).json({ message: 'Error while updating the post' });
	}
};

exports.deletePost = async (req, res) => {
	const { _id } = req.params;

	try {
		if (!_id) {
			return res
				.status(400)
				.json({ success: false, message: 'Post id not found!' });
		}

		const existingPost = await Post.findOne({ _id });

		if (!existingPost) {
			return res
				.status(400)
				.json({ success: false, message: 'Post is already unavailable!' });
		}

		await Post.deleteOne({ _id });

		res
			.status(203)
			.json({ success: true, message: 'Post deleted successfully!' });
	} catch (error) {
		return res
			.status(400)
			.json({ success: false, message: 'Error while deleting the post' });
	}
};
